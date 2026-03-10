const { Car } = require("../models/Car");
const { Team } = require("../models/Team");
const { User } = require("../models/User");

const assignLeadToUser = async (carId) => {

  // 1️⃣ Validate Car
  const car = await Car.findOne({
    _id: carId,
    removed: false,
    enabled: true
  });

  if (!car) {
    throw new Error("Car not found or inactive");
  }

  // 2️⃣ Find Team for this Car Type
  const team = await Team.findOne({
    carTypes: car.carType,
    removed: false,
    enabled: true
  });

  if (!team) {
    throw new Error("No team assigned for this car type");
  }

  // 3️⃣ Get Active Users (Sorted FIFO)
  const users = await User.find({
    team: team._id,
    removed: false,
    enabled: true
  }).sort({ createdAt: 1 });

  if (!users.length) {
    throw new Error("No active users in team");
  }

  let nextUser;

  if (!team.lastAssignedUser) {
    nextUser = users[0];
  } else {

    const currentIndex = users.findIndex(
      user => user._id.toString() === team.lastAssignedUser?.toString()
    );

    const nextIndex = (currentIndex + 1) % users.length;

    nextUser = users[nextIndex];
  }

  // 4️⃣ Update Pointer
  team.lastAssignedUser = nextUser._id;
  await team.save();

  return {
    user: nextUser,
    team
  };
};

module.exports = { assignLeadToUser };