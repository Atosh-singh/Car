const { Team } = require("../../models/Team");
const { CarType } = require("../../models/CarType");

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, carTypes } = req.body;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    // 🔹 Update name (with duplicate check)
    if (name) {
      const existing = await Team.findOne({
        _id: { $ne: id },
        name: name.trim(),
        removed: false
      });

      if (existing) {
        return res.status(409).json({
          success: false,
          message: "Team name already exists"
        });
      }

      team.name = name.trim();
    }

    // 🔹 Update carTypes (slug-based)
    if (carTypes) {
      if (!Array.isArray(carTypes) || carTypes.length === 0) {
        return res.status(400).json({
          success: false,
          message: "carTypes must be a non-empty array"
        });
      }

      const foundCarTypes = await CarType.find({
        slug: { $in: carTypes.map(ct => ct.toLowerCase()) }
      });

      if (foundCarTypes.length !== carTypes.length) {
        return res.status(400).json({
          success: false,
          message: "One or more carTypes are invalid"
        });
      }

      team.carTypes = foundCarTypes.map(ct => ct._id);
    }

    await team.save();

    res.status(200).json({
      success: true,
      data: team
    });

  } catch (error) {
    console.error("Update Team Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { updateTeam };
