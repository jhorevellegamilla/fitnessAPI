// [SECTION] Dependencies and Modules
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

//Routes Middleware
const workoutRoutes = require("./routes/workout");
const userRoutes = require("./routes/user");

// [SECTION] Environment Setup
require('dotenv').config();

// [SECTION] Server Setup
// const port = 4000;
const app = express();

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);

    if (
      origin.includes("localhost") ||
      origin.endsWith(".vercel.app")
    ) {
      return callback(null, true);
    }

    return callback(new Error("Not allowed by CORS"));
  },
  credentials: true,
  optionsSuccessStatus: 200,
};



app.use(cors(corsOptions));

app.use(express.json());

//[SECTION] Backend Routes 
//http://localhost:4000/users
app.use("/workouts", workoutRoutes);
app.use("/users", userRoutes);

//[SECTION] Database Connection 
//courseBookingAPI - no data
//booking-KT - with data
mongoose.connect(process.env.MONGODB_STRING);

//Database Connection
mongoose.connection.once('open', () => console.log('Now connected to MongoDB Atlas.'));

// [SECTION] Server Gateway Response
if(require.main === module){
	app.listen(process.env.PORT || 4000, () => {
	    console.log(`API is now online on port ${ process.env.PORT || 4000 }`)
	});
}

module.exports = {app,mongoose};