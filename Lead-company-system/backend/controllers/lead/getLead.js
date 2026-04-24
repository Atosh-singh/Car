const { getLeadsForView } = require("../../services/lead.service");

const getLead = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";
    const status = req.query.status || "";
    const assignedTo = req.query.assignedTo || "";

    console.log("📦 Fetching from Database");

    const result = await getLeadsForView({
      page,
      limit,
      search,
      status,
      assignedTo,
        // 🔥 PASS USER CONTEXT
      user: req.user
    });

    res.json({
      success: true,
      data: result.data,
      pagination: result.pagination
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: "Something went wrong"
    });
  }
};

module.exports = { getLead };