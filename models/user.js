const mongoose 				= require("mongoose"),
	  passportLocalMongoose = require("passport-local-mongoose")

const UserSchema = new mongoose.Schema({
	username: String,
	password: String	
});

// The passport-local-mongoose package adds lots of methods to our user schema to enable/simplify authentication with passport.
// To use it, we just need to require the package in our user model file (see above) and then use the following line to add it to our Schema
UserSchema.plugin(passportLocalMongoose);

// Export the UserSchema model as 'User' so it can be used on our app
module.exports = mongoose.model("User", UserSchema);

