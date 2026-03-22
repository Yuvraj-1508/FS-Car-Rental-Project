const mongoose = require("mongoose")

const visiterSchema = new mongoose.Schema({
    email: { type: String },
}, { timestamps: true });


const visiterModel = mongoose.model("visiter", visiterSchema);

module.exports = visiterModel