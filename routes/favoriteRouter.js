const { response } = require('express')
const express = require('express')
const Favorite = require('../Models/favorites')
const authenticate = require('../authenticate')
const favoriteRouter = express.Router()
const cors = require('./cors')

favoriteRouter
  .route('/')
  .options(cors.corsWithOptions, (req, res) => res.sendStatus(200))
  .get(cors.cors, (req, res, next) => {
   Favorite.find({ user: req.user._id })
    .populate('user')
    .populate('campsites')
      .then((favorites) => {
        res.statusCode = 200
        res.setHeader('Content-Type', 'application/json')
        res.json(favorites)
      })
      .catch((err) => next(err))
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
     Favorite.findOne({ user: req.user._id })
       .then((favorite) => {
        if (favorite) {
         req.body.forEach(campsite => {
          if (!favorite.campsites.includes(campsite)) {
           favorite.campsites.push(campsite)
          }
         });
         favorite
           .save()
           .then((favorite) => {
             res.statusCode = 200
             res.setHeader('Content-Type', 'application/json')
             res.json(favorite)
           })
           .catch((err) => next(err))
        } else {
         Favorite.create({ user: req.user._id })
          .then((fav) => {
           req.body.forEach(campsite => {
            if (!fav.campsites.includes(campsite)) {
             favorite.campsites.push(campsite)
            }
           })
           fav
             .save()
             .then((fav) => {
               res.statusCode = 200,
                 res.setHeader('Content-Type', 'application/json')
               res.json(fav)
             })
             .catch((err) => next(err))
         })
        }  
      })
      .catch((err) => next(err))  
   })
 
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
   (req, res, next) => {
    Favorite.findOneAndDelete()
     .then((favorite) => {
      if (favorite) {
       favorite
        .then((response) => {
         if (response) {
           res.setHeader('Content-Type', 'application/json')
           res.json(response)
         } else {
           res.setHeader('Content-Type', 'text/plain')
           res.end('Yo do not have any favorites to delete')
         }
        })
        .catch((err) => next(err))
      }
     })
   }
  )
 
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res) => {
      res.statusCode = 403
      res.end(`PUT operation not supported on /favorites`)
    }
  )

favoriteRouter
  .route('/:campsiteId')
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200)
  })
  .get(cors.cors, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/plain')
    res.end(
      `GET operation not supported on /favorites/${req.params.campsiteId}`
    )
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Campsite.findOne({
      _id: req.params.campsiteId,
    })
      .then((campsite) => {
        if (campsite) {
          Favorite.findOne({
            user: req.user._id,
          }).then((favorite) => {
            if (favorite) {
              if (favorite.campsites.indexOf(req.params.campsiteId) === -1) {
                favorite.campsites.push(req.params.campsiteId)
              } else {
                res.statusCode = 200
                res.setHeader('Content-Type', 'text/plain')
                res.end('That campsite is already in your list of favorites')
              }
              favorite.save().then((fave) => {
                res.statusCode = 200
                res.setHeader('Content-Type', 'application/json')
                res.json(fave)
              })
            } else {
              Favorite.create({
                user: req.user._id,
              }).then((favorite) => {
                favorite.campsites.push(req.params.campsiteId)
                favorite.save().then((fave) => {
                  res.statusCode = 200
                  res.setHeader('Content-Type', 'application/json')
                  res.json(fave)
                })
              })
            }
          })
        } else {
          res.statusCode = 404
          res.setHeader('Content-Type', 'text/plain')
          res.end(`Campsite ${req.params.campsiteId} not found`)
        }
      })
      .catch((err) => next(err))
  })
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res) => {
    res.statusCode = 403
    res.setHeader('Content-Type', 'text/plain')
    res.end(
      `PUT operation not supported on /favorites/${req.params.campsiteId}`
    )
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorite.findOne({
      user: req.user._id,
    })
      .then((favorite) => {
        if (favorite) {
          const index = favorite.campsites.indexOf(req.params.campsiteId)
          if (index === -1) {
            res.statusCode = 200
            res.setHeader('Content-Type', 'text/plain')
            res.end('That campsite is not in your favorites list.')
          } else {
            favorite.campsites.splice(index, 1)
            favorite.save().then((fave) => {
              res.statusCode = 200
              res.setHeader('Content-Type', 'application/json')
              res.json(fave)
            })
          }
        } else {
          res.statusCode = 200
          res.setHeader('Content-Type', 'text/plain')
          res.end('No favorites to delete.')
        }
      })
      .catch((err) => next(err))
  })

module.exports = favoriteRouter
