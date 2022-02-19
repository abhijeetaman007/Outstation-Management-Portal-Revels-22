const OMUser = require('../models/OMUser');
var jwt = require('jsonwebtoken');
const { mailer } = require('../utils/mailer');

const registerOM = async (req, res) => {
    try {
        let { users } = req.body;
        users.forEach(async (user) => {
            try {
                const pass = Math.random().toString(36).substring(1, 9);
                const newUser = new OMUser({
                    name: user.name,
                    email: user.email,
                    password: pass,
                    contact: user.contact,
                    regNo: user.regNo,
                    token: '',
                });
                await newUser.save();
                let message =
                    `You are registered to OM portal please keep the credentials safely for using Outstation Management Portal <br/> <b>ID: ${newUser.email}</b> \n <br/> <b>Password: ${newUser.password}</b>`;
                mailer(
                    newUser.email,
                    "Registered to OM portal - REVELS '22",
                    message
                );
            } catch (err) {
                console.log(err);
                return res.status(500).send({
                    success: false,
                    msg: 'Internal Server Error',
                });
            }
        });
        return res.send({ success: true, msg: 'OM Users registered' });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Error' });
    }
};

const login = async (req, res) => {
    try {
        let { email, password } = req.body;
        const user = await OMUser.findOne({
            email,
        });
        if (!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))
            return res
                .status(400)
                .send({ success: false, msg: 'Please enter a valid email' });
        if (!user) return res.status(401).json({ msg: 'Email Not Registered' });

        const isValid = password == user.password;
        if (!isValid) return res.status(401).json({ msg: 'Invalid password' });

        let payload = {
            email,
            user_id: user._id,
        };
        let token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 6 * 60 * 60,
        });
        user.token = token;
        await user.save();
        return res.status(200).json({
            msg: 'Login successful ',
            success: true,
            data: user,
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, msg: 'Internal Server Error' });
    }
};

const logout = async (req, res) => {
    try {
        let token = req.headers['authorization'];
        let user = await OMUser.findOne({ token });
        if (user) {
            user.token = '';
            await user.save();
            return res.status(200).send({
                success: true,
                msg: 'Logged Out Successfully',
            });
        } else {
            return res
                .status(400)
                .send({ success: false, msg: 'Not Logged In' });
        }
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Error' });
    }
};
module.exports = { registerOM, login, logout };
