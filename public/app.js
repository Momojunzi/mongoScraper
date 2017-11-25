var articleButton = $('#articleButton').on('click', function(event){
  $('.article-container').css({'display': 'block'});
  $.getJSON('/articles', function(data){
    for(var i=0; i<data.length; i++){
      $('#articles').append("<h3 class='articleTitle' data-toggle='modal' data-target='#notes-modal' data-id='" + data[i]._id + "'>" + data[i].title + "</h3><a href='"+data[i].link+"' target='_blank'><p>"+data[i].link + "</p></a><hr />");
    }
  });
  $('.articleButton').css({'display': 'none'});
});

$(document).on('click', ".articleTitle", function(){
  console.log('p clicked');
  $('#notes').empty();
  var thisId = $(this).attr('data-id');
  $.get('/articles/'+thisId)
    .done(function(data){
      console.log(data);
        // The title of the article
        $(".modal-header").html("<h2 class='modal-title' id='modal-title'>" + data.title + "</h2>"+
                                  "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
                                  "<span aria-hidden='true'>&times;</span>"+
                                  "</button>");
          if (data.note) {
            var noteId = 'note'+thisId
            $("#current-note").html("<ul id="+noteId+"></ul>");
            // Place the title of the note in the title input
            $("#"+noteId).append("<li><h3>"+data.note.title+"</h3><p>"+data.note.body+"</p></li>");
            // $("#titleinput").val(data.note.title);
            // // Place the body of the note in the body textarea
            // $("#bodyinput").val(data.note.body);
          }
          else{
            $("#current-note").html("");
          }

        // An input to enter a new title
        $("#modal-form").html("<input id='titleinput' name='title' class='col-10 titleinput' placeholder='note title'><br /><textarea id='bodyinput' name='body' class='col-10' placeholder='enter note'></textarea>");
        // A textarea to add a new note body
        // $(".modal-form").("<textarea id='bodyinput' name='body'></textarea>");
        // A button to submit a new note, with the id of the article saved to it
        $(".modal-footer").html("<button type='button' class='btn btn-secondary' data-dismiss='modal'>Close</button>"+
                                "<button class='btn btn-secondary' data-id='" + data._id + "' data-dismiss='modal' id='savenote'>Save Note</button>");


      });
  });

  $(document).on('click', '#savenote',function(){
    var thisId = $(this).attr('data-id');
    $.post('/articles/'+ thisId,
      {
        title: $('#titleinput').val(),
        body: $('#bodyinput').val(),
      })
        .done(function(data) {
          console.log(data);
          $('#notes').empty();
        });
    $('#titleinput').val("");
    $('#bodyinput').val("");
  });
