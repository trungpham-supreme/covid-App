const mongoose = require('mongoose');
const marked = require('marked');
const slugify = require('slugify');    

// Category Schema
const articleSchema = new mongoose.Schema({
   
    title: {
        type: String,
        required: true
        
    }, 
    description: {
        type: String,
        required: true
    },
    markdown:{
    	type: String,
    	required: true
    },
    createdAt:{
    	type: Date,
    	default: Date.now
    },
    image: {
    	type: String
    },
    slug:{
        type: String,
        required: true,
        unique: true
    }
    
});

articleSchema.pre('validate', function(next) {
  if (this.title) {
    this.slug = slugify(this.title, { lower: true, strict: true })
  }
  next();
});

var article = module.exports = mongoose.model('Article', articleSchema);