const { CarType } = require("../../models/CarType");
const slugify = require("slugify");

const updateCarType = async (req, res) => {
  try {
    const { name, description } = req.body;

    const carType = await CarType.findById(req.params.id);

    if (!carType) {
      return res.status(404).json({
        success: false,
        message: "CarType not found"
      });
    }

    if (name) {
      const slug = slugify(name.trim(), { lower: true });

      const exists = await CarType.findOne({
        _id: { $ne: req.params.id },
        slug
      });

      if (exists) {
        return res.status(409).json({
          success: false,
          message: "CarType with this name already exists"
        });
      }

      carType.name = name.trim();
      carType.slug = slug;
    }

    if (description !== undefined) {
      carType.description = description;
    }

    await carType.save();

    res.status(200).json({
      success: true,
      data: carType
    });

  } catch (error) {
    console.error("Update CarType Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { updateCarType };
