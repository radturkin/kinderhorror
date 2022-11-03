const express = require('express')
const app = express()
const ejs = require('ejs')

const bodyParser = require("body-parser")
const MongoClient = require('mongodb').MongoClient
const movieOfTheMonth = 23

//connect to .env file for privacy
require("dotenv").config();
 
// const cors = require('cors')
const PORT = process.env.PORT || 8000;

MongoClient.connect(process.env.connectionString, { useUnifiedTopology: true })
   .then(client => {
    console.log('Connected to Database')
    const db = client.db('films')
    const filmCollection = db.collection("kinderhorror")
    
    app.set('view engine', 'ejs')
    app.use(express.static('public'))

    app.use(bodyParser.urlencoded({ extended: true}))
    //to read json
    app.use(bodyParser.json())
//mdae change to line 31 {films: results}
   
    app.get('/admin', (req, res) => {
        db.collection('kinderhorror').find().toArray()
          .then(results => {
            res.render('pages/admin.ejs', {films: results})

          })
          .catch(error => console.error(error))

        })
        app.get('/', (req, res) => {
          db.collection('kinderhorror').find().toArray()

          .then(results => {

            res.render('pages/index.ejs', {films: results,
              motmtitle: results[22].title,
              motmreview: results[22].review,
              motmsummary: results[22].summary,
              motmkids: results[22].forKids,
              motmrating: results[22].rating,
              motmtriggers: results[22].triggers,
              motmimdblink: results[22].imdb,
              motmwikilink: results[22].wiki, 
              motmtrailer: results[22].trailer,
            })
            console.log(results[22].title)

                  })
                  .catch(error => console.error(error))

                })

// // // Root Route
app.get("/:name", function (req, res, next) {
  let movieTitle = req.params.name
  // if (movieTitle === "random") {
  //       const randomNum = Math.floor(Math.random() * Object.values(movies).length)
  //       movieTitle = (Object.values(movies)[randomNum]["title"])
  //     }

  db.collection("kinderhorror")
    .find({ title: movieTitle })
    .toArray()

    .then(results => {
    
  
    let movie = (results[0])
    console.log(movie.trailer)
  
    res.render('pages/api', {
      title: movie.title,
      review: movie.review,
      summary: movie.summary,
      kids: movie.forKids,
      rating: movie.rating,
      triggers: movie.triggers,
      imdblink: movie.imdb,
      wikilink: movie.wiki, 
      trailer: movie.trailer,
    })
  })
    .catch(error => console.error(error))

  })


    app.post("/film", (req, res)=>{
        filmCollection.insertOne(req.body)
        .then(result => {
            console.log(result)        })
            res.redirect("/")
        .catch(error => console.error(error))
    })
   
    app.listen(process.env.PORT || PORT, function() {
        console.log("listening on port 8000")
    })

  })
  .catch(error => console.error(error))



// app.set("view engine", "ejs");
// // app.set("views", "path/to/views")
// app.use(express.static('public'));
// app.use(cors());


// app.post('/admin', (req, res) => {
//   console.log('Hellooooooooooooooooo!')
// })


// app.get('/', (request, response) => {
//   response.render('pages/index.ejs');
//   // response.sendFile(__dirname + '/views/index.ejs')
// })

// // *** GET Routes - display pages ***
// // // Root Route
// app.get('/:name', function(req, res) {
//   let movieName = req.params.name.toLowerCase()
//   console.log("finding your movie: " + movieName)
//   //still can't get random to work in the render template, shows only the name of the film
//   if (movieName === "random") {
//     const randomNum = Math.floor(Math.random() * Object.values(movies).length)
//     movieName = (Object.values(movies)[randomNum]["title"]).toLowerCase()
//   }
       
//     res.render('pages/api', {
//       title: movies[movieName]["title"],
//       review: movies[movieName]["review"],
//       summary: movies[movieName]["summary"],
//       kids: movies[movieName]["for kids"],
//       rating: movies[movieName]["rating"],
//       trigger: movies[movieName]["trigger warnings"],
//       imdblink: movies[movieName]["imdb link"],
//       wikilink: movies[movieName]["wiki link"], 
//       trailer: movies[movieName]["trailer link"],



//     })
//     console.log(movies[movieName]["trailer link"])


  

// });




// app.listen(process.env.PORT || PORT, () => {

//   console.log(`The server is now running on port ${PORT}! Betta Go Catch It!`)
// })

