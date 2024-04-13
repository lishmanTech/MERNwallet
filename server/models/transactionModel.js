const mongoose = require('mongoose')

const transactionScheme = new mongoose.Schema({
    amount: {
        type: Number,
        required: true
    },
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
    reference: {
        type: String,
        required: true
    },
    status: {
        type: String,
        required: true
    }

}, {
    timestamps: true
})

module.exports = mongoose.model("transactions", transactionScheme);