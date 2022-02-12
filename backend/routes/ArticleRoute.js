const express = require('express');
const Article = require('../models/Article')
const articleRoute = express.Router();
const { body, validationResult } = require('express-validator');
const verifyToken = require('../middleware/verifyToken');

articleRoute.get('/getArticles',verifyToken, async (req, res) => {
    try {
        let article = await Article.find({user:req.user.id});
        res.send(article);

    } catch (error) {
        return res.status(400).send(error.message)
    }
});
articleRoute.post(
    '/addArticles',verifyToken,
    [body('title', 'Enter your title please'),
    body('author', 'Enter your author name').isLength({ min: 5 }),
    body('details', 'Enter the details please')],
 async (req, res) => {
        // Finds the validation errors in this request and wraps them in an object with handy functions
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        try {
            let article = await Article.create({
                title: req.body.title,
                author: req.body.author,
                details: req.body.details
            });

            res.send(article);

        } catch (error) {
            return res.status(400).send(error.message)
        }
    });
articleRoute.put("/editArticles/:id",verifyToken, async (req, res) => {
    let article = await Article.findById(req.params.id);
    if(!article){
        return res.status(401).send('Article not found');
    }
    try {
        const updatedArticle = await Article.updateOne({ _id: req.params.id },
            {
                $set: 
                {
                     title: req.body.title,
                     author: req.body.author,
                     details: req.body.details,
                }
            }
        );
        res.send(updatedArticle);
    } catch (err) {
        console.log(err);
    }
});
articleRoute.delete('/deleteArticles/:id',verifyToken, async(req, res) => {
    try {
        const deleteArticle = await Article.findByIdAndDelete(req.params.id);
        res.send(deleteArticle);
      } catch (err) {
        console.log(err);
      }
})

module.exports = articleRoute;