const express = require('express')
const userModel = require('../Models/userModel')
const jwt = require('jsonwebtoken')
const bycrypt = require('bcryptjs')
const generateToken = require('../utils/auth/decodeJWT')

const RegisterUser = async(req,res)=>{
    try {
        const {fullname,email,password,gender,dob,purpose} = req.body

        if(!fullname || !email || !password || !gender || !dob){
            return res.status(400).json({
                success:false,
                message:'Some Fields are still missing',
            })
        }

        const userFind = await userModel.findOne({email})

        if(userFind){
            return res.status(400).json({
                success:false,
                message:"User Already Exists!"
            })
        }

        const genSalts = await bycrypt.genSalt(10)
        const encryptPassword =await bycrypt.hash(password,genSalts)

        const createUser = await userModel.create({
            fullname,
            email,
            password:encryptPassword,
            gender,
            dob,
            purpose
        })

        if(!createUser) {
            return res.status(400).json({
                success:false,
                message:"Cannot Create User"
            })
        }

        return res.status(200).json({
            success:true,
            message:"User Successfully Created",
            userData:{
            _id:createUser._id,
            fullname:createUser.fullname,
            email:createUser.email,
            dob:createUser.dob,
            gender:createUser.gender,
            purpose:createUser.purpose
        },
        })

    } catch (error) {
        console.error(error)
        return res.status(500).json({
            success:false,
            message:"Internal Server Error",
            error
        })
    }
}

const loginUsers = async (req,res) =>{
    try{
    const {email,password} = req.body

    if(!email || !password) {
        return res.status(401).json({
            success:false,
            message:"Credentials not detected"
        })
    }

    const findUser = await userModel.findOne({email})

    if (!findUser) {
        return res.status(401).json({
            success:false,
            message:"User or Password Not Matched"
        })
    }

    const isMatch = await bycrypt.compare(password,findUser.password)

    if(!isMatch){
        return res.status(401).json({
            success:false,
            message:"User or Password Not Matched"
        })
    }

    const generateTokens = generateToken(findUser._id)

    return res.status(200).json({
        success:true,
        message:"Successfully Logged In!",
        userDetails:{
            _id:findUser._id,
            fullname:findUser.fullname,
            email:findUser.email,
            dob:findUser.dob,
            gender:findUser.gender,
            purpose:findUser.purpose
        },
        token:generateTokens
    })
}
catch(error){
    console.error(error)
    return res.status(500).json({
        success:false,
        message:"Internal Server Error"
    })
}
}

module.exports = {RegisterUser,loginUsers}