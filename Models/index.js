const mongoose = require('mongoose')
const Campsite = require('./models/campsite')

//Part 1
// const url = 'mongodb://localhost:27017/nucampsite'
// const connect = mongoose.connect(url, {
//   useCreateIndex: true,
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// })

//Part 1
// connect.then(() => {
//   console.log('Connected correctly to server')

//   const newCampsite = new Campsite({
//     name: 'React Lake Campground',
//     description: 'test',
//   })

//   newCampsite
//     .save()
//     .then((campsite) => {
//       console.log(campsite)
//       return Campsite.find()
//     })
//     .then((campsites) => {
//       console.log(campsites)
//       return Campsite.deleteMany()
//     })
//     .then(() => {
//       return mongoose.connection.close()
//     })
//     .catch((err) => {
//       console.log(err)
//       mongoose.connection.close()
//     })
// })

//Part 2
// connect.then(() => {
//   console.log('Connected correctly to server')

//   Campsite.create({
//     name: 'React Lake Campground',
//     description: 'test',
//   })
//     .then((campsite) => {
//       console.log(campsite)
//       return Campsite.find()
//     })
//     .then((campsites) => {
//       console.log(campsites)
//       return Campsite.deleteMany()
//     })
//     .then(() => {
//       return mongoose.connection.close()
//     })
//     .catch((err) => {
//       console.log(err)
//       mongoose.connection.close()
//     })
// })

//Part 3
const connect = mongoose.connect(url, {
  useCreateIndex: true,
  useFindAndModify: false,
  useNewUrlParser: true,
  useUnifiedTopology: true,
})

connect.then(() => {
 console.log('Connected correctly to server')

 Campsite.create({
  name: 'React Lake Campground',
  description: 'test',
 })
  .then((campsite) => {
   console.log(campsite)

   return Campsite.findByIdAndUpdate(
    campsite._id,
    {
     $set: { description: 'Updated Test Document' },
    },
    {
     new: true,
    }
   )
  })
  .then((campsite) => {
   console.log(campsite)

   campsite.comments.push({
    rating: 5,
    text: 'What a magnificent view!',
    author: 'Tinus Lorvaldes',
   })

   return campsite.save()
  })
  .then((campsite) => {
   console.log(campsite)
   return Campsite.deleteMany()
  })
  .then(() => {
   return mongoose.connection.close()
  })
  .catch((err) => {
   console.log(err)
   mongoose.connection.close()
  })
});