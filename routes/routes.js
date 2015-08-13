var Event = require("../models/event.js");
var Content = require("../models/content.js");
var Notif = require("../models/notif.js");
var User = require('../models/user');

var isAuthenticated = function (req, res, next) {
	// if user is authenticated in the session, call the next() to call the next request handler 
	// Passport adds this method to request object. A middleware is allowed to add properties to
	// request and response objects
	if (req.isAuthenticated())
		return next();
	// if the user is not authenticated then redirect him to the login page
	res.redirect('/');
}

function contains(arr, item){
	for(var i = arr.length; i--;) {
		if(arr[i] === item) {
			return true;
		}
	}
	return false;
}

module.exports = function(app, passport, qs) {

	app.get('/', function(req, res, next) {
	  res.render('index', { title: 'After Three', message: req.flash('message') });
	});

	app.get('/admincenter', isAuthenticated, function(req, res, next) {
	  if (req.user.isSuperAdmin){
	  	var allusers = [];
	  	User.find(function(err, us){
	  		if (err){
	  			console.log(err);
	  			res.redirect("/main");
	  		}
	  		console.log(us);
	  		res.render('admincenter', { title: 'After Three Admin Center', user: req.user, allusers: us});
	  	});
	  	
	  		
	  } else {
	  	res.render('/');
	  }
	  
	});

	app.get('/archive', isAuthenticated, function(req, res, next){
		var allevents = [];
		Event.getAllEvents(function(err, events){
			if (err){
				console.log("Error Loading Events");
				throw err;
			}
			events.forEach(function(ev){
				allevents.push(ev);
			});
			res.render('archive', { title: 'After Three Event Archive', user: req.user, allevents: allevents});
		});
	});

	app.get('/event', isAuthenticated, function(req, res, next) {
	  var passedEventId = req.query.id;
	  var eventContent = [];
	  Content.getAllContentForEvent(passedEventId, function(err, c){
	  	if (err){
	  		console.log("Error Loading Content");
	  		throw err;
	  	} else {
	  		c.forEach(function(ct){
	  			eventContent.push(ct);
	  		});
	  		console.log(eventContent);
	  		Event.findOne({_id: passedEventId}, function(err, evt){
				if (err){
					console.log("Event does not exist");
					res.redirect("/main");
				}
				if (evt.hidden){
					console.log("Event does not exist");
					res.redirect("/main");
				} else {
					var thisEvent = evt;
					res.render('event', { title: thisEvent.name, user: req.user, evt: thisEvent, cont: eventContent });
				}
			});
	  	}
	  });
	  
	});

	app.get('/leaderboard', isAuthenticated, function(req, res, next) {
	  var toptwenty = [];
	  Event.sortByUpvotes(function(err, events){
	  	if (err){
	  		console.log(err);
	  		res.redirect("/main");
	  	}
	  	events.forEach(function(e){
	  		toptwenty.push(e);
	  	});
	  	console.log(toptwenty);
	  	res.render('leaderboard', { title: 'Leaderboard', user: req.user, leaderboard: toptwenty });
	  });
	  
	});

	app.get('/logout', function(req, res) {
		req.logout();
		res.redirect('/');
	});

	app.get('/main', isAuthenticated, function(req, res, next) {
		var eventids = [];
		var nos = [];
		Event.getEventsUserAttending(req.user._id, function(err, events){
			if (err){
				console.log(err);
				res.render('main', { title: 'Main Page', user: req.user });
			}
			events.forEach(function(e){
				eventids.push(e._id);
			});
			console.log(eventids);
			Notif.getAllNotifsForEvent(eventids, function(err, notifs){
				if (err){
					console.log(err);
					res.render('main', { title: 'Main Page', user: req.user });
				}
				notifs.forEach(function(n){
					nos.push(n);
				});
				console.log(nos);
				res.render('notifcenter', { title: 'Main Page', user: req.user, notifs: nos });
			});
			
		});
	});

	app.get('/myEvents', isAuthenticated, function(req, res, next) {
	  var mytwenty = [];
	  Event.getEventsUserAttending(req.user._id, function(err, events){
	  	if (err){
	  		console.log(err);
	  		res.redirect("/main");
	  	}
	  	events.forEach(function(e){
	  		mytwenty.push(e);
	  	});
	  	console.log(mytwenty);
	  	res.render('myEvents', { title: 'My Extracurriculars', user: req.user, mine: mytwenty });
	  });
	});

	app.get('/suggest', isAuthenticated, function(req, res, next) {
	  res.render('suggest', { title: 'Suggest an Extracurricular!', user: req.user });
	});

	app.get('/upcoming', isAuthenticated, function(req, res, next) {
	  var upcomingtwenty = [];
	  Event.sortByUpcoming(function(err, events){
	  	if (err){
	  		console.log(err);
	  		res.redirect("/main");
	  	}
	  	events.forEach(function(e){
	  		upcomingtwenty.push(e);
	  	});
	  	console.log(upcomingtwenty);
	  	res.render('upcoming', { title: 'Upcoming Extracurriculars', user: req.user, upcoming: upcomingtwenty });
	  });
	});

	// getting started tutorial
	app.get('/gettingstarted',isAuthenticated, function(req, res, next) {
		res.render('gettingstarted', {title: 'Getting Started', user: req.user});
	});

	//UPVOTE/DOWNVOTE
	app.get('/upvote', isAuthenticated, function(req, res, next){
	  var uID = req.query.userID;
	  Event.findById(req.query.eventID, function(err, evt){
	  	if (err){
	  		console.log(err);
	  	}
		if (!contains(evt.attendees, uID)){
			evt.signupUserForEvent(uID, function(){
				res.send(''+evt.upvotes);
			});
		}
	});
	  
	});

	app.get('/downvote', isAuthenticated, function(req, res, next){
	  var uID = req.query.userID;
	  Event.findById(req.query.eventID, function(err, evt){
	  	if (err){
	  		console.log(err);
	  	}
	  	evt.unsignupUserForEvent(uID, function(){
	  		res.send(''+evt.upvotes);
	  	});
	  });
	  
	});

	//SPONSOR/UNSPONSOR

	app.get('/adminsponsor', isAuthenticated, function(req, res, next){
		Event.findById(req.query.eventID, function(err, evt){
		  	if (err){
		  		console.log(err);
		  	}
			if (!evt.sponsored){
				evt.sponsoring(req.query.username, function(){
					var note = new Notif();
					note.text = "Event " + evt.name + " sponsored by " + req.query.username + ".";
					note.eventId = req.query.eventID;
					note.save(function(err, newnote){
			  			res.send(req.query.username);
					});
			  		
			  	});
			}
		  	
		});
	});

	app.get('/adminunsponsor', isAuthenticated, function(req, res, next){
		Event.findById(req.query.eventID, function(err, evt){
		  	if (err){
		  		console.log(err);
		  	}
			if (evt.sponsor == req.query.username){
				evt.unsponsoring(function(){
			  		res.send(req.query.username);
			  	});
			}
		  	
		  });
	});

	//SCHEDULE

	app.get('/schedulize', isAuthenticated, function(req, res, next){
		Event.findById(req.query.eventID, function(err, evt){
		  	if (err){
		  		console.log(err);
		  	}
			evt.schedulize(req.query.eventDate, function(){
				var note = new Notif();
				var d = req.query.eventDate;
				note.text = "Event " + evt.name + " scheduled for " + req.query.eventDate.substring(0, 15) + ".";
				note.eventId = req.query.eventID;
				note.save(function(err, newnote){
					res.send(req.query.eventDate);
				});
				
			});
		  	
		});
	});

	//ADMINIFY

	app.get('/adminify', isAuthenticated, function(req, res, next){
		User.findById(req.query.userID, function(err, u){
			if (err){
				console.log(err);
			}
			
			u.isAdmin = true;
			u.save();
		})
	});

	app.get('/unadminify', isAuthenticated, function(req, res, next){
		User.findById(req.query.userID, function(err, u){
			if (err){
				console.log(err);
			}
			
			u.isAdmin = false;
			u.save();
		})
	});

	//CONTENTIFY
	app.post('/addcontent', isAuthenticated, function(req, res, next){
		var body = req.body;
		var cont = new Content();
		cont.name = body.conturl;
		cont.creator = body.userID;
		cont.url = body.conturl;
		cont.eventId = body.eventID;
		cont.save(function(err, newC){
			if (err){
				console.log('Error in save content: ' + err);
				throw err;
			}
			var note = new Notif();
			note.text = "Content added to event " + body.eventname + ".";
			note.eventId = body.eventID;
			note.save(function(err, newnote){
				res.redirect('/event?id=' + body.eventID);
			});
			
		});

	});

	app.get('/removecontent', isAuthenticated, function(req, res, next){
		console.log(req.query);
		Content.findOne({eventId : req.query.eventID, url: req.query.conturl }, function(err, cont){
			if (err){
				console.log(err);
				throw err;
			}
			console.log(cont);
			cont.removeContentFromEvent(function(err){
				if (err){
					console.log("Error in remove content: " + err);
					throw err;
				}
				res.redirect('/event?id=' + req.query.eventID);
			});
		});
	});

	//LIST OF ATTENDEES

	app.get('/viewattendees', isAuthenticated, function(req, res, next){
		var listofattendees = [];
		Event.findOne({_id: req.query.eventID}, function(err, evt){
			if (err){
				console.log(err);
				throw err;
			}
			console.log(evt);
			var listofids = evt.attendees;
			User.find({_id: {$in: listofids}}, function(err2, atds){
				if (err2){
					console.log(err2);
					throw err2;
				}
				atds.forEach(function(atd){
					listofattendees.push(atd.name);
				});
				console.log(listofattendees);
				res.send(listofattendees);
			});
		});
	});

	//LOGIN AND LOGOUT
	app.post('/login', passport.authenticate('login', {
		successRedirect: '/main',
		failureRedirect: '/',
		failureFlash : true  
	}));

	app.post('/signup', passport.authenticate('signup', {
		successRedirect: '/main',
		failureRedirect: '/',
		failureFlash : true  
	}));

	//suggest event
	app.post('/suggest', function(req, res, next){
		console.log(req.body);
		var body = req.body;
		var eventName = body.eventName;
		var eventDesc = body.eventDesc;
		var eventCat = body.eventCatHidden;
   		var ev = new Event();
		ev.name = eventName;
		ev.description = eventDesc;
		ev.owner = req.user._id; //userid of creator
		ev.category = eventCat;
		ev.hidden = false;
		ev.upvotes = 0;
		ev.sponsor = "";
		ev.sponsored = false;
		ev.attendees = [];
		ev.save(function(err, newEv){
			if (err){
				console.log('Error in Saving event: '+err);  
				throw err;
			} else {
				var evID = newEv._id;
				res.redirect('/event?id=' + evID);
			}
		});
		
	});

	app.get('/', function(req, res, next) {
	  res.send('respond with a resource');
	});
};