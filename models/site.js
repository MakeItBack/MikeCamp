// This is the module that creates the campsite schema in mongoose and exports it as a 'Site' model. 

// Require mongoose
const mongoose = require("mongoose");


// Set up schema for campsites in the database
const campsiteSchema = new mongoose.Schema({
	name: String,
	location: String,
	image: String,
	description: String,
	user: {
			id: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
		   	username: String
		  },
	comments: [
		{
			type: mongoose.Schema.Types.ObjectId,
			ref: "Comment"
		}
	]
});

// Compile the schema (campsiteScheme) into a model (Site) and export it for use in other files
module.exports = mongoose.model("Site", campsiteSchema);

