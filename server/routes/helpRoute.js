const router = require('express').Router
const Request = require('../models/requestsModel')
const authMiddleware = require('../middlewares/authMiddleware')

//get all the transaction of a single user
router.post("/get-all-requestss-by-user", authMiddleware, async (req, res) => {
    try {
        const requests = await Request.find({
            $or: [{ sender: req.body._id }, { reciever: req.body._id }],
        }).populate("sender").populate("reciever");
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

module.exports = router