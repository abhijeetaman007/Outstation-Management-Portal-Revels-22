const mongoose = require('mongoose');
const CollegeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        unique:true
    }
})
module.exports = College = mongoose.model('College', CollegeSchema);

