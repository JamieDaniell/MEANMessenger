var express = require('express');
var router = express.Router();
var Message = require('../models/message');
var jwt = require("jsonwebtoken");
var User = require('../models/user');

router.get('/' , function(req , res, next)
{
    Message.find()
        .populate('user', 'firstName')
        .exec(function(error,messages){
            if(error)
            {
                return res.status(500).json({
                title: "An Error occured",
                error: error 
                });
            }
            res.status(200).json({
                message: 'Success',
                obj: messages
            });
        });
});
//only create messages if logged in
router.use('/', function(req,res,next)
{
    console.log(req.query.token);
    jwt.verify(req.query.token , 'secret' , function(error, decoded)
    {  
        if(error)
        {
            return res.status(401).json({
                title: "Not Authenticated",
                error: error
            });
        }
        next()
    });
});

router.post('/', function (req, res, next) 
{
    var decoded = jwt.decode(req.query.token);
    User.findById(decoded.user._id, function(error, user)
    {
        if(error)
        {
            res.status(500).json({
                title: 'An error occured',
                error: error
            });
        }
        var message = new Message({
                content: req.body.content,
                user: user
            }); 
        message.save(function(error , result)
        {
            if(error)
            {
                return res.status(500).json({
                    title: "An Error occured",
                    error: error 
                });
            }
            user.messages.push(result);
            user.save();
            res.status(201).json({
                message: 'Saved message',
                obj: result
            });
        });
    });
   
});

router.patch('/:id', function(req, res, next)
{
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, function(error,message)
    {
        if(error)
        {
            return res.status(500).json({
                title: "An Error occured",
                error: error 
            }); 
        }
        if(!message)
        {
            return res.status(500).json({
                title: "No Message Found",
                error: { message: 'Message no found'}
            }); 
        }
        if(message.user != decoded.user._id)
        {
            return res.status(401).json({
                title: "Not Authenticated",
                error: {message: "Users do not match"}
            });
        }
        message.content = req.body.content;
        message.save(function(error ,result)
        {
            
            if(error)
            {
                return res.status(500).json({
                    title: "An Error occured",
                    error: error 
                });
            }
            res.status(201).json({
                message: 'Saved message',
                obj: result
            });
        });
    });
});

router.delete('/:id' , function(req,res,next)
{
    var decoded = jwt.decode(req.query.token);
    Message.findById(req.params.id, function(error,message)
    {
        if(error)
        {
            return res.status(500).json({
                title: "An Error occured",
                error: error 
            }); 
        }
        if(!message)
        {
            return res.status(500).json({
                title: "No Message Found",
                error: { message: 'Message no found'}
            }); 
        }
        if(message.user != decoded.user._id)
        {
            return res.status(401).json({
                title: "Not Authenticated",
                error: {message: "Users do not match"}
            });
        }
        message.remove(function(error ,result)
        {
            
            if(error)
            {
                return res.status(500).json({
                    title: "An Error occured",
                    error: error 
                });
            }
            res.status(201).json({
                message: 'Deleted',
                obj: result
            });
        });
    });
});

module.exports = router;
