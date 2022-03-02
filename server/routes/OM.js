const OMUser = require('../models/OMUser');
const User = require('../models/user');
const College = require('../models/college');
const { mailer } = require('../utils/mailer');

//get Colleges
const getColleges = async (req, res) => {
    try {
        let colleges = await College.find();
        return res.status(200).send({ success: true, data: colleges });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Error' });
    }
};

// Add Colleges 
const addMultipleColleges = async (req, res) => {
    try {
        let { colleges } = req.body;
        colleges.forEach(async (college) => {
            try {
                let newCollege = new College({
                    name: college.name,
                });
                await newCollege.save();
            } catch (err) {
                if (err.name === 'MongoServerError' && err.code === 11000)
                    console.log(`${college.name} is already added `);
            }
        });
        return res
            .status(200)
            .send({ success: true, msg: "College Added For Revels'22" });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Error' });
    }
};
// Add a College
const addCollege = async (req, res) => {
    try {
        let college = await College.findOne({name : req.body.name });
        if (college) return res.status(401).json({success: false, msg: "College Already Registered" });
        let  newcollege = new College({
            name: req.body.name,
             isMahe : req.body.isMahe
        });
        await newcollege.save();
        return res
            .status(200)
            .send({ success: true, msg: "College Added For Revels'22" });
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
        await College.deleteOne({ name: req.body.name});
        return res.status(200).send({ success: true, msg: 'College Blocked' });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Error' });
    }
};


//get All NonMAHE Users
const getUnverifiedUsers = async (req, res) => {
    try {
        let users = await User.find(
            { isMahe: false, verified: 'UNVERIFIED', isEmailVerified: true },
            {
                userID: 1,
                name: 1,
                email: 1,
                mobileNumber: 1,
                registrationNumber: 1,
                branch: 1,
                college: 1,
                state: 1,
                accommodation:1,
                documents:1,
                isMahe: 1,
                verified: 1,
            }
        );
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

// Get Rejected Users
const getRejectedUsers = async (req, res) => {
    try {
        let users = await User.find(
            { isMahe: false, verified: 'REJECTED', isEmailVerified: true },
            {
                userID: 1,
                name: 1,
                email: 1,
                mobileNumber: 1,
                registrationNumber: 1,
                branch: 1,
                college: 1,
                state: 1,
                accommodation: 1,
                documents: 1,
                driveLink: 1,
                isMahe: 1,
                verified: 1,
            }
        );
        return res.status(200).send({
            success: true,
            data: users,
            msg: 'All unverified Non MAHE Users ',
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Sercer Error' });
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

        // Reject Mail
        let sendMsg = `Your verification has been rejected, found issues in following documents, please upload them again \n ${message}`;
        mailer(newUser.email, "Verify Email - REVELS '22", sendMsg);

        //TODO: Rejection message to be pushed as notification
        return res.status(200).send({ success: false, msg: 'User Rejected' });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Errors' });
    }
};

module.exports = {
    addCollege,
    addMultipleColleges,
    blockColleges,
    getUnverifiedUsers,
    getRejectedUsers,
    verifyUser,
    rejectUser,
    getColleges,
};
