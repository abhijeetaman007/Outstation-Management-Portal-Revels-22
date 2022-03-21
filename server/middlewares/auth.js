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
const Admin = require('../models/Admin');
var jwt = require('jsonwebtoken');
const Role = require('../models/Role');
const Category = require('../models/Category');

const isAdminLoggedIn = async (req, res, next) => {
    try {
        console.log('Admin login');
        const token = req.headers['authorization'];
        console.log(token);
        if (typeof token !== 'undefined') {
            let payload = await jwt.verify(token, process.env.JWT_SECRET);
            console.log('Payload ', payload);
            if (payload) {
                // let admin = await Admin.findById(payload.admin_Id).populate({path:'role',populate:{
                //   path:'categoryId'
                // })
                let admin = await Admin.findById(payload.admin_Id).populate(
                    'role'
                );
                console.log('here ', admin);
                if (admin) {
                    req.requestAdmin = admin;
                    next();
                } else {
                    return res.status(401).send({
                        success: false,
                        msg: 'Token Invalid,Please Login',
                    });
                }
            } else {
                return res.status(401).send({
                    success: false,
                    msg: 'Token Expired,Please Login',
                });
            }
        } else {
            return res.status(401).send({
                success: false,
                msg: 'Token Invalid,Please Login',
            });
        }
    } catch (err) {
        console.log(err);
        if (err.name == 'TokenExpiredError') {
            console.log('Token Expired');
            return res.send({
                success: false,
                msg: 'Token Expired,Please Login Again',
            });
        }
        return res
            .status(500)
            .send({ success: false, msg: 'Internal Server Error' });
    }
};

const isCategory = async (req, res, next) => {
    try {
        let admin = req.requestAdmin;
        if (admin.role.type != 0) {
            return res
                .status(400)
                .send({ msg: 'Not a category', success: false });
        }
        next();
    } catch (err) {
        console.log(err);
        return res.status(500).send({ msg: '' });
    }
};

const isOM = async (req, res, next) => {
    try {
        let admin = req.requestAdmin;
        console.log('Category ', admin);
        let category = await Category.findOne(
            { _id: admin.role.categoryId },
            { type: 1, categoryId: 1 }
        );
        console.log('category is ', category);
        if (!(category.type == 'SUPPORTING' && category.categoryId == 'OM')) {
            return res
                .status(403)
                .send({ msg: 'Access Denied', success: false });
        }
        next();
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .send({ msg: 'Internal Server Error', success: false });
    }
};

module.exports = { isOM, isCategory, isAdminLoggedIn };
