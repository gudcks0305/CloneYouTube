var express = require('express')
var app = express()
const mongoose = require('mongoose')
//const {user, User} = require('./models/User')
const bodyParser = require('body-parser')
const config = require('./config/key')
const cookieParser = require('cookie-parser')
app.use(bodyParser.urlencoded({extended:true}))
app.use(cookieParser());
app.use(bodyParser.json());
app.use('/uploads', express.static('uploads'));
mongoose.connect(config.mongoURL,{  
    useNewUrlParser : true, useUnifiedTopology: true, useCreateIndex : true, useFindAndModify:false
}).then(() => console.log('MongoDB connect is good'))
   .catch(err => console.log(err))



app.use('/api/users', require('./routes/users'));
app.use('/api/video', require('./routes/video'));

  
 
app.listen(5000,console.log('Node js server is Connected'))