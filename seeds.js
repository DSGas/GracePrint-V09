const   mongoose        = require('mongoose'),
        Print           = require('./models/print'),
        Comment         = require('./models/comment');

// const data = [
//     {
//         name:"Ironman", 
//         artist:"Phantom city creative",
//         url:"https://collider.com/wp-content/uploads/iron-man-3-mondo-poster-phantom-city-creative.jpg"
//     },
//     {
//         name:"Lord of the rings", 
//         artist:"Gabz", 
//         url:"https://freight.cargo.site/w/2000/q/94/i/7791dde743950153a9bdc8af4a335f12f3ddc5f9e1fca4a73353c839a7d274d1/Foil_001.jpg"
//     },
//     {   name:"Avengers", 
//         artist:"Marko Manev",
//         url:"https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/64618f64482743.5ad44e328f530.jpg"
//     }
// ];

function seedDB(){
    Print.remove({}, function(err){
        if(err){
            console.log(err);
        } else {
            console.log('Removed DB completed');
            // data.forEach(function(seed){
            //     Print.create(seed, function(err, print){
            //         if(err){
            //             console.log(err);
            //         } else {
            //             console.log('New data added');
            //             // Comment.create(
            //             //     {
            //             //         author: 'Tony Stark',
            //             //         text: 'This is my fav!'
            //             //     }, function(err, comment){
            //             //         if(err){
            //             //             console.log(err);
            //             //         } else {
            //             //             print.comments.push(comment);
            //             //             print.save();
            //             //         }
            //             //     }
            //             // );
            //         }
            //     });
            // });
        }
    });
}

module.exports = seedDB;