const express = require('express');
const router = express.Router();

const { adminLogin, adminLogout, getAdminFromToken } = require('./auth');
const {
  addCollege,
  addMultipleColleges,
  blockColleges,
  verifyUser,
  rejectUser,
  getColleges,
  getUnverifiedUsers,
  getRejectedUsers,
  changeFileStatus,
} = require('./OM');
const { isOM, isCategory, isAdminLoggedIn } = require('../middlewares/auth');

// TEST ROUTE
router.get('/test', (req, res) => {
  res.send({ message: 'For Testing' });
});

// Routes:
// Auth Routes
// router.post('/om/register', registerOM);
router.post('/om/login', adminLogin);
router.post('/om/logout', adminLogout);
router.get('/om/getomuser', getAdminFromToken);

//Get/Add/Block College Routes
router.get('/om/getcolleges', isAdminLoggedIn,isOM, getColleges);
router.post('/om/addcollege', isAdminLoggedIn,isOM,addCollege);
router.post('/om/addcollege/multiple',isAdminLoggedIn,isOM, addMultipleColleges);
router.post('/om/blockcollege',isAdminLoggedIn,isOM, blockColleges);

//Get All unverified User
router.get('/om/getunverifiedusers',isAdminLoggedIn,isOM, getUnverifiedUsers);
//Get All rejected User
router.get('/om/getrejectedusers',isAdminLoggedIn,isOM, getRejectedUsers);

//Verify/Reject User
router.post('/om/verify', isAdminLoggedIn,isOM,verifyUser);
router.post('/om/reject',isAdminLoggedIn,isOM, rejectUser);

//Change File Status
router.post('/om/changefilestatus', changeFileStatus);

module.exports = router;
