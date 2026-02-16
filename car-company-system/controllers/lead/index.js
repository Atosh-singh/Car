const { createLead } = require("./createLead");
const { getLead } = require("./getLead");
const { updateLead } = require("./updateLead");
const { removeLead } = require("./removeLead");
const { toggleLeadStatus  } = require("./toggleLeadStatus" );

module.exports = {
  createLead,
  getLead,
  updateLead,
  removeLead,
  toggleLeadStatus ,
};
