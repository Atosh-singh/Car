const mongoose = require("mongoose");

const leadSchema = new mongoose.Schema(
  {
    removed: {
      type: Boolean,
      default: false
    },

    enabled: {
      type: Boolean,
      default: true
    },

    name: {
      type: String,
      required: true
    },

    phone: {
      type: String,
      required: true
    },

    email: String,

    car: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Car"
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team"
    },

    // 🔥 Upgraded Status Pipeline
    status: {
      type: String,
      enum: [
        "New",
        "Assigned",
        "Contacted",
        "Interested",
        "FollowUp",
        "TestDrive",
        "Won",
        "Lost",
        "Closed"   // Keeping your old status for backward compatibility
      ],
      default: "New"
    },

    // 🔥 Status Change History
    statusHistory: [
      {
        from: String,
        to: String,
        changedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User"
        },
        changedAt: {
          type: Date,
          default: Date.now
        }
      }
    ],

    // ✅ Keeping your existing assignment tracking
  assignmentHistory: [
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    assignedAt: {
      type: Date,
      default: Date.now
    },
    reassignedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    }
  }
]
  },
  { timestamps: true }
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = { Lead };