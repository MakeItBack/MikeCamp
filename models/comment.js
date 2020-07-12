// This is the module that creates the comment schema in mongoose and exports it as a 'Comment' model. 

// Require mongoose
const mongoose = require("mongoose");


// Set up schema for comments in the database. Comments have some text and an author
// We store information about the logged-in user inside the author so we can attribute the comment to the author automatically. Author is an object with two properties: a username and the id of the logged-in user.
const commentSchema = new mongoose.Schema({
	text: String,
	author: {id: 
			 		{type: mongoose.Schema.Types.ObjectId, 
					 ref: "User"},
			username: String,}
});


// Compile the schema (commentScheme) into a model (Comment) and export it for use in other files
module.exports = mongoose.model("Comment", commentSchema);