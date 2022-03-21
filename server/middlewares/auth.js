// const OMUser = require('../models/OMUser');
// var jwt = require('jsonwebtoken');

// const isOMLoggedIn = async (req, res,next) => {
//     try {
//         console.log('OM login');
//         const token = req.headers['authorization'];
//         //console.log(token);
//         if (typeof token !== 'undefined') {
//             let payload = await jwt.verify(token, process.env.JWT_SECRET);
//             //console.log('Payload ', payload);
//             if (payload) {
//                 let user = await OMUser.findOne({token})
//                 if (user && (user._id == payload.user_id)) {
//                     req.requestOM = user;
//                     next();
//                 } else {
//                     return res.status(401).send({
//                         success: false,
//                         msg: 'Token Invalid,Please Login',
//                     });
//                 }
//             } else {
//                 return res.status(401).send({
//                     success: false,
//                     msg: 'Token Expired,Please Login',
//                 });
//             }
//         } else {
//             return res.status(401).send({
//                 success: false,
//                 msg: 'Token Invalid,Please Login',
//             });
//         }
//     } catch (err) {
//         console.log(err);
//         if (err.name == 'TokenExpiredError') {
//             console.log('Token Expired');
//             return res.send({
//                 success: false,
//                 msg: 'Token Expired,Please Login Again',
//             });
//         }
//         return res
//             .status(500)
//             .send({ success: false, msg: 'Internal Server Error' });
//     }
// };

// module.exports = { isOMLoggedIn };
const Admin = require("../models/Admin");
var jwt = require("jsonwebtoken");
const Role = require("../models/Role");

const isAdminLoggedIn = async (req, res, next) => {
    try {
      console.log("Admin login");
      const token = req.headers["authorization"];
      console.log(token);
      if (typeof token !== "undefined") {
        let payload = await jwt.verify(token, process.env.JWT_SECRET);
        console.log("Payload ", payload);
        if (payload) {
          console.log("id:", payload.admin_Id);
          let admin = await Admin.findById(payload.admin_Id);
          
          const role = await Role.findById(admin.role);
          admin.role = role;
          console.log("here ", admin);
          if (admin) {
            req.requestAdmin = admin;
            next();
          } else {
            return res.status(401).send({
              success: false,
              msg: "Token Invalid,Please Login",
            });
          }
        } else {
          return res.status(401).send({
            success: false,
            msg: "Token Expired,Please Login",
          });
        }
      } else {
        return res.status(401).send({
          success: false,
          msg: "Token Invalid,Please Login",
        });
      }
    } catch (err) {
      console.log(err);
      if (err.name == "TokenExpiredError") {
        console.log("Token Expired");
        return res.send({
          success: false,
          msg: "Token Expired,Please Login Again",
        });
      }
      return res
        .status(500)
        .send({ success: false, msg: "Internal Server Error" });
    }
  };
  
  const isCategory = async (req, res) => {
    try {
      let user = req.reqeustUser;
      if (user.role.type == 0) next();
      return res.status(400).send({ msg: 'Not a category', success: false });
    } catch (err) {
      console.log(err);
      return res.status(500).send({ msg: '' });
    }
  };

  const isOM = async (req, res) => {
    try {
      let user = req.reqeustUser;
      if (
        user.categoryId.type == 'SUPPORTING' &&
        user.categoryId.category == 'OM'
      )
        next();
      return res.status(403).send({ msg: 'Access Denied', success: false });
    } catch (err) {
      console.log(err);
      return res
        .status(500)
        .send({ msg: 'Internal Server Error', success: false });
    }
  };

  module.exports = {isOM,isCategory,isAdminLoggedIn}