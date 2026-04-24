const { getDashboard } = require("./getDashboard");
const { overview } = require("./overview");
const { todayLeads } = require("./todayLeads");
const { monthLeads } = require("./monthLeads");
const { teamStats } = require("./teamStats");
const { userStats } = require("./userStats");

module.exports = {
  getDashboard,
  overview,
  todayLeads,
  monthLeads,
  teamStats,
  userStats
};