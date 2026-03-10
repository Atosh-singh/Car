const mongoose = require("mongoose");
const { Lead } = require("../models/Lead");
const { Car } = require("../models/Car");
const { assignLeadToUser } = require("./leadAssignmentService");
const paginate = require("../utils/pagination");


// ================= CREATE =================
const createLead = async (data) => {

  const existingLead = await Lead.findOne({
    phone: data.phone,
    removed: false
  });

  if (existingLead) {
    throw new Error("Lead already exists with this phone number");
  }

  let assignedUser = null;
  let assignedTeam = null;

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
const getLeadsForView = async (page = 1, limit = 10, search = "") => {

  const query = {
    removed: false
  };

  // 🔍 Search support
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: "i" } },
      { phone: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } }
    ];
  }

  const result = await paginate(
    Lead,
    query,
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



// ================= UPDATE STATUS =================
const updateLeadStatus = async (leadId, status, userId) => {

  if (!mongoose.Types.ObjectId.isValid(leadId)) {
    throw new Error("Invalid Lead ID");
  }

  const lead = await Lead.findOne({
    _id: leadId,
    removed: false
  });

  if (!lead) {
    throw new Error("Lead not found");
  }

  const previousStatus = lead.status;

  lead.status = status;

  lead.statusHistory.push({
    from: previousStatus,
    to: status,
    changedBy: userId,
    changedAt: new Date()
  });

  await lead.save();

  return lead
    .populate("assignedTo", "name")
    .populate("team", "name")
    .populate("car", "name");
};

module.exports = {
  createLead,
  updateLead,
  softDeleteLead,
  toggleLeadStatus,
  getLeadsForView,
  updateLeadStatus
};