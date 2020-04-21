const mongoose = require('mongoose');

const recipeSchema = new mongoose.Schema({
    title: String,
    ingredients: String,
    recipe: String,
    url: String,
    img: String
});

module.exports = mongoose.model('Recipe', recipeSchema);