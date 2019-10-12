const express = require('express')
const bodyParser = require('body-parser')
const app = express()
const cors = require('cors')

const Recipe = require('../models/recipe')
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://user1:z74bL1tlcKYHfoUv@cluster0-sksfb.mongodb.net/test?retryWrites=true&w=majority',{useNewUrlParser: true, useUnifiedTopology: true})
.then(() => console.log('connectecd to db successfully!'))
.catch(err => console.log('error connecting dc ' + err))


app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
  });
app.use(cors())
app.use(bodyParser.json())

app.get('/api/recipes', (req, res) => {
    Recipe.find()
    .then(recipes => res.status(200).json(recipes))
    .catch(error => {res.status(400).json({error})})
})


app.post('/api/recipes', (req, res) => {
    const { title, ingredients, instructions, time, difficulty } = req.body
    console.log(req.body)
    const recipe = new Recipe ({ title, ingredients, instructions, time, difficulty })
    recipe.save()
    .then(() => res.status(201).json({message: 'Post saved successfully'}))
    .catch(error => res.status(400).json({ error }))
})

app.get('/api/recipes/:id', (req,res) => {
    Recipe.findOne({ _id: req.params.id })
    .then(recipe => { res.status(200).json(recipe) })
    .catch(error => { res.status(404).json({error})})
})

app.put('/api/recipes/:id', (req, res) => {
    const _id = req.params.id
    const { title, ingredients, instructions, time, difficulty } = req.body
    const recipe = new Recipe({ _id, title, ingredients, instructions, time, difficulty })
    Recipe.updateOne({ _id: req.params.id }, recipe)
    .then(() => res.status(201).json({message: 'Updated recipe successfully'}))
    .catch(error => res.status(400).json({error}))
})

app.delete('/api/recipes/:id', (req,res) => {
    Recipe.deleteOne({_id: req.params.id})
    .then(() => res.status(200).json({message: 'Deleted Successfully!'}))
    .catch(() => res.status(400).json({message: 'Deletion failed'}))
})

app.use((req, res) => {
    console.log('message sent')
})

module.exports = app