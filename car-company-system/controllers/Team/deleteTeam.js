const { Team } = require("../../models/Team");

const deleteTeam = async (req, res) => {
  try {
    const { id } = req.params;
    const { hard } = req.query;

    const team = await Team.findById(id);

    if (!team) {
      return res.status(404).json({
        success: false,
        message: "Team not found"
      });
    }

    if (hard === "true") {
      await Team.findByIdAndDelete(id);

      return res.json({
        success: true,
        message: "Team permanently deleted"
      });
    }

    team.removed = true;
    await team.save();

    res.json({
      success: true,
      message: "Team soft deleted"
    });

  } catch (error) {
    console.error("Delete Team Error:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { deleteTeam };
