var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var noteSchema = new Schema({
    _snowboardId: {
        type: Schema.Types.ObjectId,
        ref: "Snowboard"
    },
    date: String,
    noteText: String
});

var Note = mongoose.model("Note", noteSchema);

module.exports = Note;