const User = require('../models/user');
const nodemailer = require("nodemailer"); // npm package to send emails from the app
const crypto = require('crypto');

module.exports.registerUser =  async (req, res) => {
    const {email, username, password} = req.body;
    const emailToken = crypto.randomBytes(64).toString('hex');
    const user = new User({email, username, emailToken, isVerified: false});
    const registeredUser = await User.register(user, password);

    // // reusable transporter object
    // let transport = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 587,
    //     secure: false,
    //     auth: {
    //         user: process.env.SMTP_EMAIL,
    //         pass: process.env.SMTP_PASS,
    //     },
    //     tls: {
    //         rejectUnauthorized: false
    //     }
    // });
    
    // const url = `https://${req.headers.host}/verify-email?token=${user.emailToken}`;
    // // send mail with defined transport object
    // let info = await transport.sendMail({
    //     from: "Alex @ Jobie" <"jobie.@example.com",
    //     to: req.body.email,
    //     subject: "email Verification",
    //     text: `Please verify your email at ${url}`,
    //     html: `Please verify your email at <a href="${url}">this link</a>`
    // });

    return res.status(201).json( {message: 'User Registered', registeredUser} );
};

module.exports.verifyUser = async(req, res, next) => {
    const user = await User.findOne({ emailToken: req.query.token });
    if (!user) {
        return res.redirect('/register');
    } 
    user.emailToken = null;
    user.isVerified = true;
    await user.save();
    
    await req.login(user, async (err) => {
        if (err) return next(err);
        res.send();
    });
};

module.exports.loginUser = async (req, res) => {
    try {
        res.status(200).json( { message: 'You have been signed in', username:req.user.username , isAdmin: req.user.isAdmin, id: req.user._id } );
    } catch (err) {
        res.status(500).json({ message: err});
    }
};

module.exports.logoutUser = (req, res) => {
    try {
        req.session.destroy();
        res.status(200).json({message:'You have been logged out'})
    }   catch (err) {
        res.status(500).json({ message: err});
    } 
};