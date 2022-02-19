const express = require('express');
const router = express.Router();

const { registerOM, login, logout,getOMUserFromToken } = require('./auth');
const {
    addColleges,
    blockColleges,
    verifyUser,
    rejectUser,
    getColleges,
    getUnverifiedUsers,
    getRejectedUsers,
} = require('./OM');
const { isOMLoggedIn } = require('../middlewares/auth');

// TEST ROUTE
router.get('/test', (req, res) => {
    res.send({ message: 'For Testing' });
});

// Routes:
// Auth Routes
router.post('/om/register', registerOM);
router.post('/om/login', login);
router.post('/om/logout', logout);
router.get('/om/getomuser',isOMLoggedIn,getOMUserFromToken)


//Get/Add/Block College Routes
router.get('/om/getcolleges', isOMLoggedIn, getColleges);
router.post('/om/addcollege', isOMLoggedIn, addColleges);
router.post('/om/blockcollege', isOMLoggedIn, blockColleges);

//Get All unverified User
router.get('/om/getunverifiedusers', isOMLoggedIn, getUnverifiedUsers);
//Get All rejected User
router.get('/om/getrejectedusers',isOMLoggedIn,getRejectedUsers);

//Verify/Reject User
router.post('/om/verify', isOMLoggedIn, verifyUser);
router.post('/om/reject', isOMLoggedIn, rejectUser);


module.exports = router;
