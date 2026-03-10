const paginate = async (model, query = {}, options = {}) => {

  const page = parseInt(options.page) || 1;
  const limit = parseInt(options.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await model.countDocuments(query);

  const data = await model.find(query)
    .populate(options.populate || [])
    .sort(options.sort || { createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    data,
    pagination: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
      hasNextPage: page < Math.ceil(total / limit),
      hasPrevPage: page > 1
    }
  };
};

module.exports = paginate;