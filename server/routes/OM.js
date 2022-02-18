const OMUser = require('../models/OMUser');
const User = require('../models/user');
const College = require('../models/college');

//Add Colleges
const addColleges = async (req, res) => {
    try {
        let { colleges } = req.body;
        colleges.forEach(async (college) => {
            let newCollege = new College({
                name: college.name,
            });
            await newCollege.save();
        });
        return res
            .status(200)
            .send({ success: false, msg: "Colleges Added For Revels'22" });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Error' });
    }
};
//Block Colleges
const blockColleges = async (req, res) => {
    try {
        let { colleges } = req.body;
        await College.deleteMany({ name: [...colleges.name] });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Error' });
    }
};
//get All NonMAHE Users
const getUser = async (req, res) => {
    try {
        let users = await User.find({ isMahe: false, verified: 'UNVERIFIED' });
        return res.status(200).send({
            success: true,
            data: users,
            msg: 'All unverified Non MAHE Users ',
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Error' });
    }
};

//verify User
const verifyUser = async (req, res) => {
    try {
        let { userID } = req.body;
        let user = await User.updateOne({ userID }, { verified: 'VERIFIED' });
        if (!user)
            return res
                .status(500)
                .send({ success: false, msg: 'No User found' });

        // TODO: verified notification to be pushed

        return res.status(200).send({ success: true, msg: 'User Verified' });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Error' });
    }
};

// reject User
const rejectUser = async (req, res) => {
    try {
        let { userID, message } = req.body;
        let user = await User.updateOne({ userID }, { verified: 'REJECTED' });
        if (!user)
            return res
                .status(500)
                .send({ success: false, msg: 'User Not Found' });

        //TODO: Rejection message to be pushed as notification
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Errors' });
    }
};

module.exports = {
    addColleges,
    blockColleges,
    getUser,
    verifyUser,
    rejectUser,
};
