const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
require("dotenv").config();
const morgan = require("morgan"); // Import morgan
const multer = require("multer"); // Import multer
const app = express();
const sequelize = require('./db');
// const { MongoClient, ServerApiVersion } = require('mongodb');
// const uri = "mongodb+srv://jpacs:Jpaks.@cluster0.somakh5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   }
// });
// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log("Pinged your deployment. You successfully connected to MongoDB!");
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }

sequelize.sync({ alter: true })
  .then(() => {
    console.log('Database & tables created!');
  })
  .catch((err) => console.error('Unable to sync the database:', err));
// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(express.urlencoded({ extended: true }));
// Serve static files from the "uploads" directory
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Serve the static files from the React app
app.use(express.static(path.join(__dirname, 'build')));
// MongoDB Connection
// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => console.log("MongoDB connected"))
//   .catch((err) => console.log(err));

// Multer setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "server/uploads/"); // Set your desired upload directory
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "-" + file.originalname); // Naming the uploaded file
  },
});
const upload = multer({ storage: storage });

// Routes
const authRoutes = require("./routes/auth");
const reviewRoutes = require("./routes/reviews");
const articleRoutes = require("./routes/articles"); // No need to pass upload here
const reviewerRoutes = require("./routes/reviewers");
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});
app.get('/api/test', (req, res)=>{
const { MongoClient, ServerApiVersion } = require('mongodb');
const uri = "mongodb+srv://jpacs:Jpaks.@cluster0.somakh5.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
 run((r)=>{
    res.send(r)
}).catch(e=> res.send(e));
})
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes(upload)); // Pass upload here
app.use("/api/reviews", reviewRoutes);
app.use("/api", reviewerRoutes);
app.get("*", (req, res) => {
  res.status(404).json({ error: "not found!" });
});
app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
