const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const feedRoutes = require('./routes/feed');

const app = express();
const fileStorage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images');
    },
    filename: function(req, file, cb) {
        cb(null, uuidv4())
    }
});
const fileFilter = (req, file, cb)=>{
    if(['image/png','image/jpg','image/jpeg'].includes(file.mimetype)){
        cb(null, true);
    }else{
        cb(null, false);
    }
}
app.use(bodyParser.json());
app.use(
    multer({storage: fileStorage, fileFilter: fileFilter}).single('image')
    );
app.use('/images', express.static(path.join(__dirname,'images')));
app.use((req, res, nxt)=>{
    res.setHeader('Access-Control-Allow-Origin','*');
    res.setHeader('Access-Control-Allow-Methods','GET, PUT, POST, DELETE, PATCH');
    res.setHeader('Access-Control-Allow-Headers','Content-Type, Authorization');
    nxt();
});

app.use('/feed',feedRoutes);
app.use((error,req, res, next)=>{
    console.log(error);
    const {status, message} = error;
    res.status(status).json({message: message});
})
mongoose.connect('mongodb+srv://root:root@cluster0.vnrailt.mongodb.net/messages?retryWrites=true&w=majority')
.then(result=>{
    app.listen(4000);
})
.catch(err=>console.log(err))
