import User from "../model/userModel.js"
import validator from 'validator'
import bcrypt from 'bcryptjs'
import genToken from "../config/token.js"
import sendMail from "../config/sendMail.js"

export const signup = async (req,res) => {
    try {
        const {name,email,password,role} = req.body
        let existUser = await User.findOne({email})
        if(existUser){
            return res.status(400).json({message:"User already exists"})
        }
        if(!validator.isEmail(email)){
            return res.status(400).json({message:"Enter valid email"})
        }
        if(password.length < 8){
            return res.status(400).json({message:"Enter strong password"})
        }
        let hashPassword = await bcrypt.hash(password,10)
        const user = await User.create({
            name,
            email,
            password:hashPassword,
            role
        })
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7 * 24 * 60 * 60 * 1000
        })
        return res.status(201).json(user)
    } catch (error) {
        return res.status(500).json({message:`SignUp error ${error}`})
    }
}

export const login = async (req,res) => {
    try {
        const {email,password} = req.body
        let user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:"User not found!"})
        }
        let isMatch = await bcrypt.compare(password,user.password)
        if(!isMatch){
            return res.status(400).json({message:"Incorrect Password"})
        }
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({message:`Login error ${error}`})
    }
}

export const logout = async (req,res) => {
    try {
        await res.clearCookie("token")
        return res.status(200).json({message:"Logged out Successfully"})
    } catch (error) {
        return res.status(500).json({message:`Logout error ${error}`})
    }
}

export const sendOTP = async (req,res) => {
    try {
        const {email} = req.body
        const user = await User.findOne({email})
        if(!user){
            return res.status(404).json({message:`User not found`})
        }
        const otp = Math.floor(1000 + Math.random() * 9000).toString()
        user.resetOtp=otp
        user.otpExpires = Date.now() + 5 * 60 * 1000,
        user.isOtpVerified = false

        await user.save()
        await sendMail(email, otp)
        return res.status(200).json({message:"Otp Send successfully"})
    } catch (error) {
        return res.status(500).json({message:`send otp error ${error}`})
    }
}

export const verifyOTP = async (req,res) => {
    try {
        const { email, otp } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.resetOtp != otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'invalid/expired otp' });
        }

        // if (!user ||String(user.resetOtp) !== String(otp) || new Date(user.otpExpires) < new Date()) {
        //     return res.status(400).json({ message: 'Invalid or expired OTP' });
        // }

        user.isOtpVerified = true;
        user.resetOtp = undefined;
        user.otpExpires = undefined;

        await user.save();
        return res.status(200).json({ message: 'otp verified successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error verifying OTP', error: error.message }); 
    }
}


export const resetPassword = async (req,res) => {
    try {
        const {password, email} = req.body;
        const user = await User.findOne({email})
        if(!user || !user.isOtpVerified) {
            return res.status(400).json({ message: 'User not found or OTP not verified' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        user.password = hashedPassword;
        user.isOtpVerified = false;
        await user.save();

        return res.status(200).json({ message: 'Password reset successfully' });
    } catch (error) {
        return res.status(500).json({ message: 'Error resetting password', error: error.message });
    }
}

export const googleAuth = async (req,res) => {
    try {
        const {name,email,role} = req.body
        const user = await User.findOne({email})
        if(!user){
            user = await User.create({
                name,
                email,
                role
            })
        }
        let token = await genToken(user._id)
        res.cookie("token",token,{
            httpOnly:true,
            secure:true,
            sameSite:"none",
            maxAge:7 * 24 * 60 * 60 * 1000
        })
        return res.status(200).json(user)
    } catch (error) {
        return res.status(500).json({ message: 'Google Auth error', error: error.message });
    }
}
