const express = require ('express');
const router = express.Router();
const gravatar = require ('gravatar');
const bcrypt = require ('bcryptjs');
const jwt = require ('jsonwebtoken');
const passport = require ('passport');
const keys = require ('../../config/keys');


//Load User model
const User = require ('../../models/User');

//@route    GET api/users/test
//@desc     Tests users routes
//@access   Public 

router.get('/test', (req, res) => res.json({msg: "Users works"}));

//@route    GET api/users/register
//@desc     Tests users routes
//@access   Public 

router.post('/register', (req, res) => {
    //looks for repeated email address
    User.findOne({email: req.body.email}).then(user => {
        if(user) {
            return res.status(400).json({email: 'Email is already in use'});
        } else {
            const avatar = gravatar.url(req.body.email, {
                s: '200', //size
                r: 'pg', //rating
                d: 'mm' //default
            });

            const newUser = new User({
                name: req.body.name,
                location: req.body.location,
                email: req.body.email,
                avatar,
                password: req.body.password
            });

            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(newUser.password, salt, (err, hash) => {
                    if (err)throw err;
                    newUser.password = hash;
                    newUser.save()
                        .then(user => res.json(user))
                        .catch(err => console.log(err));
                })

            })
        }
    });
});

//@route    GET api/users/login
//@desc    login return token
//@access   Public 

router.post('/login', (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    //Findl user by email
    User.findOne({email})
    .then(user => {
        if(!user) {
            return res.status(404).json({email: 'User not found'});
        }

        //check password 
        bcrypt.compare (password, user.password)
        .then(isMatch => {
            if(isMatch) {
                //user matched
                const payload = {id: user.id, name: user.name, avatar: user.avatar }
                //sign token
                jwt.sign(
                    payload, 
                    key.secretOrKey,
                    {expiresIn: 3600},
                (err, token)=>{
                    res.json({                    
                        success: true,
                        token: 'Bearer'+ token
                    });
                });
            } else {
                return res.status(404).json({password: 'password wrong'})
            }
        })
    });        
});

// @route GET api/users/login
// @desc current user
// @access private

router.get (
    '/current', passport.authenticate ('jwt', { session: false }), 
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email
        });
    }
);
module.exports = router;