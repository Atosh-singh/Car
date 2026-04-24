const mongoose = require("mongoose");
const { Lead } = require("../models/Lead");

const toObjectId = (value) => {
  if (!value) return null;
  if (value instanceof mongoose.Types.ObjectId) return value;
  if (!mongoose.Types.ObjectId.isValid(value)) return null;
  return new mongoose.Types.ObjectId(value);
};

const getDateRangeByPeriod = (period = "monthly") => {
  const now = new Date();
  const start = new Date(now);

  if (period === "daily") {
    start.setHours(0, 0, 0, 0);
  } else if (period === "weekly") {
    const day = start.getDay();
    const diff = day === 0 ? 6 : day - 1; // Monday start
    start.setDate(start.getDate() - diff);
    start.setHours(0, 0, 0, 0);
  } else if (period === "yearly") {
    start.setMonth(0, 1);
    start.setHours(0, 0, 0, 0);
  } else {
    // monthly default
    start.setDate(1);
    start.setHours(0, 0, 0, 0);
  }

  return { start, end: now };
};

const buildLeadMatch = ({ team = "all", status = "all", user } = {}) => {
  const match = { removed: false };

  if (status && status !== "all") {
    match.status = status;
  }

  if (team && team !== "all") {
    const teamId = toObjectId(team);
    if (teamId) {
      match.team = teamId;
    }
  }

  // role-based data visibility
  const role = user?.role;

  if (role !== "ADMIN" && role !== "SUPER_ADMIN") {
    if (user?.team) {
      const userTeamId = toObjectId(user.team);
      if (userTeamId) {
        match.team = userTeamId;
      }
    }

    if (user?._id || user?.id) {
      const userId = toObjectId(user._id || user.id);
      if (userId) {
        match.assignedTo = userId;
      }
    }
  }

  return match;
};

const getOverview = async ({ period = "monthly", team = "all", status = "all", user } = {}) => {
  const match = buildLeadMatch({ team, status, user });

  const [summary] = await Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: null,
        totalLeads: { $sum: 1 },
        wonLeads: {
          $sum: { $cond: [{ $eq: ["$status", "Won"] }, 1, 0] }
        },
        lostLeads: {
          $sum: { $cond: [{ $eq: ["$status", "Lost"] }, 1, 0] }
        },
        newLeads: {
          $sum: { $cond: [{ $eq: ["$status", "New"] }, 1, 0] }
        },
        pendingLeads: {
          $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
        }
      }
    },
    {
      $project: {
        _id: 0,
        totalLeads: 1,
        wonLeads: 1,
        lostLeads: 1,
        newLeads: 1,
        pendingLeads: 1,
        convertedLeads: "$wonLeads",
        conversionRate: {
          $cond: [
            { $eq: ["$totalLeads", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$wonLeads", "$totalLeads"] },
                    100
                  ]
                },
                2
              ]
            }
          ]
        }
      }
    }
  ]);

  return (
    summary || {
      totalLeads: 0,
      wonLeads: 0,
      lostLeads: 0,
      newLeads: 0,
      pendingLeads: 0,
      convertedLeads: 0,
      conversionRate: 0
    }
  );
};

const getTeamStats = async ({ team = "all", status = "all", user } = {}) => {
  const match = buildLeadMatch({ team, status, user });

  return Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$team",
        total: { $sum: 1 },
        won: {
          $sum: { $cond: [{ $eq: ["$status", "Won"] }, 1, 0] }
        },
        lost: {
          $sum: { $cond: [{ $eq: ["$status", "Lost"] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
        }
      }
    },
    {
      $lookup: {
        from: "teams",
        localField: "_id",
        foreignField: "_id",
        as: "team"
      }
    },
    {
      $unwind: {
        path: "$team",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 0,
        teamId: "$_id",
        teamName: { $ifNull: ["$team.name", "Unassigned Team"] },
        total: 1,
        won: 1,
        lost: 1,
        pending: 1,
        conversionRate: {
          $cond: [
            { $eq: ["$total", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$won", "$total"] },
                    100
                  ]
                },
                2
              ]
            }
          ]
        }
      }
    },
    { $sort: { total: -1 } }
  ]);
};

