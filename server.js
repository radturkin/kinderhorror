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

    app.get('/admin', (req, res) => {
      res.render('pages/admin.ejs')
    })

        
    app.get('/', (req, res) => {
          db.collection('kinderhorror').find().toArray()

          .then(results => {

            res.render('pages/index.ejs', {films: results,
              motm: results[22]
            
            })
            console.log(results[22])

                  })
                  .catch(error => console.error(error))

                })

// // // Root Route
    app.get("/:name", function (req, res, next) {
      let movieTitle = req.params.name
      if (movieTitle === "random") {
        db.collection("kinderhorror").find().toArray()
          .then(results => {
            const randomNum = Math.floor(Math.random() * results.length)
            let movie = results[randomNum]
            console.log("User wanted a random film title: " + movie.title)
            res.render('pages/api', { movie: movie
           
            })
          })
          .catch(error => console.error(error))
      }
      db.collection("kinderhorror")
      .find({ title: movieTitle })
      .toArray()
      .then(results => {
        let movie = results[0]
        console.log("User selected " + movie.title)
      
        res.render('pages/api', { movie: movie
        
        })
      })
      .catch(error => console.error(error))
    })

    app.post("/film", (req, res)=>{
        filmCollection.insertOne(req.body)
        .then(result => {
          console.log(result)        
          res.redirect("/")
        })
        
        .catch(error => console.error(error))
    
      })

    app.listen(process.env.PORT || PORT, function() {
        console.log("listening on port 8000")
    })
  })

  .catch(error => console.error(error))



  // 
  

// app.set("view engine", "ejs");
// // app.set("views", "path/to/views")
// app.use(express.static('public'));
// app.use(cors());

// app.listen(process.env.PORT || PORT, () => {

//   console.log(`The server is now running on port ${PORT}! Betta Go Catch It!`)
// })

