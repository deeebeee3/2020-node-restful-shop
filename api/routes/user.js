const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('../models/user');

router.post('/signup', async (req, res, next) => {

    try {
        const getUser = await User.find({ email: req.body.email }).exec();

        if(getUser.length >= 1){
            return res.status(409).json({
                message: 'User already exists.'
            });
        } else{
            bcrypt.hash(req.body.password, 10, async (err, hash) => {
                if(err) {
                    return res.status(500).json({
                        error: err
                    });
                } else {
                    const user = new User({
                        _id: new mongoose.Types.ObjectId(),
                        email: req.body.email,
                        password: hash
                    });
        
                    try {
                        const result = await user.save();
        
                        console.log(result);
                        res.status(201).json({
                            message: 'User Created'
                        });
                    } catch (err) {
                        console.log(err);
                        res.status(500).json({
                            error: err
                        });
                    }
                }
            });
        }
    } catch(err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
});

router.post('/login', async (req, res, next) => {
    try {
        const user = await User.find({ email: req.body.email }).exec();

        if(user.length < 1){
            return res.status(401).json({
                 message: 'Auth failed'
            });
        }

        bcrypt.compare(req.body.password, user[0].password, (err, result) => {
            if(err){
                return res.status(401).json({
                    message: 'Auth failed'
               });
            }

            if(result){
                return res.status(200).json({
                    message: 'Auth successful'
               });
            }

            res.status(401).json({
                message: 'Auth failed'
            });

        });

    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }

});

router.delete('/:userId', async (req, res, next) => {
    try {
        const deleted = User.deleteOne({ _id: req.params.userId }).exec();

        res.status(200).json({
            message: 'User Deleted'
        });
    } catch (err) {
        console.log(err);
        res.status(500).json({
            error: err
        });
    }
});

module.exports = router;