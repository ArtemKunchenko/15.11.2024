const express = require('express')
const router = express.Router();
const User = require('../models/user')
const passport=require('passport')
const jwt=require('jsonwebtoken')
const config = require('../config/db')



router.post('/reg', (req, res) => {
    let newUser = new User({
        name: req.body.name,
        email: req.body.email,
        login: req.body.login,
        password: req.body.password
    })

    User.addUser(newUser, (err, user) => {
        if (err)
            res.json({ success: false, msg: 'User wasn`t add' })
        else
            res.json({ success: false, msg: 'User added successfully' })
    })

});

router.post('/auth', (req, res) => {
    const login=req.body.login
    const password=req.body.password

    User.getUserByLogin(login,(err,user)=>{
        if(err) throw err
        if(!user) 
           return res.json({success:false, msg:"User wasn`t found"})

        User.comparePass(password,user.password,(err,isMatch)=>{
            if(err) throw err
            if(isMatch){
                const token=jwt.sign(user, config.secret,{
                    expiresIn:3600*24
                })

                res.json({
                    success:true,
                    token: 'JWT '+token,
                    user: {
                        id:user._id,
                        name:user.name,
                        login:user.login,
                        email:user.email
                    }
                })

            }else
            return res.json({success:false, msg:"Failed password"})

        })
    })

});
router.get('/dashboard', passport.authenticate('jwt',{session:false}),(req, res) => {
    res.send('User page');

});

module.exports = router;