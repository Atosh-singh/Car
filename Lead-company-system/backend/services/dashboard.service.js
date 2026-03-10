const { Lead } = require("../models/Lead");
const mongoose = require("mongoose");


// ================= OVERVIEW =================
const getOverview = async () => {

  const totalLeads = await Lead.countDocuments({ removed: false });

  const wonLeads = await Lead.countDocuments({
    removed: false,
    status: "Won"
  });

  const lostLeads = await Lead.countDocuments({
    removed: false,
    status: "Lost"
  });

  const conversionRate = totalLeads
    ? ((wonLeads / totalLeads) * 100).toFixed(2)
    : 0;

  return {
    totalLeads,
    wonLeads,
    lostLeads,
    conversionRate
  };
};


// ================= TEAM STATS =================
const getTeamStats = async () => {

  return Lead.aggregate([
    { $match: { removed: false } },
    {
      $group: {
        _id: "$team",
        total: { $sum: 1 },
        won: {
          $sum: {
            $cond: [{ $eq: ["$status", "Won"] }, 1, 0]
          }
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
    { $unwind: "$team" },
    {
      $project: {
        teamName: "$team.name",
        total: 1,
        won: 1,
        conversionRate: {
          $cond: [
            { $eq: ["$total", 0] },
            0,
            { $multiply: [{ $divide: ["$won", "$total"] }, 100] }
          ]
        }
      }
    }
  ]);
};


// ================= USER STATS =================
const getUserStats = async () => {

  return Lead.aggregate([
    { $match: { removed: false } },
    {
      $group: {
        _id: "$assignedTo",
        total: { $sum: 1 },
        won: {
          $sum: {
            $cond: [{ $eq: ["$status", "Won"] }, 1, 0]
          }
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
    { $unwind: "$user" },
    {
      $project: {
        userName: "$user.name",
        total: 1,
        won: 1,
        conversionRate: {
          $cond: [
            { $eq: ["$total", 0] },
            0,
            { $multiply: [{ $divide: ["$won", "$total"] }, 100] }
          ]
        }
      }
    }
  ]);
};


// ================= TODAY LEADS =================
const getTodayLeads = async () => {

  const start = new Date();
  start.setHours(0, 0, 0, 0);

  return Lead.countDocuments({
    removed: false,
    createdAt: { $gte: start }
  });
};


// ================= MONTH LEADS =================
const getMonthLeads = async () => {

  const start = new Date();
  start.setDate(1);
  start.setHours(0, 0, 0, 0);

  return Lead.countDocuments({
    removed: false,
    createdAt: { $gte: start }
  });
};


module.exports = {
  getOverview,
  getTeamStats,
  getUserStats,
  getTodayLeads,
  getMonthLeads
};