const { Lead } = require("../models/Lead");

// CREATE
const createLead = async (data) => {

  // 🔍 Check duplicate phone (only active leads)
  const existingLead = await Lead.findOne({
    phone: data.phone,
    removed: false
  });

  if (existingLead) {
    throw new Error("Lead already exists with this phone number");
  }

  return await Lead.create(data);
};

// READ (only active leads)
const getLeads = async (filter = {}) => {
  const finalFilter = {
    removed: false,
    enabled: true,
    ...filter,
  };

  return await Lead.find(finalFilter)
    .populate("assignedTo", "name email")
    .populate("car", "name type")
    .populate("team", "name carType")
    .sort({ createdAt: -1 });
};

// UPDATE
const updateLead = async (id, data) => {
  return await Lead.findOneAndUpdate(
    { _id: id, removed: false },
    data,
    { new: true }
  );
};


// SOFT DELETE
const softDeleteLead = async (id) => {
  return await Lead.findByIdAndUpdate(id, {
    removed: true,
    enabled: false,
  });
};

// TOGGLE ENABLE
const toggleLeadStatus = async (id) => {
  const lead = await Lead.findById(id);
  if (!lead) return null;

  lead.enabled = !lead.enabled;
  return await lead.save();
};

module.exports = {
  createLead,
  getLeads,
  updateLead,
  softDeleteLead,
  toggleLeadStatus,
};
