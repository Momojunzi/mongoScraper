var articleButton = $('#articleButton').on('click', function(event){
  $('.article-container').css({'display': 'block'});
  $.get('/scrape').done(function(){
      $.getJSON('/articles', function(data){
        for(var i=0; i<data.length; i++){
          $('#articles').append("<h3 class='articleTitle' data-toggle='modal' data-target='#notes-modal' data-id='" + data[i]._id + "'>" + data[i].title + "</h3>"+
          "<h4 class='col-11'>"+data[i].summary+"</h4><a href='"+data[i].link+"' target='_blank'><p>"+data[i].link + "</p></a><hr />");
        }
      });
      $('.articleButton').css({'display': 'none'});
    });
  })


$(document).on('click', ".articleTitle", function(){
  $('#notes').empty();
  var thisId = $(this).attr('data-id');
  $.get('/articles/'+thisId)
    .done(function(data){
        $(".modal-header").html("<h2 class='modal-title' id='modal-title'>" + data.title + "</h2>"+
                                  "<button type='button' class='close' data-dismiss='modal' aria-label='Close'>"+
                                  "<span aria-hidden='true'>&times;</span>"+
                                  "</button>");
          if (data.note) {
            var noteId = 'note'+thisId
            $("#current-note").html("<ul id="+noteId+"></ul>");

            $("#"+noteId).append("<li><h3>"+data.note.title+"</h3><p>"+data.note.body+"</p></li>");
          }
          else{
            $("#current-note").html("");
          }
        $("#modal-form").html("<input id='titleinput' name='title' class='col-10 titleinput' placeholder='note title'><br /><textarea id='bodyinput' name='body' class='col-10' placeholder='enter note'></textarea>");

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
          $('#notes').empty();
        });
    $('#titleinput').val("");
    $('#bodyinput').val("");
  });
