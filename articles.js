const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');

//Bring the Article models
let Article = require('../models/article');


//Add Route
router.get('/add', function(req, res){
  res.render('add_article3',{
    title:'Add Articles'
  });
});

// Add Submit POST Route
router.post('/add',
  [
    check('title').isLength({min: 1}).trim().withMessage('Title is required'),
    check('author').isLength({min: 1}).trim().withMessage('Author is required'),
    check('body').isLength({min: 1}).trim().withMessage('Body is required'),
  ],
    (req,res,next)=>{
      let article = new Article({
        title:req.body.title,
        author:req.body.author,
        body:req.body.body
      });

      const errors = validationResult(req);
      if(!errors.isEmpty()){
        console.log(errors);
        res.render('add_article3',{
          article:article,
          errors: errors.mapped()
        });
      }
      else{
        article.title = req.body.title;
        article.author = req.body.author;
        article.body = req.body.body;

        article.save(err=>{
          if(err){
            throw err;
          }else {
            req.flash('success',"Article Added");
            res.redirect('/');
          }
        });
      }
    });


// Load Edit Form
router.get('/edit/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('edit_article',{
      title:'Edit Article',
      article:article
    });
  });
});


// Update Submit POST Route
router.post('/edit/:id', function(req, res){
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let query = {_id:req.params.id}

  Article.update(query, article, function(err){
    if(err){
      console.log(err);
    } else {
      req.flash('success', 'Article Updated');
      res.redirect('/');
    }
  });
});

router.delete('/:id', function(req, res){
  let query = {_id:req.params.id}

  Article.remove(query, function(err){
    if(err){
      console.log(err);
    }
    res.send('Success');
  });
});

//Get Single Article
router.get('/:id', function(req,res){
  Article.findById(req.params.id, function(err, article){
    res.render('article',{
      article:article
    });
  });
});

module.exports = router;
