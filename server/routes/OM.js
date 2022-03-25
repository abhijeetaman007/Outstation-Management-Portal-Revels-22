const User = require('../models/user');
const College = require('../models/college');
const { mailer } = require('../utils/mailer');

//get Colleges
const getColleges = async (req, res) => {
    try {
        let colleges = await College.find({}, { name: 1, isMahe: 1, state: 1 });
        colleges.sort((college1, college2) => {
            if (
                college1.name.toUpperCase() == 'MANIPAL INSTITUTE OF TECHNOLOGY'
            )
                return -1;
            if (
                college1.name.toUpperCase() == 'MANIPAL INSTITUTE OF TECHNOLOGY'
            )
                return 1;

            if (
                (college1.isMahe && college2.isMahe) ||
                (!college1.isMahe && !college2.isMahe)
            ) {
                return (
                    college1.name.toUpperCase() - college2.name.toUpperCase()
                );
            } else if (college1.isMahe) {
                return -1;
            } else if (college2.isMahe) {
                return 1;
            }
        });
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
                    // isMahe:college.isMahe,
                    state: college.state,
                });
                await newCollege.save();
            } catch (err) {
                if (err.name === 'MongoServerError' && err.code === 11000)
                    console.log(`${college.name} is already added `);
                else console.log(err);
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
        let { name, isMahe, state } = req.body;
        let college = await College.findOne({ name });
        if (college)
            return res
                .status(401)
                .json({ success: false, msg: 'College Already Registered' });
        let newcollege = new College({
            name,
            isMahe,
            state,
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
        await College.deleteOne({ name: req.body.name });
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
    console.log('here');
    try {
        let users = await User.find(
            {
                isMahe: 0,
                status: 'UNVERIFIED',
                isEmailVerified: true,
            },
            {
                userID: 1,
                name: 1,
                email: 1,
                mobileNumber: 1,
                registrationNumber: 1,
                course: 1,
                college: 1,
                state: 1,
                accommodation: 1,
                documents: 1,
                isMahe: 1,
                status: 1,
            }
        );
        return res.status(200).send({
            success: true,
            data: users,
            msg: 'All unverified Non-MAHE Users ',
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
  console.log("here")
  try {
    let users = await User.find(
      {
        isMahe: 0,
        status: 'REJECTED',
        isEmailVerified: true,
      },
      {
        userID: 1,
        name: 1,
        email: 1,
        mobileNumber: 1,
        registrationNumber: 1,
        course: 1,
        college: 1,
        state: 1,
        accommodation: 1,
        documents: 1,
        isMahe: 1,
        status: 1,
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

// Get Verified Users
const getVerifiedUsers = async (req, res) => {
    try {
        let users = await User.find(
            {
                isMahe: 0,
                status: 'VERIFIED',
                isEmailVerified: true,
            },
            {
                userID: 1,
                name: 1,
                email: 1,
                mobileNumber: 1,
                registrationNumber: 1,
                course: 1,
                college: 1,
                state: 1,
                accommodation: 1,
                documents: 1,
                isMahe: 1,
                status: 1,
            }
        );
        return res.status(200).send({
            success: true,
            data: users,
            msg: 'All verified Non MAHE Users ',
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
        let user = await User.updateOne({ userID }, { status: 'VERIFIED' });
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
        let user = await User.updateOne({ userID }, { status: 'REJECTED' });
        if (!user)
            return res
                .status(500)
                .send({ success: false, msg: 'User Not Found' });

        // Reject Mail
         let sendMsg = `Your verification has been rejected, please upload the documents again`;
         mailer(user.email, "Document Verification Failed - REVELS '22", sendMsg);

        //TODO: Rejection message to be pushed as notification
        return res.status(200).send({ success: true, msg: 'User Rejected' });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Errors' });
    }
};

const changeFileStatus = async (req, res) => {
    try {
        console.log('changeee');
        let { userID, status, fileType } = req.body;
        console.log(req.body);
        let user = await User.findOne({ userID });
        console.log('user=', user);
        if (!user)
            return res
                .status(500)
                .send({ success: false, msg: 'User Not Found' });
        let documents = user.documents;
        console.log('docs=', documents);
        if (fileType == 'aadhar') {
            documents.aadhar.status = status;
        } else if (fileType == 'vaccination') {
            documents.vaccination.status = status;
        } else if (fileType == 'undertaking') {
            documents.undertaking.status = status;
        } else if (fileType == 'collegeId') {
            documents.collegeId.status = status;
        }
        await User.updateOne({ userID }, { $set: { documents } });
        if (status == 2) {
            console.log('status reject');
            mailer(
                user.email,
                "Document Verification Failed - REVELS '22",
                'Your verification has been rejected, please upload them again.'
            );
        }
        return res.status(200).send({ success: true, msg: 'Status Changed' });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Error' });
    }
};

module.exports = {
  addCollege,
  addMultipleColleges,
  blockColleges,
  getUnverifiedUsers,
  getRejectedUsers,
  getVerifiedUsers,
  verifyUser,
  rejectUser,
  getColleges,
  changeFileStatus,
};
