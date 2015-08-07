$(document).ready(function(){
	$('.userBlock').on("click", ".isAdmin", function(e){
		var target = $(e.target);
		var parent = $(e.target.parentNode);
		var params = {userID: parent.find(".usersid").html()};
		$.get('/unadminify', params, function(data){
			
		});
		target.addClass("isNotAdmin");
		target.addClass("btn-default");
		target.removeClass("btn-success");
		target.removeClass("isAdmin");
		target.html("Make Admin");
	});

	$('.userBlock').on("click", ".isNotAdmin", function(e){
		var target = $(e.target);
		var parent = $(e.target.parentNode);
		var params = {userID: parent.find(".usersid").html()};
		$.get('/adminify', params, function(data){
			
		});
		target.addClass("isAdmin");
		target.addClass("btn-success");
		target.removeClass("btn-default");
		target.removeClass("isNotAdmin");
		target.html("Remove Admin");
	});
});