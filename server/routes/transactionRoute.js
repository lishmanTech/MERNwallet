const router = require('express').Router()
const authMiddleware = require('../middlewares/authMiddleware')
const User = require('../models/userModel')
const Transaction = require('../models/transactionModel')

//routes to handle the transfer of funds 
router.post("/transfer-fund", authMiddleware, async (req, res) => {
    try {
        //Code to save the transaction
        const newTransact = new Transaction(req.body)
        await newTransact.save()

        //decrease the sender's Balance 
        await User.findByIdAndUpdate(req.body.sender, {
            $inc: { balance: -req.body.amount },
        });

        //Increase the sender's Balance 
        await User.findByIdAndUpdate(req.body.reciever, {
            $inc: { balance: req.body.amount },
        });
        res.send({
            message: "Money sent Succesfully",
            data: newTransact,
            success: true
        })
    } catch (error) {
        res.send({
            message: "Transaction failed",
            data: error.message,
            success: false
        })
    }
})

//Verify if account exist
router.post("/verify-account", authMiddleware, async (req, res) => {
    try {
        const user = await User.findOne({ _id: req.body.receiver })
        if (user) {
            res.send({
                message: "Account is Verified",
                data: user,
                success: true
            })
        }
        else {
            res.send({
                message: "Account is Invalid",
                data: null,
                success: flase
            })
        }
    } catch (error) {
        res.send({
            message: "Account is Invalid",
            data: error.message,
            success: false
        })
    }
})

//get all the transaction of a single user
router.post("/get-all-transactions-by-user", authMiddleware, async (req, res) => {
    try {
        const transactions = await Transaction.find({
            $or: [{ sender: req.body.userId }, { reciever: req.body.userId }],
        }).sort({ createdAt: -1 }).populate("sender").populate("reciever");
        res.send({
            message: "Transaction Fetched Successfully",
            data: transactions,
            success: true
        });

    } catch (error) {
        res.send({
            message: "Transaction isnt Fetched",
            data: error.message,
            success: false
        });
    }
})

module.exports = router;