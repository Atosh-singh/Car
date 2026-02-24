const { CarType } = require("../../models/CarType");
const slugify = require("slugify");

const createCarType = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name) {
      return res.status(400).json({
        success: false,
        message: "Name is required"
      });
    }

    const slug = slugify(name.trim(), { lower: true });

    const exists = await CarType.findOne({ slug });

    if (exists) {
      return res.status(409).json({
        success: false,
        message: "Car type already exists"
      });
    }

    const carType = await CarType.create({
      name: name.trim(),
      slug,
      description
    });

    res.status(201).json({
      success: true,
      data: carType
    });

  } catch (error) {
    console.error("Create CarType Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { createCarType };
