const { Team } = require("../../models/Team");

const updateTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;

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
    }

    const team = await Team.findByIdAndUpdate(
      id,
      req.body,
      { new: true }
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

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
