const router = require('express').Router()
const User = require('../models/userModel');
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

//User Account registration
router.post('/register', async (req, res) => {
    try {
        //Check to see if user exist
        let exisitingUser = await User.findOne({ email: req.body.email });
        if (exisitingUser) {
            return res.send(
                {
                    message: "User Already Exist",
                    success: false
                });
        }
        //Hashing Password
        const password = req.body.password;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        req.body.password = hashedPassword;
        const newUser = new User(req.body);
        await newUser.save();
        res.send({
            message: "User Registration successful",
            data: null,
            success: true
        })
    } catch (error) {
        res.send({
            messagge: error.message,
            success: false
        })
    }
})

//User Login
router.post('/login', async (req, res) => {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.send(
                {
                    message: "Username is Incorrectt",
                    success: false
                });
        }
        //checking to see if password is correct

        const isMatch = await bcrypt.compare(req.body.password, user.password);
        if (!isMatch) {
            return res.send(
                {
                    message: "Invlid EMail or Password",
                    success: false
                });
        }
        // Checking to see if user is verified or not
        if (!user.isVerified) {
            return res.send(
                {
                    message: "User is not verified",
                    success: false
                });
        }

        //Generate Token
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
            expiresIn: "1d",
        });
        res.send(
            {
                message: "Login Success",
                data: token,
                success: true,
            });
    } catch (error) {
        res.send({
            message: error.message,
            success: false
        })
    }
})
//Get User Info
router.post('/get-users-info', authMiddleware, async (req, res) => {
    try {
        const user = await User.findById(req.body.userId);
        // user.password = '****'
        res.send({
            message: "User Information Fetched Succesfully",
            data: user,
            success: true,
        })
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
        })
    }
})

//Get All Users
router.post('/get-all-users', authMiddleware, async (req, res) => {
    try {
        const user = await User.find();
        res.send({
            message: "Users Information Fetched Succesfully",
            data: user,
            success: true,
        })
    } catch (error) {
        res.send({
            message: error.message,
            success: false,
        })
    }
})

router.post('/update-user-verified-status', authMiddleware, async (req, res) => {
     try {
         await User.findByIdAndUpdate(req.body.selectedUser, {
            isVerified: req.body.isVerified,})

            res.send({
                data:null,
                success: true,
                message: "User detail verified successfully"
            })
     } catch (error) {
        res.send({
            data:error,
            success: false,
            message: error.message,
        })
     }
})

router.post('/user-info', authMiddleware, async (req, res) =>{
 try {
    const user = await User.findOne({ userId: req.body.userId });
    res.send({
      success: true,
      message: "User details fetched successfully",
      data: user,
    });
      
 } catch (error) {
    console.log(error);
      res.send({
        success: false,
        message: error.message,
      });
 }
})
  

module.exports = router;