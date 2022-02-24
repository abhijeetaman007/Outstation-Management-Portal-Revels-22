const mongoose = require('mongoose');
const CollegeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    },
    isMahe:{
        type:boolean,
        default:false
    }
})
module.exports = College = mongoose.model('College', CollegeSchema);

