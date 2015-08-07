var mongoose = require('mongoose');

function removeAll(arr, item) {
	for(var i = 0; i<arr.length; i++) {
		if(arr[i] == item) {
			arr.splice(i, 1);
		}
	}
}

function addTo(arr, item) {
	for(var i = 0; i<arr.length; i++) {
		if(arr[i] == item) {
			return;
		}
	}
	arr.push(item);
}

function contains(arr, item){
	for(var i = 0; i<arr.length; i++) {
		if(arr[i] == item) {
			return true;
		}
	}
	return false;
}

var defaultDate = new Date();
defaultDate.setDate(defaultDate.getDate() + 7);


var eventSchema = new mongoose.Schema({
	name: String,
	description: String,
	owner: String, //userid of creator
	category: String,
	date: { type: Date, default: defaultDate }, //date happening
	hidden: Boolean,
	upvotes: Number,
	sponsored: Boolean,
	sponsor: String,
	attendees: [String]
});

eventSchema.statics.findByName = function (name, cb) {
	return this.find({ name: new RegExp(name, 'i') }, cb);
}

eventSchema.statics.findByCategory = function (cat, cb) {
	return this.find({ category: new RegExp(cat, 'i') }).sort({upvotes: 'desc'}).limit(20).exec(cb);
}

eventSchema.statics.sortByUpvotes = function(cb) {
	return this.find({ hidden: false, date: { $gt: Date.now() } }).sort({upvotes: 'desc'}).limit(20).exec(cb);
}

eventSchema.statics.sortByUpcoming = function(cb) {
	return this.find({ hidden: false, sponsored: true, date: { $gt: Date.now() } }).sort({date: 'asc'}).limit(20).exec(cb);
}

eventSchema.statics.getPastEvents = function(cb) {
	return this.find().sort({date: 'desc'}).exec(cb);
}

eventSchema.statics.getEventsUserAttending = function(userId, cb){
	return this.find({ hidden: false, attendees: userId }).sort({upvotes: "desc"}).limit(20).exec(cb);
}

eventSchema.methods.isUserAttending = function(userId){
	return contains(this.attendees, userId);
}

eventSchema.methods.signupUserForEvent = function(userId, cb){
	console.log('upvoting');
	addTo(this.attendees, userId);
	this.upvotes++;
	this.save(cb);
}

eventSchema.methods.unsignupUserForEvent = function(userId, cb){
	console.log("downvoting");
	removeAll(this.attendees, userId);
	this.upvotes = this.attendees.length;
	this.save(cb);
}

eventSchema.methods.sponsoring = function(username, cb){
	console.log('sponsoring');
	this.sponsor = username;
	this.sponsored = true;
	this.save(cb);
}

eventSchema.methods.unsponsoring = function(cb){
	console.log('unsponsoring');
	this.sponsor = "";
	this.sponsored = false;
	this.save(cb);
}

eventSchema.methods.schedulize = function(dt, cb){
	console.log('schedulizing');
	this.date = dt;
	this.save(cb);
}

eventSchema.methods.getListOfEmails = function(){
	var emails = [];
	for (attend in this.attendees){
		User.findOne({_id: attend}, function(u){
			emails.push(u.email);
		});
	}
	return emails;
}

module.exports = mongoose.model('Event', eventSchema);