const mongoose = require("mongoose")
require("dotenv").config()


const connectDB = async (DB_URL) => {
    try {
       const conn = await mongoose.connect(DB_URL)
        console.log("Database Connected Successully " + conn.connection.host );
    } catch (error) {
        console.error(error.message)
    }
}

module.exports = connectDB