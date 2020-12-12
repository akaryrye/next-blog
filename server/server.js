require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const blogRoutes = require('./routes/blog');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const categoryRoutes = require('./routes/category');
const tagRoutes = require('./routes/tag');
const app = express();

// set up database
mongoose.connect(process.env.DATABASE, {useNewUrlParser: true, useCreateIndex: true, useFindAndModify: false})
.then( () => console.log('database connected')); 

// initialize middleware
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static('public'));

// set up cors
if (!process.env.NODE_ENV === 'development') {
  app.use(cors({origin: `${process.env.CLIENT_URL}` }));
}
app.use(cors());

// routes config
app.use('/api', blogRoutes);
app.use('/api', authRoutes);
app.use('/api', userRoutes);
app.use('/api', categoryRoutes);
app.use('/api', tagRoutes);

// routes
app.get('/api', (req, res) => {
  res.json({time: Date().toString()});
})

// define port
const port = process.env.PORT || 8000;

// start the server
app.listen(port, () => {
  console.log(`api server running on port ${port}`)
})