const getUserStats = async ({ team = "all", status = "all", user } = {}) => {
  const match = buildLeadMatch({ team, status, user });

  return Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$assignedTo",
        total: { $sum: 1 },
        won: {
          $sum: { $cond: [{ $eq: ["$status", "Won"] }, 1, 0] }
        },
        lost: {
          $sum: { $cond: [{ $eq: ["$status", "Lost"] }, 1, 0] }
        },
        pending: {
          $sum: { $cond: [{ $eq: ["$status", "Pending"] }, 1, 0] }
        }
      }
    },
    {
      $lookup: {
        from: "users",
        localField: "_id",
        foreignField: "_id",
        as: "user"
      }
    },
    {
      $unwind: {
        path: "$user",
        preserveNullAndEmptyArrays: true
      }
    },
    {
      $project: {
        _id: 0,
        userId: "$_id",
        userName: { $ifNull: ["$user.name", "Unassigned User"] },
        total: 1,
        won: 1,
        lost: 1,
        pending: 1,
        conversionRate: {
          $cond: [
            { $eq: ["$total", 0] },
            0,
            {
              $round: [
                {
                  $multiply: [
                    { $divide: ["$won", "$total"] },
                    100
                  ]
                },
                2
              ]
            }
          ]
        }
      }
    },
    { $sort: { total: -1 } }
  ]);
};

const getTodayLeads = async ({ team = "all", status = "all", user } = {}) => {
  const start = new Date();
  start.setHours(0, 0, 0, 0);

  const match = buildLeadMatch({ team, status, user });
  match.createdAt = { $gte: start };

  return Lead.countDocuments(match);
};

const getMonthLeads = async ({ team = "all", status = "all", user } = {}) => {
  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  const match = buildLeadMatch({ team, status, user });
  match.createdAt = { $gte: start };

  return Lead.countDocuments(match);
};

const getStatusStats = async ({ team = "all", user } = {}) => {
  const match = buildLeadMatch({ team, status: "all", user });

  return Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: "$status",
        value: { $sum: 1 }
      }
    },
    {
      $project: {
        _id: 0,
        type: { $ifNull: ["$_id", "Unknown"] },
        value: 1
      }
    },
    { $sort: { value: -1 } }
  ]);
};

const getLeadsTrend = async ({ period = "monthly", team = "all", status = "all", user } = {}) => {
  const { start, end } = getDateRangeByPeriod(period);
  const match = buildLeadMatch({ team, status, user });
  match.createdAt = { $gte: start, $lte: end };

  let groupId;
  let labelProjection;

  if (period === "daily") {
    groupId = {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
      day: { $dayOfMonth: "$createdAt" }
    };
    labelProjection = {
      $concat: [
        { $toString: "$_id.day" },
        "/",
        { $toString: "$_id.month" }
      ]
    };
  } else if (period === "weekly") {
    groupId = {
      year: { $isoWeekYear: "$createdAt" },
      week: { $isoWeek: "$createdAt" }
    };
    labelProjection = {
      $concat: [
        "Week ",
        { $toString: "$_id.week" }
      ]
    };
  } else if (period === "yearly") {
    groupId = {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" }
    };
    labelProjection = {
      $let: {
        vars: {
          months: [
            "",
            "Jan",
            "Feb",
            "Mar",
            "Apr",
            "May",
            "Jun",
            "Jul",
            "Aug",
            "Sep",
            "Oct",
            "Nov",
            "Dec"
          ]
        },
        in: {
          $arrayElemAt: ["$$months", "$_id.month"]
        }
      }
    };
  } else {
    // monthly
    groupId = {
      year: { $year: "$createdAt" },
      month: { $month: "$createdAt" },
      day: { $dayOfMonth: "$createdAt" }
    };
    labelProjection = {
      $concat: [
        { $toString: "$_id.day" },
        "/",
        { $toString: "$_id.month" }
      ]
    };
  }

  return Lead.aggregate([
    { $match: match },
    {
      $group: {
        _id: groupId,
        value: { $sum: 1 }
      }
    },
    { $sort: { "_id.year": 1, "_id.month": 1, "_id.week": 1, "_id.day": 1 } },
    {
      $project: {
        _id: 0,
        label: labelProjection,
        value: 1
      }
    }
  ]);
};

const getRecentActivities = async ({ limit = 10, team = "all", status = "all", user } = {}) => {
  const match = buildLeadMatch({ team, status, user });

  return Lead.find(match)
    .select("name status createdAt updatedAt assignedTo team")
    .sort({ updatedAt: -1 })
    .limit(limit)
    .lean()
    .then((leads) =>
      leads.map((lead) => ({
        _id: lead._id,
        title: `Lead ${lead.name || "Unnamed"} is ${lead.status || "updated"}`,
        time: lead.updatedAt || lead.createdAt
      }))
    );
};

module.exports = {
  getOverview,
  getTeamStats,
  getUserStats,
  getTodayLeads,
  getMonthLeads,
  getStatusStats,
  getLeadsTrend,
  getRecentActivities
};