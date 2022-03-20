const express = require('express');
const router = express.Router();

const {adminLogin,adminLogout,getAdminFromToken} = require('./auth');
const {
    addCollege,
    addMultipleColleges,
    blockColleges,
    verifyUser,
    rejectUser,
    getColleges,
    getUnverifiedUsers,
    getRejectedUsers,
} = require('./OM');
const { isOM,isCategory,isAdminLoggedIn } = require('../middlewares/auth');

// TEST ROUTE
router.get('/test', (req, res) => {
    res.send({ message: 'For Testing' });
});

// Routes:
// Auth Routes
// router.post('/om/register', registerOM);
router.post('/om/login', adminLogin);
router.post('/om/logout', adminLogout);
router.get('/om/getomuser',getAdminFromToken)


//Get/Add/Block College Routes
router.get('/om/getcolleges', getColleges);
router.post('/om/addcollege', addCollege);
router.post('/om/addcollege/multiple', addMultipleColleges);
router.post('/om/blockcollege', blockColleges);

//Get All unverified User
router.get('/om/getunverifiedusers', getUnverifiedUsers);
//Get All rejected User
router.get('/om/getrejectedusers',getRejectedUsers);

//Verify/Reject User
router.post('/om/verify', verifyUser);
router.post('/om/reject', rejectUser);


module.exports = router;
