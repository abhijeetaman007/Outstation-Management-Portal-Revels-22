const OMUser = require('../models/OMUser');
const User = require('../models/user');
const College = require('../models/college');

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

//Add Colleges
const addColleges = async (req, res) => {
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
            .send({ success: true, msg: "Colleges Added For Revels'22" });
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
        colleges.forEach(async (college) => {
            try {
                console.log(college.name);
                console.log(college);
                await College.deleteOne({ name: college.name });
            } catch (err) {
                console.log(err);
            }
        });
        return res.status(200).send({ success: true, msg: 'Colleges Blocked' });
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
                accommodationRequired: 1,
                accommodationType: 1,
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
                accommodationRequired: 1,
                accommodationType: 1,
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
    addColleges,
    blockColleges,
    getUnverifiedUsers,
    getRejectedUsers,
    verifyUser,
    rejectUser,
    getColleges,
};
