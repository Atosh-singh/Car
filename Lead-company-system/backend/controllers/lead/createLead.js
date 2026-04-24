const leadService = require("../../services/lead.service");
const { clearCache } = require("../../utils/cacheInvalidator");

const createLead = async (req, res) => {
  try {
    let { name, phone, car, email, interest, source, locationData, utm_source,
      utm_medium,
      utm_campaign, website } = req.body;

    // 🛡 Honeypot protection
    if (website) {
      return res.status(400).json({
        success: false,
        message: "Spam detected"
      });
    }

    // 🔧 Sanitization
    name = name?.trim();
    phone = phone?.trim();
    email = email?.trim();
    interest = interest?.trim();
    source = source?.trim();
    locationData = locationData?.trim();


    // ❗ Required validation
    if (!name || !phone) {
      return res.status(400).json({
        success: false,
        message: "Name and phone required"
      });
    }

    // 📱 Phone validation
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        success: false,
        message: "Invalid phone number"
      });
    }

    // 🔥 Just pass raw data to service
     // 🔥 PASS CLEAN DATA TO SERVICE
    const lead = await leadService.createLead({
      name,
      phone,
      car,
      email,
      interest,
      source,
      locationData,

      // ✅ UTM SUPPORT (IMPORTANT)
      utm: {
        source: utm_source,
        medium: utm_medium,
        campaign: utm_campaign
      }
    });

    // 🧹 Clear cache
    await clearCache("leads");

    // 🔔 SOCKET EMIT (SAFE)
    if (global.io) {

      if (lead.team) {
        global.io.to(`team_${lead.team}`).emit("new_lead", lead);
      }

      if (lead.assignedTo) {
        global.io.to(`user_${lead.assignedTo}`).emit("lead_assigned", lead);
      }
    }

    return res.status(201).json({
      success: true,
      message: "Lead created successfully",
      data: lead
    });

  } catch (error) {

    console.error("Create Lead Error:", error.message); // 🔥 logging

    if (error.message.includes("already exists")) {
      return res.status(409).json({
        success: false,
        message: error.message
      });
    }

    return res.status(400).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = { createLead };
