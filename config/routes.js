module.exports = function(router) {
    //route renders the hompeage
    router.get("/", function(req, res) {
        res.render("home");
    });
    //route renders the saved handlebars page
    router.get("/saved", function(req, res) {
        res.render("saved");
    });
}