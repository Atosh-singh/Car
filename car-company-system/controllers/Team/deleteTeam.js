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

    // 🔥 HARD DELETE
    if (hard === "true") {
      await Team.findByIdAndDelete(id);

      return res.status(200).json({
        success: true,
        message: "Team permanently deleted"
      });
    }

    // 🔥 SOFT DELETE (Default)
    team.removed = true;
    team.enabled = false;
    await team.save();

    return res.status(200).json({
      success: true,
      message: "Team soft deleted"
    });

  } catch (error) {
    console.error("Delete Team Error:", error);
    return res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
};

module.exports = { deleteTeam };
