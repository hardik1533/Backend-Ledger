const mongoose = require('mongoose');


async function connectDB(){
    
        await mongoose.connect(process.env.MONGO_URI)
        .then(() => {
            console.log("Database Connected to Server");
        })
        .catch( err => {
            console.log("Error connecting to DB.");
            process.exit(1);
        })
}

module.exports = {connectDB}