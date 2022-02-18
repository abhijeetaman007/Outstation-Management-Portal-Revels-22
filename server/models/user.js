// Same User schema with requireds fields
const mongoose = require('mongoose');
const UserSchema = new mongoose.Schema({
    //userID: will be used as ID in frontend for each user not mongo's _id
    userID: {
        type: Number,
        required: true,
        unique: true,
    },
    role: {
        type: String,
        default: 'USER',
        enum: ['USER'],
    },
    timeStamp: {
        type: Date,
    },
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
    isEmailVerified: {
        type: Boolean,
        default: false,
    },
    mobileNumber: {
        type: Number,
        required: true,
    },
    registrationNumber: {
        type: String,
        required: true,
    },
    branch: {
        type: String,
        default: '',
    },
    college: {
        type: String,
        required: true,
    },
    state: {
        type: String,
        required: true,
    },
    isMahe: {
        type: Boolean,
        required: true,
    },
    accommodationRequired: {
        type: Boolean,
        default: false,
    },
    accommodationType: {
        type: String,
        enum: ['TIER-1', 'TIER-2'],
    },
    driveLink: {
        type: String,
    },
    verified: {
        type: String,
        enum: ['VERIFIED', 'REJECTED', 'UNVERIFIED'],
        default: 'UNVERIFIED',
    },
});

module.exports = User = mongoose.model('User', UserSchema);
