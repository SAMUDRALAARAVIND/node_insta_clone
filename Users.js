const mongoose = require("mongoose")
const Users = mongoose.Schema({
    name: {
        type: String
    },
    location: {
        type: String,
    },
    description: {
        type: String
    },
    file_name: {
        type: String
    },
    date: {
        type: Date,
        default: new Date()
    }
})

module.exports = mongoose.model("SindhantsUsers", Users)