//Server routes
//=====================

//bring in scrape function from scripts 
var scrape = require("../scripts/scrape");

//bring in snowboards and notes from the controller
var snowboardsController = require("../controllers/snowboards");
var notesController = require("../controllers/notes");

module.exports = function (router) {
    //route renders the hompeage
    router.get("/", function (req, res) {
        res.render("home");
    });
    //route renders the saved handlebars page
    router.get("/saved", function (req, res) {
        res.render("saved");
    });

    router.get("/api/fetch", function (req, res) {
        snowboardsController.fetch(function (err, docs) {
            if (!docs || docs.insertedCount === 0) {
                res.json({
                    message: "No new snowboards today. Check back tomorrow!"
                });
            }
            else {
                res.json({
                    message: "Added " + docs.insertedCount + " new snowboards!"
                });
            }
        });
    });

    router.get("/api/snowboards", function (req, res) {
        var query = {};
        if (req.query.saved) {
            query = req.query;
        }

        snowboardsController.get(query, function (data) {
            res.json(data);
        });
    });

    router.delete("/api/snowboards/:id", function (req, res) {
        var query = {};
        query._id = req.params.id;

        snowboardsController.delete(query, function (err, data) {
            res.json(data);
        });
    });

    router.patch("/api/snowboards", function (req, res) {
        snowboardsController.update(req.body, function (err, data) {
            res.json(data);
        });
    });

    //route to get all notes to display to user based on snowboard
    router.get("/api/notes/:snowboard_id?", function (req, res) {
        var query = {};
        if (req.params.snowboard_id) {
            query._id = req.params.snowboard_id;
        }

        notesController.get(query, function (err, data) {
            res.json(data);
        });
    });

    //route to delete notes
    router.delete("/api/notes/:id", function (req, res) {
        var query = {};
        query._id = req.params.id;
        notesController.delete(query, function (err, data) {
            res.json(data);
        });
    });

    //route to post new notes to articles
    router.post("/api/notes", function (req, res) {
        notesController.save(req.body, function (data) {
            res.json(data);
        });
    });
}