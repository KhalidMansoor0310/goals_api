const express = require('express');
const User = require('../models/User')
const UserRoute = express.Router();
const bcrypt = require('bcryptjs');
// const jwt = require('jsonwebtoken')
const { body, validationResult } = require('express-validator');
const jwt= require('jsonwebtoken');
const verifyToken = require("../middleware/verifyToken")

UserRoute.post(
    '/register',
    [
        body('name', 'Name must be greater or equal to 3 charachters').isLength({ min: 3 }),
        body('email', 'Enter your valid email please').isEmail(),
        body('password', 'Password must be five charachters long').isLength({ min: 5 }),
    ],
    async (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {

            let user = await User.findOne({ email: req.body.email });
            if (user) {
                return res.status(400).send('Already registered user')
            }
            let salt = await bcrypt.genSalt(10);
            let hash = await bcrypt.hash(req.body.password, salt)
            user = await User.create({
                name: req.body.name,
                email: req.body.email,
                password: hash,
            })
            
            const data = {
                user:{
                    id:user._id
                }
            }
            const token = jwt.sign(data,'khalidmansoor',{
                expiresIn:'30d'
            })
            res.send(token);

        } catch (error) {
            return res.status(400).send(error.message)
        }

    },
);

UserRoute.post(
    '/login',
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        let user = await User.findOne({ email:req.body.email });
        if(!user)
        {
            return res.status(400).json("Login with correct credientials please");
        }
        let comparePass = await bcrypt.compare(req.body.password,user.password);
        if(!comparePass){
            return res.status(400).json("Login with correct credientials password");
        }

        const data = {
            user:{
                id:user._id
            }
        }

        const token = jwt.sign(data,'khalidmansoor');
        res.status(201).send(token)
        
    },
);

UserRoute.get('/getUser',verifyToken,async(req,res)=>{
    try {
        const userId = req.user.id;
        const user = await User.findById(userId).select('-password');
        res.send(user);
    } catch (error) {
        console.log(error.message)
    }
})


module.exports = UserRoute;