var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var snowboardSchema = new Schema({
    snowboard: {
        type: String, 
        required: true, 
        unique: true
    },
    price: {
        type: String,
        required: true
    },
    image: {
        type: String,
        required: true
    }
});

var Snowboard = mongoose.model("Snowboard", snowboardSchema);

module.exports = Snowboard;