const Admin = require('../models/Admin');
var jwt = require('jsonwebtoken');
const { mailer } = require('../utils/mailer');
const adminLogin = async (req, res) => {
    try {
        console.log("login")
        let { email, password } = req.body;
        const admin = await Admin.findOne({ email }, { email: 1, password: 1 });
        if (!admin)
            return res
                .status(401)
                .json({ success: false, msg: 'Invalid Admin Email' });
        
        if (password != admin.password)
            return res
                .status(401)
                .json({ success: false, msg: 'Invalid password' });
        console.log("admin login")
        let payload = {
            admin_Id: admin._id,
        };
        let token = jwt.sign(payload, process.env.JWT_SECRET, {
            expiresIn: 60 * 60,
        });
        await Admin.updateOne({ _id: admin._id }, { token });
        return res.status(200).json({
            msg: 'Admin Signed in Successfully ',
            success: true,
            data: token,
        });
    } catch (err) {
        console.log(err);
        return res
            .status(500)
            .json({ success: false, msg: 'Internal Server Error' });
    }
};

const adminLogout = async (req, res) => {
    try {
        let token = req.headers['authorization'];
        let admin = await Admin.exists({ token });
        if (admin) {
            await Admin.updateOne(
                { _id: admin._id },
                {
                    $set: {
                        token: null,
                    },
                }
            );
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
        return res
            .status(500)
            .json({ success: false, msg: 'Internal Server Error' });
    }
};

const getAdminFromToken = async (req,res) => {
    try {
        let token = req.headers['authorization'];
        let admin = await Admin.findOne({ token },{password:0,token:0});
        if (!admin)
            return res
                .status(400)
                .send({ success: false, msg: 'Token Invalid' });
        
        return res.status(200).send({data:admin,success:true})
    } catch (err) {
        console.log(err);
        return res.status(500).send({msg:'Internal Server Error',success:false})
    }
};


// const getOMUserFromToken = async (req, res) => {
//     try {
//         let token = req.headers['authorization'];
//         let user = await OMUser.findOne({ token },{password:0,token:0});
//         if (!user)
//             return res
//                 .status(400)
//                 .send({ success: false, msg: 'Token Invalid' });
//         return res.status(200).send({ success: true, data: user });
//     } catch (err) {
//         console.log(err);
//         return res
//             .status(500)
//             .send({ success: false, msg: 'Internal Server Error' });
//     }
// };




module.exports = {adminLogin,adminLogout,getAdminFromToken };
