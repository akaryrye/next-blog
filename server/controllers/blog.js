const Blog = require('../models/blog');
const Category = require('../models/category');
const Tag = require('../models/tag');
const { smartTrim } = require('../helpers/blog');
const { errorHandler } = require('../helpers/dbErrorHandler');
const stripHtml = require('string-strip-html');
const formidable = require('formidable');
const slugify = require('slugify');
const _ = require('lodash');
const fs = require('fs');
const { result } = require('lodash');

exports.create = (req, res) => {
  let form = new formidable.IncomingForm();
  form.keepExtensions = true
  form.parse(req, (err, fields, files) => {
    if (err) {
      return res.status(400).json({
        error: 'Image upload failed'
      });
    }

    const { title, body, categories, tags } = fields;

    if (!title || !title.length) {
      return res.status(400).json({
        error: 'Title is required'
      });
    }
    
    if (!body || body.length < 200) {
      return res.status(400).json({
        error: 'Content must be at least 200 characters'
      });
    }

    if (!categories || categories.length < 1) {
      return res.status(400).json({
        error: 'At least one category required'
      });
    }

    if (!tags || tags.length < 1) {
      return res.status(400).json({
        error: 'At least one tag required'
      });
    }

    let blog = new Blog();
    blog.title = title;
    blog.body = body;
    blog.excerpt = smartTrim(body, 320, ' ', ' ...');
    blog.slug = slugify(title).toLowerCase();
    blog.meta_title = `${title} | ${process.env.APP_NAME}`;
    blog.meta_description = stripHtml(body.substring(0, 160));
    blog.author = req.user._id;
    let categoryArr = categories && categories.split(',');
    let tagsArr = tags && tags.split(',');

    if (files.photo) {
      if (files.photo.size > 10000000) {
        return res.status(400).json({
          error: 'File exceeds maximum image size (1mb)'
        });
      }
      blog.photo.data = fs.readFileSync(files.photo.path);
      blog.photo.contentType = files.photo.type;
    };

    blog.save((err, response) => {  
      if (err) {
        return res.status(400).json({
          error: errorHandler(err) 
        });
      }
      Blog.findByIdAndUpdate(
        response._id, { $push: { categories: categoryArr }}, { new: true }
      ).exec((err, result) => {
        if (err) return res.status(400).json({ error: errorHandler(err) })
        else {
          Blog.findByIdAndUpdate(
            response._id, { $push: { tags: tagsArr }}, { new: true }
          ).exec((err, result) => {
            if (err) return res.status(400).json({ error: errorHandler(err) });
            else  res.json(result);
          });
        }
      });
    });
  });
};
  
  
exports.list = (req, res) => {
  Blog.find({})
  .populate('categories', '_id name slug')
  .populate('tags', '_id name slug')
  .populate('author', '_id name username')
  .select('_id title slug excerpt categories tags author createdAt updatedAt')
  .exec((err, data) => {
    if (err) {
      return res.json({
        error: errorHandler(err)
      });
    }
    res.json(data);
  })
};

exports.listBlogsCategoriesTags = (req, res) => {
  let limit = req.body.limit ? parseInt(req.body.limit) : 10
  let skip = req.body.skip ? parseInt(req.body.skip): 0
  let blogs, categories, tags
  // get the blogs
  Blog.find({})
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('author', '_id name username profile')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .select('_id title slug excerpt categories tags author createdAt updatedAt')
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err)
        });
      }
      blogs = data;
      // get the categories
      Category.find({}).exec((err, c) => {
        if (err) {
          return res.json({
            error: errorHandler(err)
          });
        }
        categories = c;
        // get the tags
        Tag.find({}).exec((err, t) => {
          if(err) {
            return res.json({
              error: errorHandler(err)
            });
          }
          tags = t;
          // return all the blogs, categories, and tags
          res.json({ blogs, categories, tags, blogCount: blogs.length })
        });
      });
    });
};

exports.read = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug })
    .populate('categories', '_id name slug')
    .populate('tags', '_id name slug')
    .populate('author', '_id name username')
    .select('_id title body slug meta_title meta_descripton categories tags author createdAt updatedAt')
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err)
        });
      }
      res.json(data);
    });
};

exports.remove = (req, res) => {
  const slug = req.params.slug.toLowerCase();
  Blog.findOneAndDelete({ slug })
    .exec((err, data) => {
      if (err) {
        return res.json({
          error: errorHandler(err)
        });
      }
      res.json({
        message: 'Blog deleted successfully'
      })
    });
}


exports.update = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug }).exec((err, oldBlog) => {
    if (err) {
      return res.status(400).json({
        error: errorHandler(err)
      });
    }

    let form = new formidable.IncomingForm();
    form.keepExtensions = true
    
    form.parse(req, (err, fields, files) => {
      if (err) {
        return res.status(400).json({
          error: 'Image upload failed'
        });
      }

      let oldSlug = oldBlog.slug;
      oldBlog = _.merge(oldBlog, fields);
      oldBlog.slug = oldSlug;

      const { body, desc, categories, tags } = fields;

      if (body) {
        oldBlog.excerpt = smartTrim(body, 320, ' ', ' ...');
        oldBlog.desc = stripHtml(body.substring(0, 160));
      }
      
      if (categories) {
        oldBlog.categories = categories.split(',');
      }

      if (tags) {
        oldBlog.tags = tags.split(',');
      }

      if (files.photo) {
        if (files.photo.size > 10000000) {
          return res.status(400).json({
            error: 'File exceeds maximum image size (1mb)'
          });
        }
        oldBlog.photo.data = fs.readFileSync(files.photo.path);
        oldBlog.photo.contentType = files.photo.type;
      };

      oldBlog.save((err, response) => {  
        if (err) {
          return res.status(400).json({
            error: errorHandler(err) 
          });
        }
        res.json(response);
      });

    });
  });

};

exports.photo = (req, res) => {
  const slug = req.params.slug.toLowerCase();

  Blog.findOne({ slug })
    .select('photo')
    .exec((err, data) => {
      if (err) {
        return res.status(400).json({
          error: errorHandler(err)
        });
      }
      res.set('Content-Type', data.photo.contentType);
      return res.send(data.photo.data);
    });
};
