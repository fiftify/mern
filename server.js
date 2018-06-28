const express = require ('express');
const mongoose = require ('mongoose');
const bodyParser = require('body-parser');
const passport = require ('passport');

const users = require ('./routes/api/users');
const profile = require ('./routes/api/profile');
const posts = require ('./routes/api/posts');

const app = express();

//body parser middleware
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//db config
const db = require ('./config/keys').mongoURI;
//connecto to mongoDB
mongoose
    .connect(db)
    .then(() => console.log('our mongo is connected'))
    .catch(err => console.log(err));

//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);
app.set('view engine', 'ejs');
//user Routes
app.use('/api/users', users);
app.use('/api/profile', profile);
app.use('/api/posts', posts);

const port = 8080;

app.listen(port, () => console.log (`Server running on port ${port}`));
