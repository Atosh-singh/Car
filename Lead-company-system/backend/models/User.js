const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    removed: {
      type: Boolean,
      default: false,
    },

    enabled: {
      type: Boolean,
      default: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Team",
      default: null,
    },

    activeLeads: {
      type: Number,
      default: 0,
    },

    // ✅ ADD THESE
    image: {
      type: String,
      default: null,
    },

    image_public_id: {
      type: String,
      default: null,
    },
    // ✅ DATA ACCESS CONTROL
    dataScope: {
      type: String,
      enum: ["OWN", "TEAM", "ALL"],
      default: "OWN",
    },

    // ✅ MULTI-TEAM ACCESS (VERY POWERFUL)
    extraTeams: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Team"
      }
    ],

    // ✅ OPTIONAL: DIRECT USER ACCESS (ADVANCED)
    extraUsers: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],
    // ✅ LAST SEEN (for online/offline tracking)
    lastSeen: {
      type: Date,
      default: null
    },
    // ✅ IS ONLINE (optional - socket use)
    isOnline: {
      type: Boolean,
      default: false
    }

  },
  { timestamps: true },
);

// Important: compound index for active login queries
userSchema.index({ email: 1, removed: 1 });

const User = mongoose.model("User", userSchema);

module.exports = { User };
