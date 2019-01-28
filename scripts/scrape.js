//scrape script 
//=====================

//require request and cheerio, makes scrapes possible
var axios = require("axios");
var cheerio = require("cheerio");

var scrape = function (cb) {
    axios.get("https://www.evo.com/shop/snowboard/snowboards/").then(function (response) {
        // Load the html body from axios into cheerio
        var $ = cheerio.load(response.data);
        var snowboards = [];
        // For each element with a "title" class
        $(".product-thumb").each(function (i, element) {

            // Save the text and href of each link enclosed in the current element
            var snowboard = $(element).children(".product-thumb-details").children("a").children("span.product-thumb-title").text();
            var price = $(element).children(".product-thumb-details").children("a").children("span.product-thumb-price").text();
            var image = $(element).children("a").children("img").attr("src");

            // If this found element had both a title and a link
            if (snowboard && price && image) {
                // Insert the data in the scrapedData db
                var dataToAdd = {
                    snowboard: snowboard,
                    price: price,
                    image: image
                };

                snowboards.push(dataToAdd);
            }
        });
        cb(snowboards);
        // // Send a "Scrape Complete" message to the browser
        // res.send("Scrape Complete");
    });
}

module.exports = scrape;
