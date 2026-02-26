const { getLeadsForView } = require("../../services/lead.service");

const getLead = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const result = await getLeadsForView(page, limit);

    console.log("SERVICE RESULT:", result);
    console.log("Is data array?", Array.isArray(result.data));

    res.render("crm/leads", {
      layout: "layouts/crm",
      title: "Leads",
      currentPage: "leads",
      user: req.user,
      leads: result.data || [],   // 🔥 FORCE SAFE
      pagination: result.pagination
    });

  } catch (error) {
    console.error("Controller Error:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

module.exports = { getLead };