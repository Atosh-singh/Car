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
            required: true,
        },
        phone: {
            type: String,
            required: true,
        },
        email: String,
        car: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Car",
        },
        assignedTo: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
        },
        team: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Team",
        },
        status: {
            type: String,
            enum: ["New", "Contacted", "Closed"],
            default: "New",
        },
    },
    { timestamps: true },
);

const Lead = mongoose.model("Lead", leadSchema);

module.exports = { Lead };
