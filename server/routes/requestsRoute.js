const router = require('express').Router()
const Request = require('../models/requestsModel')
const authMiddleware = require('../middlewares/authMiddleware')
const User = require('../models/userModel')
const Transaction = require('../models/transactionModel')

//get all the transaction of a single user
router.post("/get-all-requests-by-user", authMiddleware, async (req, res) => {
    try {
        const requests = await Request.find({
            $or: [{ sender: req.body.userId }, { reciever: req.body.userId }],
        }).populate("sender").populate("reciever").sort({createdAt: -1});
        res.send({
            message: "Request Fetched Successfully",
            data: requests,
            success: true
        });

    } catch (error) {
        res.send({
            message: "request isnt Fetched",
            data: error.message,
            success: false
        });
    }
})

//Send request to another User
router.post("/send-request", authMiddleware, async (req, res) => {
    try {
        const { reciever, amount, description } = req.body;

        const request = new Request({
            sender: req.body.userId,
            reciever,
            amount,
            description,
        })
        await request.save()

        res.send({
            message: "Request Sent Successfully",
            data: request,
            success: true,
        });

    } catch (error) {
        res.send({
            message: "request isnt Sent",
            data: error.message,
            success: false
        });
    }

});

router.post("/update-request-status", authMiddleware, async (req, res) => {
    try {
        if (req.body.status === "accepted") {

            const transaction = new Transaction({
                sender: req.body.reciever._id,
                reciever: req.body.sender._id,
                amount: req.body.amount,
                reference: req.body.description,
                status: "success"
            })
            await transaction.save();

            await User.findByIdAndUpdate(req.body.sender._id, {
                $inc: { balance: req.body.amount },
            });

            await User.findByIdAndUpdate(req.body.reciever._id, {
                $inc: { balance: -req.body.amount },
            });
        }

        await Request.findByIdAndUpdate(req.body._id, {
            status: req.body.status,
        })

        res.send({
            data: null,
            message: "Request status has been succesfully updated",
            success: true
        });
    } catch (error) {
        res.send({
            data: error,
            message: error.message,
            success: false
        });
    }
})

module.exports = router