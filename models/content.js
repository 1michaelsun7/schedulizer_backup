var mongoose = require('mongoose');

var contentSchema = new mongoose.Schema({
	name: String,
	creator: String, //userid of creator
	url: String, // url to content
	date: { type: Date, default: Date.now }, //date added
	eventId: String
});

contentSchema.statics.getAllContentForEvent = function (eventId, cb) {
    return this.find({ eventId: eventId }).exec(cb);
}

contentSchema.methods.removeContentFromEvent = function(cb){
    return this.model('Content').find({ _id: this._id }).remove(cb);
}
 
module.exports = mongoose.model('Content', contentSchema);