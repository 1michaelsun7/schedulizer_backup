var mongoose = require('mongoose');

var notifSchema = new mongoose.Schema({
	text: String,
	expiration: { type: Date, default: Date.now }, //date added
	eventId: String
});

notifSchema.statics.getAllNotifsForEvent = function (eventId, cb) {
    return this.find({ eventId: eventId }).exec(cb);
}
 
module.exports = mongoose.model('Notif', notifSchema);