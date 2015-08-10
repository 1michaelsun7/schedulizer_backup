$(document).ready(function(){
  $( ".draggable" ).draggable({
    containment: "parent"
  });

  $("#add-website").on("click", function(){
    $('.greyedOutOverlay').fadeIn("slow", function(){
      $('#add-website-modal').fadeIn("slow");
    });
    
  });

  $('#add-website-modal').on('shown.bs.modal', function () {
    $('#website-url').focus();
  });

  // This is the button INSIDE the add website modal
  $("#add-website-btn").click(function (e) {
    var url = $("#website-url").val().trim();
    if (urlIsValid(url)){
      url = $("#url-beginning").text() + url;
      $("#website-url").val("");
      $(".singleEvent").append(createWebsiteObject(url));

      
      $('.greyedOutOverlay').hide();
      $("#add-website-modal").hide();

      var params = {conturl: url, userID: $("#eventsWrapper").find(".userid").html(), eventID: $(".singleEvent").find(".eventid").html()};
      $.post('/addcontent', params, function(data){});
             
    } else{
      $("#add-website-error-msg").text("Please enter a valid URL.");
    }
    
  });

  $("#add-website-modal").on('hide.bs.modal', function(e){
    $('.greyedOutOverlay').hide();
    $("#add-website-error-msg").text("");  
  });

  $("#website-url").keypress(function(e){
    if (e.which == 13){
      $("#add-website-btn").click();
    }
  });

  $('.close').on('click', function(){
    $('.greyedOutOverlay').hide();
    $('#add-website-modal').hide();
  });

  $('#cancel-add-website').on('click', function(){
    $('.greyedOutOverlay').hide();
    $('#add-website-modal').hide();
  });

  $(".website-link").on('click', '.removeEvent', function(e){
    e.preventDefault();
    var target = $(e.target);
    var parent = $(e.target.parentNode);
    var conttitle = parent[0].title;
    parent.remove();
    var params = {conturl: conttitle, eventID: $(".singleEvent").find(".eventid").html()};
    $.get('/removecontent', params, function(data){});
  })
});

// Source for thumbnails: http://pagepeeker.com/website-thumbnails-api/
var createWebsiteObject = function(url){
  var fullUrl = url;
  var getImageUrl = "http://free.pagepeeker.com/v2/thumbs.php?size=m&url=" + fullUrl;

  var link = $('<a>', {href: fullUrl,
                   class:"website-link draggable",
                   title: fullUrl,
                   target: "_blank"});
  var image = '<img class="website-image" src=' + getImageUrl + '/>';

  var website = $('<span>', {class: "website-url",
                            text: url});
  link.append(image);
  link.append(website);
  return link;
}


var urlIsValid = function(url){
  if (url.indexOf(" ") > -1){
    return false
  }
  var splitUrl = url.split(".");
  if (splitUrl.length == 1){ // there was no period
    return false;
  }
  return true;
}