const mongoose = require('mongoose')

const requestScheme = new mongoose.Schema({
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    reciever: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    status: {
        type: String,
        default: "pending"
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("requests", requestScheme);