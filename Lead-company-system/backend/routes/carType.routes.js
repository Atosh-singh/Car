const express = require("express");
const router = express.Router();

const {
 createCarType, getCarTypes, updateCarType, deleteCarType
} = require("../controllers/CarType/index");

const authMiddleware = require("../middlewares/auth.middleware");
const permissionMiddleware = require("../middlewares/permission.middleware");

router.post(
  "/",
  authMiddleware,
  permissionMiddleware("CREATE_CAR_TYPE"),
  createCarType
);

router.get(
  "/",
  authMiddleware,
  permissionMiddleware("VIEW_CAR_TYPE"),
  getCarTypes
);

router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("UPDATE_CAR_TYPE"),
  updateCarType
);

router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("DELETE_CAR_TYPE"),
  deleteCarType
);

module.exports = router;
