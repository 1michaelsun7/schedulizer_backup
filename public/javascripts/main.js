$(document).ready(function(){

	$("#categories").on("mouseenter", function(){
		$(".inner-tab-container").show();
	});

	$(".tab-container").on("mouseleave", function(){
		$(".inner-tab-container").hide();
	});

	$("#signupButton").on("click", function(){
		createModals();
		createSignUpModal();

		$('.greyedOutOverlay').on("click", function(){
			removeModals();
		});
	});

	$("#loginButton").on("click", function(){
		createModals();
		createLogInModal();

		$('.greyedOutOverlay').on("click", function(){
			removeModals();
		});
	});

	if ($('#eventsWrapper').length){
		var targetHeight = window.innerHeight - 2*$('#mainNavbar').height() - $('#wrapper h1').height();
		$('#eventsWrapper').css({
			'height': targetHeight,
		});
		
	} 

	if ($('.tab-container').length){
		$('#wrapper').css({
			'width': '85%',
		});
		$('#wrapper h1').css({
			'font-size': '28pt'
		});
	} else {
		$('#wrapper').css({
			'width': '100%',
		});
		$('#wrapper h1').css({
			'font-size': '40pt'
		});
	}

	$('.event').on("click", '.sponsorThis', function(e){
		var target = $(e.target);
		var parent = $(e.target.parentNode.parentNode);
		var params = { eventID: parent.find(".eventid").html(), username: $("#eventsWrapper").find(".username").html() };
		$.get('/adminsponsor', params, function(data){
			parent.find(".sponsorName").html("Sponsor: " + data);
		});
		target.html("Unsponsor");
		target.addClass("unsponsorThis");
		target.addClass("btn-success");
		target.removeClass("btn-default");
		target.removeClass("sponsorThis");
	});

	$('.event').on("click", '.unsponsorThis', function(e){
		var target = $(e.target);
		var parent = $(e.target.parentNode.parentNode);
		var params = { eventID: parent.find(".eventid").html(), username: $("#eventsWrapper").find(".username").html() };
		$.get('/adminunsponsor', params, function(data){
			parent.find(".sponsorName").html("Sponsor: ");
		});
		target.html("Sponsor this event!");
		target.addClass("sponsorThis");
		target.addClass("btn-default");
		target.removeClass("btn-success");
		target.removeClass("unsponsorThis");
	});

	$('.event').on('click', '.likeButton', function(e){
		var target = $(e.target);
		var parent = $(e.target.parentNode.parentNode.parentNode);
		var params = { eventID: parent.find(".eventid").html(), userID: $("#eventsWrapper").find(".userid").html() };
		$.get('/upvote', params, function(data){
			parent.find(".glyphicon").html(data);
		});
		target.addClass("unlikeButton");
		target.addClass("btn-success");
		target.removeClass("btn-default");
		target.removeClass("likeButton");
	});

	$('.event').on('click', '.unlikeButton', function(e){
		var target = $(e.target);
		var parent = $(e.target.parentNode.parentNode.parentNode);
		var params = { eventID: parent.find(".eventid").html(), userID: $("#eventsWrapper").find(".userid").html() };
		$.get('/downvote', params, function(data){
			parent.find(".glyphicon").html(data);
		});
		target.addClass("likeButton");
		target.addClass("btn-default");
		target.removeClass("btn-success");
		target.removeClass("unlikeButton");
	});

	$('.scheduler').on('keypress', function(e){
		var target = $(this);
		var parent = $(this.parentNode.parentNode.parentNode);
		if (e.keyCode === 13 ){
			var curDate = $(this).val();
			console.log(curDate);
			var splitDate = curDate.split('/');
			console.log(splitDate);
			if (splitDate.length !== 3){
				$(this).val("Invalid date: must be of form mm/dd/yyyy");
			} else {
				var d = new Date();
				if (splitDate[0] > 11 || splitDate[0] < 0 || splitDate[1] < 0 || splitDate[1] > 30 || splitDate[2] < d.getFullYear()){
					$(this).val("Invalid date: date does not exist");
				} else {
					var datemonth = splitDate[0];
					var dateday = (parseInt(splitDate[1]) + 1).toString();
					if (splitDate[0] < 10){
						datemonth = "0" + datemonth;
					}
					if (splitDate[1] < 10){
						dateday = "0" + dateday;
					}
					var datestring = splitDate[2] + '-' + datemonth + '-' + dateday;
					console.log(datestring);
					var newDate = new Date(datestring);
					console.log(newDate);
					if (newDate < d){
						$(this).val("Invalid date: date is in past");
					} else {
						var params = {eventID: parent.find(".eventid").html(), eventDate: newDate};
						$.get('/schedulize', params, function(data){
							console.log(data);
						});
					}
				}
			}
		}
	});

	$('#viewPastEvents').on("click", function(){
		$('#viewPastEvents').hide();
		$('#viewAllEvents').show();
	});

	$('#viewAllEvents').on("click", function(){
		$('#viewPastEvents').show();
		$('#viewAllEvents').hide();
	});

	$(window).on('resize', function(){
		if ($(window).width() < 700){
			$('.tab-container').css({
				'width': 'auto',
			});
			$('#wrapper').css({
				'width': ($(window).width() - $('.tab-container').width() + 'px'),
			});
		} else {
			if ($('.tab-container').length){
				$('.tab-container').css({
					'width': '15%',
				});
				$('#wrapper').css({
					'width': '85%',
				});
				$('#wrapper h1').css({
					'font-size': '28pt'
				});
			} else {
				$('#wrapper').css({
					'width': '100%',
				});
				$('#wrapper h1').css({
					'font-size': '40pt'
				});
			}
		}

		if ($(window).width() < 500){
			if ($('#helloMessage').length){
				$('#helloMessage').hide();
			}
		} else {
			if ($('#helloMessage').length){
				$('#helloMessage').show();
			}
		}
	});
});

