const 	express			= require("express"),
		app 			= express(),
		mongoose 		= require("mongoose"),
	  	flash			= require("connect-flash"),
		passport		= require("passport"),
		bodyParser 		= require("body-parser"),
	  	LocalStrategy	= require("passport-local"),
	  	methodOverride	= require("method-override"),
	  	Site			= require("./models/site"),
		User			= require("./models/user"),
	  	Comment			= require("./models/comment"),
		seedDB			= require("./seeds")
		
const 	commentRoutes 		= require("./routes/comments"),
		campgroundRoutes 	= require("./routes/campgrounds"),
	  	indexRoutes			= require("./routes/index")

// Connect mongoose to our Mongo database and create a new collection in the db called MikeCamp
mongoose.connect('mongodb://localhost:27017/MikeCamp', {useNewUrlParser: true, useUnifiedTopology: true} );

// Fix depreciation error caused by findByIdAndUpdate
mongoose.set('useFindAndModify', false);

// Tell express to use body parser
app.use(bodyParser.urlencoded({extended:true}));

// Tell express to use connect-flash (error handling and other messages)
app.use(flash());

// Serve up the public folder so we can make our stylesheets available. the __dirname part specifies the path as the same as the 'current' directory of this file
app.use(express.static(__dirname + "/public"));

// Tell express to use method override for the routing
app.use(methodOverride("_method"));

// Set the file type to ejs
app.set("view engine", "ejs");

// Set up data schemas for campsites, users and comments in the database ***see models directory***

// Seed my database with data from the SeedDB files
seedDB();

// PASSPORT Configuration
app.use(require("express-session")({
	secret: "Citrus is the best kind of fruit",
	resave: false,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// This middleware code pushes data to every template / every route. Whatever we put in res.locals is what's available in our template
// req.user contains information about the logged-in user (or none) and saves it to currentUser. Passport adds this. We can pass this through to our ejs templates (as currentUser variable) so we can use it there for the logic in the navbar login buttons.	We are also passing through the flash messages so they are available on each page.
app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
});


// ===================
// STARTER DATA
// ===================

// This is an array that contained my campsite data before we started using the database. NO LONGER REQUIRED. Moved to seed data file
	// let siteData = [
	// 	{name: "O'Briens Crossing", location: "Lerderderg State Park", image: "https://www.weekendnotes.com/im/003/01/dsc003001.JPG"},
	// 	{name: "Kurth Kiln", location: "Gembrook", image: "https://4wdchallenge.files.wordpress.com/2012/09/gembrook-013.jpg?w=1200&h="},
	// 	{name: "Merringtons", location: "Thompson Dam", image: "https://kuuee.com/files/sites/201406/d31e3f25_0606_d71f.jpg"},
	// 	{name: "Major Creek reserve", location: "Mitchellstown", image: "https://res.cloudinary.com/aircamp/image/upload/s--hBPan-e6--/c_fill,h_480,q_auto,w_720/v1/production/app_campsite_uploads/i1ta6u0x8fo6wlwdrb3s"},
	// 	{name: "Balley Hooley", location: "Buchan", image: "https://matthewkeighery.com/wp-content/uploads/2014/03/SnowyRiverNight-0728-624x374.jpg"},
	// 	{name: "Binn Beach", location: "Bemm River", image: "https://static.wixstatic.com/media/442bb8_bf05c201bebe4dfcab5fddf958d3becf~mv2.jpg/v1/fill/w_600,h_402,fp_0.50_0.50,q_90/442bb8_bf05c201bebe4dfcab5fddf958d3becf~mv2.webp"},
	// 	{name: "Coopers Creek", location: "Walhalla", image: "https://www.4wdvictoria.org.au/images/Coopers-Creek_Picnic-Area_Open2.jpg"},
	// 	{name: "Blue Pool", location: "Briagolong", image: "https://cdn.exploroz.com/images/forum/uploads/Q101079_3__TN1000x800.jpg?gid=74427"},
	// 	{name: "Blairs Hut", location: "Upper Plenty", image: "https://cdn.australia247.info/assets/uploads/e479523d69b3e43e18fa3507d9d95284_-victoria-whittlesea-city-clonbinane-blairs-huthtml.jpg"},
	// 					];	


// ========================
// ROUTES
// ========================

// All routes have been moved to separate route files and then required and used in here
// This uses the express router
// Tell this app file to use the three separate router files that we have created (we also require them at the top)
// We can add a first argument which is the common route structure that all the routes in the referenced file will use, then you can take out the full path in the route file. This dries up / simplifies the code a bit in these 3 route files. For example all campground routes will automatically start with /campgrounds. The indexRoutes use statement omits this argument because it's not needed as we are dealing with the root
app.use(indexRoutes);
app.use("/campgrounds", campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);


app.listen(3000, process.env.IP, ()=>{console.log("Hooray we're going camping!!!");});
