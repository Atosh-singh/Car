const express = require("express");
const router = express.Router();

const {createCar, getCars, updateCar, deleteCar
} = require('../controllers/car/index')

const authMiddleware = require("../middlewares/auth.middleware");
const permissionMiddleware = require("../middlewares/permission.middleware");

router.post(
  "/",
  authMiddleware,
  permissionMiddleware("CREATE_CAR"),
  createCar
);

router.get(
  "/",
  authMiddleware,
  permissionMiddleware("VIEW_CAR"),
  getCars
);

router.put(
  "/:id",
  authMiddleware,
  permissionMiddleware("UPDATE_CAR"),
  updateCar
);

router.delete(
  "/:id",
  authMiddleware,
  permissionMiddleware("DELETE_CAR"),
  deleteCar
);

module.exports = router;
