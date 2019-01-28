$(document).ready(function () {

    var snowboardContainer = $(".snowboard-container");

    $(document).on("click", "btn.delete", handleSnowboardDelete);
    $(document).on("click", "btn.notes", handleSnowboardNotes);
    $(document).on("click", "btn.save", handleNoteSave);
    $(document).on("click", "btn.note-delete", handleNoteDelete);

    initPage();

    function initPage() {
        snowboardContainer.empty();
        $.get("/api/snowboards?saved=true")
            .then(function (data) {
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
        for (var i = 0; i < snowboards.length; i++) {
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
                "<img class='rounded mx-auto d-block' src='" + snowboard.image + "'>",
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
                "<h4>Uh Oh. Looks like we don't have any saved snowboards.</h4>",
                "</div>",
                "<div class='panel panel-default'>",
                "<div class='panel-heading text-center'>",
                "<h3>What Would You Like to Browse Avialable Snowboards?</h3>",
                "</div>",
                "<div class='panel-body text-center'>",
                "<h4><a href='/'>Browse Snowboards</a></h4>",
                "</div>",
                "</div>"
            ].join(""));
        snowboardContainer.append(emptyAlert);
    }

    function handleSnowboardDelete() {
        var snowboardToDelete = $(this).parents(".panel").data();
        $.ajax({
            method: "DELETE",
            url: "/api/snowboards/" + snowboardToDelete._id
        }).then(function(data) {
            if (data.ok) {
                initPage();
            }
        });
    }

    function handleSnowboardNotes () {
        var currentSnowboard = $(this).parents(".panel").data();
        $.get("/api/notes/" + currentSnowboard._id).then(function(data) {
            var modalText = [
                "<div class='container-fluid text-center'>",
                "<h4>Notes For Snowboard: ",
                currentSnowboard._id,
                "</h4>",
                "<hr />",
                "<ul class='list-group note-container'>",
                "</ul>",
                "<textarea placeholder='New Note' rows='4' cols='60'></textarea>",
                "<button class-'btn btn-success save'>Save Note</button>",
                "</div>"
            ].join("");

            bootboc.dialog({
                message: modalText,
                closeButton: true
            });

            var noteData = {
                _id: currentSnowboard._id,
                notes: data || []
            };

            $(".btn.save").data("snowboard", noteData);

            renderNotesList(noteData);
        })
    }

    function renderNotesList(data) {
        var notesToRender = [];
        var currentNote;
        if (!data.notes.length) {
            currentNote = [
                "<li class='list-group-item'>",
                "No notes for this Snowboard yet",
                "</li>"
            ].join("");
            notesToRender.push(currentNote);
        }
        else {
            for (var i = 0; i < data.notes.length; i++) {
                currentNote = $([
                    "<li class='list-group-item note'>",
                    data.notes[i].noteText,
                    "<button class='btn btn-danger note-delete'>X</button>",
                    "</li>"
                ].join(""));
                currentNote.children("button").data("_id", data.notes[i]._id);

                notesToRender.push(currentNote);
            }
        }
        $(".note-container").append(notesToRender);
    }

    function handleNoteSave () {
        var noteData;
        var newNote = $(".bootbox-body textarea").val().trim();

        if (newNote) {
            noteData = {
                _id: $(this).data("snowboard")._id,
                noteText: newNote
            };
            $.post("/api/notes", noteData).then(function(){
                bootbox.hideAll();
            });
        }
    }

    function handleNoteDelete() {
        var noteToDelete = $(this).data("_id");

        $.ajax({
            url: "/api/notes/" + noteToDelete,
            method: "DELETE"
        }).then(function() {
            bootbox.hideAll();
        })
    }

});