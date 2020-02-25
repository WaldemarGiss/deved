const router = require('express').Router();
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');


router.post('/register', async (req, res) => {

    //Validate before adding user
    const {value, error} = await registerValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    //Check if email already exist
    const emailExist = await User.findOne({email: req.body.email});
    if (emailExist) {
        return res.status(400).send('Email already exists');
    }

    //Hash passwords
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    //Create a new User
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword
    });

    const savedUser = await user.save();
    res.send({user: user._id});
});

//Login System

router.post('/login', async (req, res) => {
    const {value, error} = await loginValidation(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    } else {
        //Check if email exist while logging
        const user = await User.findOne({email: req.body.email});
        if (!user) {
            return res.status(400).send('Email is not found');
        }
        //PASSWORD IS CORRECT
        const validPass = await bcrypt.compare(req.body.password, user.password);
        if (!validPass) {
            return res.status(400).send('Falsches password');
        }
    //Create and assign Webtoken
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);

    res.header('auth-token', token).send(token);
    }

});

module.exports = router;


