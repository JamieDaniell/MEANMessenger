var express = require('express');
var router = express.Router();
var bycrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');
var User = require('../models/user');

router.post('/', function (req, res, next) 
{
    var user = new User({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        password: bycrypt.hashSync(req.body.password, 10),
        email: req.body.email
    });
    user.save(function(err, result) 
    {
        if (err) 
        {
            return res.status(500).json({
                title: 'An error occurred',
                error: err
            });
        }
        res.status(201).json({
            message: 'User created',
            obj: result
        });
    });
});

router.post('/signin', function (req, res, next) 
{
    User.findOne({email: req.body.email}, function(error, user)
    {
        if(error)
        {
            return res.status(500).json({
                title: "An Error occurred",
                error: error
            });
        }
        if(!user)
        {
            return res.status(401).json({
                title: "Login Failed",
                error: {message: "Invalid user credentials"}
            });
        }
        if(!bycrypt.compareSync(req.body.password , user.password))
        {
            return res.status(401).json({
                title: "Login Failed",
                error: {message: "Invalid user credentials"}
            });
        }
        var token = jwt.sign({user: user}, 'secret', {expiresIn: 7200});
        res.status(200).json({
            message: "Successfully Logged In",
            token: token,
            userId: user._id
        });
        
    });
});



module.exports = router;