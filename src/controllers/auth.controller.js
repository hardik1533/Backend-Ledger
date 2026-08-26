const userModel = require('../models/user.model');
const jwt = require('jsonwebtoken');
const emailSender = require('../services/email.service');
const tokenBlacklistModel = require('../models/backList.model');

async function userRegisterController(req,res){
    const {email, name , password} = req.body;

    const isExist = await userModel.findOne({
        email: email
    })

    if(isExist){
        return res.status(422).json({
            message: "User already exists.",
            status: "failed"
        })
    }

    const user = await userModel.create({
        email, name , password
    })

    const token = jwt.sign({userid: user._id}, process.env.JWT_SECRET,{expiresIn: "3d"});

    res.cookie("token", token);

    res.status(201).json({
        message: "User register in successfully!",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        }
    })
}

async function userLoginController(req,res){
    const { email, password} = req.body;

    const user = await userModel.findOne({email}).select("+password");

    if(!user){
        return res.status(401).json({
            message: "User not found."
        })
    }

    const isValidPassword = await user.comparePassword(password);

    if(!isValidPassword){
        return res.status(401).json({
            message: "User is not found."
        })
    }

    const token = jwt.sign({userid: user._id}, process.env.JWT_SECRET,{expiresIn: "3d"});

    res.cookie("token", token);

    res.status(200).json({
        message: "User logged in successfully!",
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
        }
    })

    await emailSender.sendRegistrationEmail(user.email, user.name);
}

async function userLogoutController(req, res) {
    const token = req.cookies.token || req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(200).json({
            message: "No token provided."
        });
    }

    

    await tokenBlacklistModel.create({ token });

    res.clearCookie("token");

    res.status(200).json({
        message: "User logged out successfully."
    });
    
}

module.exports = {userRegisterController , userLoginController, userLogoutController}