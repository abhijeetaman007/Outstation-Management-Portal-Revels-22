const mongoose = require('mongoose');
const OMUserSchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true,
    },
    name:{
        type:String
    },
    password:{
        type:String,
        required:true,
    },
    contact:{
        type:String,
    },
    regNo:{
        type:String,
    },
    token:{
        type:String
    }
})
module.exports = OMUser = mongoose.model('OMUser', OMUserSchema);

