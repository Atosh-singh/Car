const { Car } = require("../models/Car");
const { Team } = require("../models/Team");
const { User } = require("../models/User");

// ✅ OPTIONAL (RULE ENGINE)
let LeadRoutingRule;
try {
  LeadRoutingRule = require("../models/LeadRoutingRule").LeadRoutingRule;
} catch (e) {
  // ignore if not created yet
}

// ===============================
// 🔥 FIND MATCHING RULE (UTM + CAR)
// ===============================
const findMatchingRule = async (lead) => {
  if (!LeadRoutingRule) return null;

  const rules = await LeadRoutingRule.find().sort({ priority: -1 });

  for (let rule of rules) {
    const c = rule.conditions;

    if (
      (!c.utm_source || c.utm_source === lead.utm?.source) &&
      (!c.utm_medium || c.utm_medium === lead.utm?.medium) &&
      (!c.utm_campaign || c.utm_campaign === lead.utm?.campaign) &&
      (!c.carType || c.carType.toString() === lead.carType?.toString()) &&
      (!c.car || c.car.toString() === lead.car?.toString())
    ) {
      return rule;
    }
  }

  return null;
};

// ===============================
// 🔥 MAIN ASSIGNMENT FUNCTION
// ===============================
const assignLeadToUser = async (leadData) => {

  let team = null;

  // ===============================
  // 1️⃣ TRY RULE-BASED ASSIGNMENT
  // ===============================
  const rule = await findMatchingRule(leadData);

  if (rule && rule.teams?.length) {
    team = await Team.findOne({
      _id: rule.teams[0],
      removed: false,
      enabled: true
    });
  }

  // ===============================
  // 2️⃣ FALLBACK → CAR TYPE LOGIC
  // ===============================
  if (!team) {

    const car = await Car.findOne({
      _id: leadData.car,
      removed: false,
      enabled: true
    });

    if (!car) {
      throw new Error("Car not found or inactive");
    }

    team = await Team.findOne({
      carTypes: car.carType,
      removed: false,
      enabled: true
    });

    if (!team) {
      throw new Error("No team assigned for this car type");
    }

    // attach for rule matching next time
    leadData.carType = car.carType;
  }

  // ===============================
  // 3️⃣ GET USERS (SMART FILTER)
  // ===============================
  const users = await User.find({
    team: team._id,
    removed: false,
    enabled: true,
    activeLeads: { $lt: team.maxLeadsPerUser } // 🔥 load balancing
  }).sort({ activeLeads: 1 }); // least loaded first

  if (!users.length) {
    throw new Error("No active users available in team");
  }

  let nextUser;

  // ===============================
  // 4️⃣ ASSIGNMENT STRATEGY
  // ===============================

  if (team.assignmentType === "LOAD_BALANCED") {
    // 🔥 pick least loaded
    nextUser = users[0];
  } else {
    // 🔁 ROUND ROBIN (DEFAULT)

    if (!team.lastAssignedUser) {
      nextUser = users[0];
    } else {
      const currentIndex = users.findIndex(
        user => user._id.toString() === team.lastAssignedUser?.toString()
      );

      const nextIndex = (currentIndex + 1) % users.length;
      nextUser = users[nextIndex];
    }
  }

  // ===============================
  // 5️⃣ RETURN RESULT (NO SAVE)
  // ===============================
  return {
    user: nextUser,
    team
  };
};

module.exports = {
  assignLeadToUser
};