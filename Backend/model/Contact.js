const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        lowercase: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    inviteSent: {
        type: Boolean,
        required: true,
    },
    contactId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
});

module.exports = mongoose.model("Contact", contactSchema);

