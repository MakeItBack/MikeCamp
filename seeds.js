const mongoose = require("mongoose");
const Site = require("./models/site");
const Comment = require("./models/comment");

const farmLife = "Gobblers pens, radish on kidney beans, llamas pick up truck. Shovels at rakes plows. Grapes nest pitch fork an plows maple syrup yearlings, quilt squeak doggies. Apples ducks straw, quail a ostriches donkey, hay hook cucumbers. Peacocks baa ostriche. Owls. Goose hammers cattle rats in crows. Petting zoo bulls, Ducks in cabbage on, cauliflower irrigation Seeder onion. Baa potato donkey mouse, at gate grain bins woof. Ewes mushrooms zucchini in forage Harvester at sheep with tractor. Augers oats hen cowpies. Augers oats hen cowpies. ";



const seedData = [
		{name: "O'Briens Crossing", 
		 location: "Lerderderg State Park", 
		 image: "https://www.weekendnotes.com/im/003/01/dsc003001.JPG",
		 description: farmLife,
		 user: {id : "5ee58ecaaca3642eaff0c98f", username: "Potato"}
		},
		{name: "Kurth Kiln", 
		 location: "Gembrook", 
		 image: "https://4wdchallenge.files.wordpress.com/2012/09/gembrook-013.jpg?w=1200&h=",
		 description: farmLife,
		 user: {id : "588c2e092403d111454fff71", username: "seed data"}
		},
		{name: "Merringtons", 
		 location: "Thompson Dam", 
		 image: "https://kuuee.com/files/sites/201406/d31e3f25_0606_d71f.jpg",
		 description: farmLife,
		 user: {id : "5ee58ecaaca3642eaff0c98f", username: "Potato"}
		},
		{name: "Major Creek Reserve", 
		 location: "Mitchellstown",
		 image: "https://res.cloudinary.com/aircamp/image/upload/s--hBPan-e6--/c_fill,h_480,q_auto,w_720/v1/production/app_campsite_uploads/i1ta6u0x8fo6wlwdrb3s",
		 description: farmLife,
		 user: {id : "588c2e092403d111454fff71", username: "seed data"}
		},
		{name: "Balley Hooley", 
		 location: "Buchan", 
		 image: "https://matthewkeighery.com/wp-content/uploads/2014/03/SnowyRiverNight-0728-624x374.jpg",
		 description: farmLife,
		 user: {id : "5ee58ecaaca3642eaff0c98f", username: "Potato"}
		},
		{name: "Binn Beach", 
		 location: "Bemm River",
image:"https://static.wixstatic.com/media/442bb8_bf05c201bebe4dfcab5fddf958d3becf~mv2.jpg/v1/fill/w_600,h_402,fp_0.50_0.50,q_90/442bb8_bf05c201bebe4dfcab5fddf958d3becf~mv2.webp",
		 description: farmLife,
		 user: {id : "5ee58ecaaca3642eaff0c98f", username: "Potato"}
		},
		{name: "Coopers Creek", 
		 location: "Walhalla", 
		 image: "https://www.4wdvictoria.org.au/images/Coopers-Creek_Picnic-Area_Open2.jpg",
		 description: farmLife,
		 user: {id : "5ee58ecaaca3642eaff0c98f", username: "Potato"}
		},
		{name: "Blue Pool",
		 location: "Briagolong",
		 image: "https://cdn.exploroz.com/images/forum/uploads/Q101079_3__TN1000x800.jpg?gid=74427",
		 description: farmLife,
		 user: {id : "5ee58ecaaca3642eaff0c98f", username: "Potato"}
		},
		{name: "Blairs Hut", 
		 location: "Upper Plenty", 
		 image: "https://cdn.australia247.info/assets/uploads/e479523d69b3e43e18fa3507d9d95284_-victoria-whittlesea-city-clonbinane-blairs-huthtml.jpg",
		 description: farmLife,
		 user: {id : "5ee58ecaaca3642eaff0c98f", username: "Potato"}
		}
];	

// function seedDB(){
//    //Remove all campgrounds
//    Site.deleteMany({}, (err)=>{
//         if(err){console.log(err);}
//         console.log("Removed all campsites!");
        
// 		//Remove all comments
// 		Comment.deleteMany({}, (err)=>{
//             if(err){console.log(err);}
//             console.log("Removed all comments!");
            
// 			//add a few campgrounds
//             seedData.forEach((seed)=>{
//                 Site.create(seed, (err, campsite)=>{
//                     if(err){console.log(err)}
// 					else {console.log("Just added a new campsite!");
//                         // create a comment
//                         Comment.create(
//                             {
// 								text: "This place is great, abundant firewood, a river of beer and no phone coverage",
//                                 author: {username: "seed data"}
//                             }, (err, comment)=>{
//                                 if(err){console.log(err);}
// 								else {
//                                     campsite.comments.push(comment);
//                                     campsite.save();
//                                     console.log("Just left a comment!");
//                                 }
//                             });
//                     }
//                 });
//             });
//         });
//     }); 
// }

// SeedDB function re-written with async/await to make it much cleaner and avoid 'callback hell!!' Fro YouTube video by Ian
async function seedDB(){
	try {
		await Site.deleteMany({});
		console.log("Removed all campsites!");
		await Comment.deleteMany({});
		console.log("Removed all comments!");

		for(const seed of seedData){
			let newCampsite = await Site.create(seed);
			console.log("Just added a new campsite!");
			let newComment = await Comment.create(
				{
					text: "This place is great, abundant firewood, a river of beer and no phone coverage",
					author: {id : "5ee58ecaaca3642eaff0c98f", username: "Potato"}
				}
			)
			console.log("Just created a comment!");
			newCampsite.comments.push(newComment);
			newCampsite.save();
			console.log("Comment saved to the new campsite");
		}
	}
	catch(err){console.log(err);}
		
};
        


module.exports = seedDB;



