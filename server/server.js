const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require('body-parser');
require('dotenv').config();
const morgan = require('morgan'); // Import morgan
const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan('dev'));

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.log(err));

// Routes
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.get('*', (req, res)=>{
    res.status(404).json({error: 'not found!'})
})
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});
// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
