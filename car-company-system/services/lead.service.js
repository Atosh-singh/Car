const mongoose = require("mongoose");
const { Lead } = require("../models/Lead");
const { Car } = require("../models/Car");
const { assignLeadToUser } = require("./leadAssignmentService");
const paginate = require("../utils/pagination");


// ================= CREATE =================
const createLead = async (data) => {

  // 🔍 Duplicate phone check
  const existingLead = await Lead.findOne({
    phone: data.phone,
    removed: false
  });

  if (existingLead) {
    throw new Error("Lead already exists with this phone number");
  }

  let assignedUser = null;
  let assignedTeam = null;

  // 🔥 Validate Car + Auto Assign
  if (data.car) {

    const carExist = await Car.findOne({
      _id: data.car,
      removed: false,
      enabled: true
    });

    if (!carExist) {
      throw new Error("Invalid or inactive car");
    }

    const assignment = await assignLeadToUser(data.car);

    assignedUser = assignment.user;
    assignedTeam = assignment.team;
  }

  const lead = await Lead.create({
    ...data,
    assignedTo: assignedUser?._id,
    team: assignedTeam?._id,
    status: "New",
    assignmentHistory: assignedUser
      ? [{ user: assignedUser._id }]
      : []
  });

  // 🔥 Atomic increment
  if (assignedUser) {
    await assignedUser.updateOne({
      $inc: { activeLeads: 1 }
    });
  }

  return lead
    .populate("assignedTo", "name")
    .populate("team", "name")
    .populate("car", "name");
};



// ================= UPDATE =================
const updateLead = async (id, data) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Lead ID");
  }

  const allowedFields = ["name", "email", "phone", "status"];

  const updateData = {};

  Object.keys(data).forEach(key => {
    if (allowedFields.includes(key)) {
      updateData[key] = data[key];
    }
  });

  const updatedLead = await Lead.findOneAndUpdate(
    { _id: id, removed: false },
    { $set: updateData },
    { new: true }
  )
    .populate("assignedTo", "name email")
    .populate("team", "name")
    .populate("car", "name");

  return updatedLead;
};



// ================= SOFT DELETE =================
const softDeleteLead = async (id) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Lead ID");
  }

  return await Lead.findOneAndUpdate(
    { _id: id, removed: false },
    { removed: true },
    { new: true }
  );
};



// ================= TOGGLE ENABLE =================
const toggleLeadStatus = async (id) => {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid Lead ID");
  }

  const lead = await Lead.findOne({
    _id: id,
    removed: false
  });

  if (!lead) return null;

  lead.enabled = !lead.enabled;

  await lead.save();

  return lead;
};



// ================= GET FOR VIEW =================
const getLeadsForView = async (page = 1, limit = 10) => {

  const result = await paginate(
    Lead,
    { removed: false },
    {
      page,
      limit,
      populate: [
        { path: "car", select: "name" },
        { path: "team", select: "name" },
        { path: "assignedTo", select: "name" }
      ],
      sort: { createdAt: -1 }
    }
  );

  return result;
};



module.exports = {
  createLead,
  updateLead,
  softDeleteLead,
  toggleLeadStatus,
  getLeadsForView
};