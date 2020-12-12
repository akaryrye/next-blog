const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema;

const blogSchema = mongoose.Schema(
  {
    title: {
      type: String,
      trim: true,
      min: 3,
      max: 160,
      required: true
    },
    slug: {
      type: String,
      unique: true,
      index: true
    },
    body: {
      type: {},
      min: 200,
      max: 2000000,
      required: true
    },
    excerpt: {
      type: String,
      max: 1000
    },
    meta_title: {
      type: String
    },
    meta_description: {
      type: {}
    },
    photo: {
      data: Buffer,
      contentType: String
    },
    categories: [{
      type: ObjectId,
      ref: 'Category',
      required: true
    }],
    tags: [{
      type: ObjectId,
      ref: 'Tag',
      required: true
    }],
    author: [{
      type: ObjectId,
      ref: 'User'
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model('Blog', blogSchema);