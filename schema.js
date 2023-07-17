const mongoose = require("mongoose");

const toDoListSchema = new mongoose.Schema (
    {
        name: String,
    }
)

module.exports = mongoose.model("List", toDoListSchema );