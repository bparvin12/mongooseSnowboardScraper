// global 
$(document).ready(function() {
    // setting a reference to the snowboard-container div where
    // all the dynamic content will go. Adding event listeners to any dynamically 
    // generated "save snowboard" and "scrape new snowbaords" buttons
    var snowboardContainer = $(".snowboard-container");
    $(document).on("click", "btn.save", handleSnowboardSave);
    $(document).on("click", ".scrape-new", handleSnowboardScrape);

    initPage();

    function initPage() {
        snowboardContainer.empty();
        $.get("/api/snowboards?saved=false")
            .then(function(data) {
                if (data && data.length) {
                    renderSnowboards(data);
                }
                else {
                    renderEmpty();
                }
            });
    }

    function renderSnowboards(snowboards) {
        //this function handles appending html contianing our snowboard data to the page
        //we are passed an array of JSON containing all available snowbaords in our database
        var snowboardPanels = [];
        //we pass each snowboard JSON object to the createPanel function which returns a bootstrap
        //panel with our snowboard data inside
        for (var i=0;i<snowboards.length;i++) {
            snowboardPanels.push(createPanel(snowboards[i]));
        }
        //append to snowboardPanels container
        snowboardContainer.append(snowboardPanels);
    }

    function createPanel(snowboard) {
        var panel = 
        $(["<div class='panel panel-default'>",
        "<div class='panel-heading'>",
        "<h3>",
        snowboard.snowboard,
        "</h3>",
        "</div>",
        "<div class='panel-body'>",
        snowboard.price,
        "</div>",
        "<img class='rounded mx-auto d-block' src='" + snowboard.image +"'>",
        "<a class='btn btn-success save'>",
        "Save Snowboard",
        "</a>",
        "</div>"
    ].join(""));
    panel.data("_id", snowboard._id);

    return panel;
    }

    function renderEmpty() {
        var emptyAlert = 
        $(["<div class='alert alert-warning text-center'>",
            "<h4>Uh Oh. Looks like we don't have any new snowboards.</h4>",
            "</div>",
            "<div class='panel panel-default'>",
            "<div class='panel-heading text-center'>",
            "<h3>What Would You Like To Do?</h3>",
            "</div>",
            "<div class='panel-body text-center'>",
            "<h4><a class='scrape-new'>Try Scraping New Snowboards</a></h4>",
            "<h4><a href='/saved'>Go to Saved Snowboards</a></h4>",
            "</div>",
            "</div>"
        ].join(""));
        snowboardContainer.append(emptyAlert);
    }

    function handleSnowboardSave() {
        //function triggered when user wants to save a snowboard
        var snowboardToSave = $(this).parents(".panel").data();
        snowboardToSave.saved = true;

        //patch method
        $.ajax({
            method: "PATCH",
            url: "/api/snowboards",
            data: snowboardToSave
        })
        .then(function(data) {
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleSnowboardScrape () {
        $.get("/api/fetch")
        .then(function(data) {
            initPage();
            bootbox.alert("<h3 class='text-center m-top-80'>" + data.message + "</h3>");
        });
    }

});