const mongoose = require("mongoose");
const { Car } = require("../../models/Car");
const leadService = require("../../services/lead.service");

const createLead = async (req, res) => {
  try {
    let { name, phone, car, website } = req.body;

    // 🛡 Honeypot (Bot Protection)
    if (website) {
      return res.status(400).json({
        message: "Spam detected",
      });
    }

    // Trim inputs
    name = name?.trim();
    phone = phone?.trim();

    // Required fields check
    if (!name || !phone) {
      return res.status(400).json({
        message: "Name and phone required",
      });
    }

    // 🛡 Phone Validation (10 digit Indian format)
    if (!/^\d{10}$/.test(phone)) {
      return res.status(400).json({
        message: "Invalid phone number",
      });
    }

    // Car validation (if provided)
    if (car) {
      if (!mongoose.Types.ObjectId.isValid(car)) {
        return res.status(400).json({
          message: "Invalid Car ID",
        });
      }

      const carExist = await Car.findById(car);
      if (!carExist) {
        return res.status(404).json({
          message: "Car not found",
        });
      }
    }

    const lead = await leadService.createLead({
      name,
      phone,
      car,
    });

    res.status(201).json({
      message: "✅ Lead created",
      data: lead,
    });

  } catch (error) {

    if (error.message.includes("already exists")) {
      return res.status(409).json({
        message: error.message,
      });
    }

    res.status(500).json({
      message: error.message,
    });
  }
};

module.exports = { createLead };
