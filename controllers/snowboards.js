//bring in our scrape script and makedate scripts
var scrape = require("../scripts/scrape");
var makeDate = require("../scripts/date");

//bring in Snowboard and Note mongoose models
var Snowboard = require("../models/Snowboard");

module.exports = {
    fetch: function (cb) {
        scrape(function (data) {
            var snowboards = data;
            for (var i = 0; i < snowboards.length; i++) {
                snowboards[i].date = makeDate();
                snowboards[i].saved = false;
            }

            Snowboard.collection.insertMany(snowboards, { ordered: false }, function (err, docs) {
                cb(err, docs);
            })

        });
    },
    delete: function (query, cb) {
        Snowboard.remove(query, cb);
    },
    get: function(query, cb) {
        Snowboard.find(query)
        .sort({
            _id: -1
        })
        .exec(function(err, doc) {
            cb(doc);
        });
    },
    update: function(query, cb) {
        Snowboard.update({_id: query._id}, {
            $set: query
        }, {}, cb);
    }
}