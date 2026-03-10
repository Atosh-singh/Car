const { getLeadsForView } = require("../../services/lead.service");

const getLead = async (req, res) => {

  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || "";

    const result = await getLeadsForView(page, limit, search);

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