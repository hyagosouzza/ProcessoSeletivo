var mongoose = require('mongoose');

var adminSchema = mongoose.Schema({
    admin:{
        type: String,
        required: true
    },
    senha:{
        type: String,
        required: true
    }
});

var Admin = module.exports = mongoose.model('Admin', adminSchema); 