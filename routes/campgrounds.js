const express = require("express");
const router = express.Router();

// Require the Site model so we can use it in this file
const Site = require("../models/site");

// Require the Middleware file - note that we only have to specify the directory and not filename. The file is called index.js so it will be imported automatically.
const middleware = require("../middleware");


// ========================
// CAMPGROUND ROUTES
// ========================
// Note that all the route declarations have been shortened because we already specified the path in the app.js file in the app.use code

// INDEX
router.get("/", (req,res)=>{
// 	Get all the campgrounds from the db

	Site.find({}, (err, allSites)=>{
			if(err){console.log("BUGGER!");console.log(err)}
			else {res.render("campsites/index", {campsites: allSites});};
	});
});

// NEW
// isLoggedIn middleware ensures only logged in users can complete this route
router.get("/new", middleware.isLoggedIn, (req, res)=>{res.render("campsites/new");});

// CREATE
// This is the POST route to allow users to add a new campground. 
// Note that the post route destination (campgrounds) is the same as the campgrounds page - this follows the REST naming convention
// isLoggedIn middleware ensures only logged in users can complete this route
router.post("/", middleware.isLoggedIn, (req, res)=>{
	// 	extract the inputs from the form and save them to variables
	let siteName = req.body.name;
	let siteImage = req.body.image;
	let siteLocation = req.body.location;
	let siteDescription = req.body.description;
	let siteCreator = {id: req.user._id, username: req.user.username};
	// create a new campsite object from the data	
	let newSite = {name: siteName, location: siteLocation, image: siteImage, description: siteDescription, user: siteCreator};
			
			// push the newSite object into the array containing the other campgrounds (don't need this any more now we are using a db)
			// siteData.push(newSite);
	
	//Save the newSite object to the database
	Site.create(newSite, (err, newOne)=>{
			if(err){console.log("BUGGER!");console.log(err)}
			else{
				// 	Redirect back to the campgrounds (get) route to show the campgrounds page, including the new site
				res.redirect("/campgrounds");
				};
	});
});
	
// SHOW 
// This is the route to display the detail about one particular campsite based on it's ID
router.get("/:id", (req, res)=>{
	// Get the data for the requested campsite, using the ID
	// Fill in the associated comments using the .populate method and execute (.exec)	
	Site.findById(req.params.id).populate("comments").exec((err,foundSite)=>{
		if(err || !foundSite){
			req.flash("error", "Error - not a valid Campsite");
			res.redirect("back");}
		// Render the show page using the data for the requested campsite 	
		else{res.render("campsites/show", {campsite: foundSite});}	
	});
});

// EDIT
router.get("/:id/edit", middleware.checkOwnership, (req,res)=>{
	Site.findById(req.params.id, (err, foundSite)=>{
		res.render("campsites/edit", {campsite: foundSite});
	});
});


// UPDATE
router.put("/:id", middleware.checkOwnership, (req,res)=>{
	// Find update the correct campsite
	Site.findByIdAndUpdate(req.params.id, req.body.site, (err, editedSite)=>{
		if(err){res.redirect("/campgrounds");}
		else{
			req.flash("success", "Campsite updated");
			res.redirect(`/campgrounds/${req.params.id}`);}
	});
});


// DESTROY (delete route)
router.delete("/:id", middleware.checkOwnership, (req, res)=>{
	Site.findByIdAndRemove(req.params.id, (err)=>{
		if(err){res.redirect("/campgrounds/");}
		else{res.redirect("/campgrounds");}
	});
});


// MIDDLEWARE files - checkOwnership and isLoggedIn are in the Middleware file



// Our route file is exporting router.
// This is what we have referenced in our get and post routes above i.e. router.get, router.post etc
module.exports = router;
