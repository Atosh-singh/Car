const { CarType } = require("../../models/CarType");
const slugify = require("slugify");

const createCarType = async (req, res) => {
  try {
    const { name, description } = req.body;

    const slug = slugify(name, { lower: true });

    const exists = await CarType.findOne({ slug });

    if (exists) {
      return res.status(409).json({
        message: "Car type already exists"
      });
    }

    const carType = await CarType.create({
      name,
      slug,
      description
    });

    res.status(201).json({
      success: true,
      data: carType
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = { createCarType };
