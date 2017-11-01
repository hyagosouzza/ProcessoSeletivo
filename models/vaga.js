var mongoose = require('mongoose');

var vagaSchema = mongoose.Schema({
    vaga:{
        type: String,
        required: true
    },
    empresa:{
        type: String,
        required: true
    }
});

var Vaga = module.exports = mongoose.model('Vaga', vagaSchema); 