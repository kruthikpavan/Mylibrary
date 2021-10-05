const express = require('express');
const app= express()
const expressLayouts= require('express-ejs-layouts')
require('dotenv').config()

// pre-requisites
app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(express.json())
app.use(express.urlencoded({ extended: true}));
//mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology: true})
const db= mongoose.connection
db.on('error', error=>console.error(error))
db.once('open',()=>console.log("database connected"))




//routes
const indexRouter= require("./routes/index")
const authorRouter= require("./routes/authors")

app.use('/',indexRouter)
app.use('/authors',authorRouter)


app.listen(process.env.PORT || 3000)