// File to contain all the MIDDLEWARE functions

// There are a few ways to set this up but we will create an empty object and then assign methods to it. Can also type thee functions directly inside the object when you declare it. Another way is to 
// At the end we export the object to make it available

// Require the two models files that we use in this file
const Site = require("../models/site");
const Comment = require("../models/comment");


const middlewareObject = {};


// CAMPSITE Middleware
// Checks if user is logged in AND if they are the owner/author of the current campground - used as middleware in edit, update and delete routes to only allow the owner to make changes.

middlewareObject.checkOwnership = function(req, res, next){
	// 	Check if the user logged in
	if(req.isAuthenticated()){
		// Look up the campground and save it to foundSite
		Site.findById(req.params.id, (err, foundSite)=>{
			if(err || !foundSite){
				req.flash("error", "Lost? Campsite not found");
				res.redirect("back");}
			else{
				// Check if the logged in user is the owner/author of the campsite (check the IDs match) and if so send them back into the route to complete the route (using next()). We compare the two ids using the .equals method instead of === because they are two different data types (mongoose data object vs. a string) so they wouldn't match. The .equals method has been provided for this purpose.
				if(foundSite.user.id.equals(req.user._id)){next();}
				else{
					req.flash("error", "No Trespassing! You can only edit or delete your own campsites");
					res.redirect("back");}
			}
		});} 
	else{
		req.flash("error", "You need to be logged in to do that");
		res.redirect("back");}	
};


// COMMENT Middleware
// Checks if user is logged in AND if they are the owner/author of the comment - used as middleware in edit, update and delete routes to only allow the owner to make changes.

middlewareObject.checkCommentOwner = function(req, res, next){
	// 	Check if the user logged in
	if(req.isAuthenticated()){
		// Look up the comment and save it to foundComment
		Comment.findById(req.params.comment_id, (err, foundComment)=>{
			if(err || !foundComment){
				req.flash("error", "Comment not found");
				res.redirect("back");}
			else{
				// Check if the logged in user is the original author of the comment (check the IDs match) and if so send them back into the route to complete the route (using next()). We compare the two ids using the .equals method instead of === because they are two different data types (mongoose data object vs. a string) so they wouldn't match. The .equals method has been provided for this purpose.
				if(foundComment.author.id.equals(req.user._id)){next();}
				else{
					req.flash("error", "Sorry, you can't do that!");
					res.redirect("back");}
			}
		});} 
	else{
		req.flash("error", "Hey stranger! You need to be logged in to do that");
		res.redirect("back");}	
};



// Checks to see if user is logged in (authenticated)

middlewareObject.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that");
	res.redirect("/login");
};



module.exports = middlewareObject;





