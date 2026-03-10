const { createLead } = require("./createLead");
const { getLead } = require("./getLead");
const { updateLead } = require("./updateLead");
const { removeLead } = require("./removeLead");
const { toggleLeadStatus } = require("./toggleLeadStatus");
const { updateLeadStatus } = require("./updateLeadStatus");
const { assignLead } = require("./assignLead");

module.exports = {
createLead,
getLead,
updateLead,
removeLead,
toggleLeadStatus,
updateLeadStatus,
assignLead
};