var mongoose = require('mongoose');

var defaultDate = new Date();
defaultDate.setDate(defaultDate.getDate() + 7);

var notifSchema = new mongoose.Schema({
	text: String,
	expiration: { type: Date, default: defaultDate }, //date added
	eventId: String
});

notifSchema.statics.getAllNotifsForEvent = function (eventIds, cb) {
    return this.find({ eventId: { $in: eventIds }, expiration: { $gt: Date.now() } }).exec(cb);
}
 
module.exports = mongoose.model('Notif', notifSchema);