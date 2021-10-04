const express = require('express');
const app= express()
const expressLayouts= require('express-ejs-layouts')
const indexRouter= require("./routes/index")
require('dotenv').config()

// pre-requisites
app.set('view engine','ejs')
app.set('views',__dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))

//mongoose
const mongoose = require('mongoose');
mongoose.connect(process.env.DATABASE_URL,{useNewUrlParser:true,useUnifiedTopology: true})
const db= mongoose.connection
db.on('error', error=>console.error(error))
db.once('open',()=>console.log("database connected"))




//routes
app.use('/',indexRouter)



app.listen(process.env.PORT || 3000)