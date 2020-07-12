const express = require("express");
const router = express.Router();
const passport = require("passport");
const User = require("../models/user");


// ROOT Route
router.get("/", (req,res)=>{res.render("landing");});

// ========================
// AUTH ROUTES
// ========================

// Register Page route (sign-up form)
router.get("/register", (req, res)=>{res.render("users/register");});

// Sign up logic - post route
router.post("/register", (req, res)=>{
	let newUser = new User({username: req.body.username});
	User.register(newUser, req.body.password, (err,user)=>{
		if(err){
			return res.render("users/register", {"error": err.message});}
		passport.authenticate("local")(req,res, ()=>{
			req.flash("success", `Welcome to MikeCamp ${user.username}`);
			res.redirect("/campgrounds");
		});
	});
});

// LOGIN

// Route to render the login page - that contains the login form 
router.get("/login", (req,res)=>{res.render("users/login");});

// Route to process the username and password entered on the login page and sent here to authenticate the user
// Note that the authenticate function is NOT in the calback, it is an argument of the app.post. This is known as Middleware. Middleware is code that runs immediately and doesn't wait until after the first action is complete (like the callback does)
router.post("/login", 
// 		 Middleware
		 passport.authenticate("local", {
			successRedirect: "/campgrounds", 
			failureRedirect: "/login"}),	
// 		Callback function (doesn't do anything)
		 (req,res)=>{}
);
		
// LOGOUT
router.get("/logout", (req,res)=>{
	req.logout();
	req.flash("success", "You have logged out of MikeCamp!");
	res.redirect("/campgrounds");
});


module.exports = router;