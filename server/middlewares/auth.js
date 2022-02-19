const OMUser = require('../models/OMUser');
var jwt = require('jsonwebtoken');

const isOMLoggedIn = async (req, res,next) => {
    try {
        console.log('OM login');
        const token = req.headers['authorization'];
        console.log(token);
        if (typeof token !== 'undefined') {
            let payload = await jwt.verify(token, process.env.JWT_SECRET);
            console.log('Payload ', payload);
            if (payload) {
                let user = await OMUser.findOne({token})
                if (user && (user._id == payload.user_id)) {
                    req.requestOM = user;
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

module.exports = { isOMLoggedIn };
