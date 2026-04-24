const redis = require("../config/redis");

const cache = (duration = 60, tag = null) => {
  return async (req, res, next) => {
    try {
      if (req.method !== "GET") return next();

      const cacheKey = `cache:${req.user._id}:${req.originalUrl}`;

      const cached = await redis.get(cacheKey);

      if (cached) {
        console.log("⚡ CACHE HIT");
        return res.json(JSON.parse(cached));
      }

      const originalJson = res.json.bind(res);

      res.json = async (data) => {
        try {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            const str = JSON.stringify(data);

            if (str.length < 1024 * 1024) {
              await redis.set(cacheKey, str, "EX", duration);

              if (tag) {
                await redis.sadd(`tag:${tag}`, cacheKey);
              }

              console.log("💾 Cached:", cacheKey);
            }
          }
        } catch (err) {
          console.error("Redis error:", err);
        }

        return originalJson(data);
      };

      next();
    } catch (err) {
      next();
    }
  };
};

module.exports = cache;