function createModals(){
	$(".greyedOutOverlay").fadeIn("slow", function(){ 
		$('.modal').fadeIn(function(){
			
		});
	});
}

function createSignUpModal(){
	$('.modal').empty();
	$('.modal').append("<h2><span class='fa fa-sign-in'></span>  Sign Up!</h2>");
	$('.modal').append("<form action='/signup' method='post'>" +
		"<div class='form-group'>" +
            "<label>Name</label>" +
            "<input type='text' class='form-control' name='name' required>" +
        "</div>" +
        "<div class='form-group'>" +
            "<label>Email</label>" +
            "<input type='email' class='form-control' name='email' required>" +
        "</div>" +
        "<div class='form-group'>" +
            "<label>Password</label>" +
            "<input type='password' class='form-control' name='password' required>" +
        "</div>" +
		"<button type='submit' class='btn btn-lg'>Sign Up!</button>" +
    "</form>");
    $('.modal form').css({
    	'font-size': '12pt'
    });
}

function createLogInModal(){
	$('.modal').empty();
	$('.modal').append("<h2><span class='fa fa-sign-in'></span>  Log In or <a id='createAccount'>Create Account</a></h2>");
	$('.modal').append("<form action='/login' method='post'>"+
        "<div class='form-group'>" +
            "<label>Email</label>" +
            "<input type='text' class='form-control' name='email'>" +
        "</div>" +
        "<div class='form-group'>" +
            "<label>Password</label>" +
            "<input type='password' class='form-control' name='password'>" +
        "</div>" +
		"<button type='submit' class='btn btn-lg'>Login</button>" +
    "</form>");
	$('a#createAccount').on("click", function(){
		$('.modal').empty();
		createSignUpModal();
	});
}

function removeModals(){
	$('.modal').empty();
	$('.modal').hide();
	$('.greyedOutOverlay').hide();
}