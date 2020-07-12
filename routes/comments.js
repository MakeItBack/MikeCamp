const express = require("express");
const router = express.Router({mergeParams: true});
// The mergeParams:true option makes sure that the request parameters available in the app.js file are also pushed out to the route file. It merges the parameters in the campgrounds and comments routes. In this case it makes sure that the site id parameter is available in this file

// Require the Site and Comment models so they can be used here
const Site = require("../models/site");
const Comment = require("../models/comment");

// Require middleware file
const middleware = require("../middleware");


// ========================
// COMMENTS ROUTES
// ========================
// Note that all the route declarations have been shortened because we already specified the path in the app.js file in the app.use code

// NEW
// Route to load the new comments form. The isLoggedIn middleware checks if the user is authenticated and only renders the 'new comment' page if they are logged in otherwise it sends them to the login form instead
router.get("/new", middleware.isLoggedIn, (req, res)=>{
// 		Find the campsite from it's ID and pass the campsite data through to the new comments form
	Site.findById(req.params.id, (err,foundSite)=>{
		if(err){console.log(err);}
		else{res.render("comments/new", {campsite: foundSite} );}	
	})
});

// CREATE
router.post("/", middleware.isLoggedIn, (req, res)=>{
// 	Lookup campsite using ID
	Site.findById(req.params.id, (err,foundSite)=>{
		if(err){console.log(err);
			   res.redirect("/campgrounds");}
		else{
		// 	Create new comment.
		// The comment is a ready made object due to the way we set it up in the form so we don't need to assemble the separate data (text, author)
			Comment.create(req.body.comment, (err, comment)=>{
				if(err){
					req.flash("error", "Bugger! Something went wrong!");
					console.log(err);}
				else{
				// Add the username and id of the logged in user to the comment						
					comment.author.id = req.user._id;
					comment.author.username = req.user.username;
				// 	Save Comment
					comment.save();
				//	Push the new comment into the comments array within the correct campsite, then save the campsite
					foundSite.comments.push(comment);
					foundSite.save();
					req.flash("success", "Thanks! Your comment has been added");
					res.redirect(`/campgrounds/${foundSite._id}`);
				}
			});	
		}
	});
});

// EDIT
router.get("/:comment_id/edit", middleware.checkCommentOwner, (req,res)=>{
	Site.findById(req.params.id, (err, foundSite)=>{
		if(err || !foundSite){
			req.flash("error", "Campsite not found");
			res.redirect("back");}
		else{
			Comment.findById(req.params.comment_id, (err,foundComment)=>{
				if (err){res.redirect("back");}
				else{res.render("comments/edit", {campsite: foundSite, comment: foundComment});}
			});	
		}
	});
});


// UPDATE
router.put("/:comment_id", middleware.checkCommentOwner, (req,res)=>{
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, (err,updatedComment)=>{
		if(err){res.redirect("back");}					  
		else{
			req.flash("success", "Got it! Comment updated");
			res.redirect(`/campgrounds/${req.params.id}`);}					  
	});
});


// DESTROY (Delete)
router.delete("/:comment_id", middleware.checkCommentOwner, (req, res)=>{
	Comment.findByIdAndRemove(req.params.comment_id, (err)=>{
		if(err){res.redirect("back");}
		else{
			req.flash("success", "Comment successfully deleted");
			res.redirect(`/campgrounds/${req.params.id}`);}
	});
});


// MIDDLEWARE - isLoggedIn and checkCommentOwner are in the Middleware file



module.exports = router;