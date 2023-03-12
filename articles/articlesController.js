const express = require("express");
const router = express.Router();
const Category = require("../categories/category");
const Article = require("./article");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");


router.get("/admin/articles/index", (req,res) => {
    //comando para listar do banco de dados
    Article.findAll({
        include: [{model: Category}]
    }).then(articles => {
        res.render("admin/articles/index", {articles:articles})

    })

});
router.get("/admin/articles/new", adminAuth, (req,res) => {
    Category.findAll().then(categories =>{
        res.render("admin/articles/new", {categories:categories});

    })
});

router.post("/articles/save", (req, res) => {
    var title = req.body.title;
    var body = req.body.body;
    var category = req.body.category;

    Article.create({
        title: title,
        slug: slugify(title),
        body: body,
        categoryId: category

    }).then(() =>{
        res.redirect("/admin/articles/new")

    })


});

router.post("/articles/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(! isNaN(id)){
           Article.destroy({
            where: {
                id:id
            }

           }).then(() => {
            res.redirect("/admin/articles/index");
           });
            
        }else{
            res.redirect("/admin/articles/index");
        }

    }else{
        res.redirect("/admin/articles/index");
    }

});

//a rota busca a categoria pelo id
router.get("/admin/articles/edit/:id", adminAuth, (req, res) => {
    var id = req.params.id;
      //saber se é um numero atraves do isNaN 
    if(isNaN(id)){
          res.redirect("/admin/articles/index");
 
       }
    Article.findByPk(id).then(article => {
       if(article != undefined){
          res.render("admin/articles/edit", {article:article});
 
 
       }else{
          res.redirect("/admin/articles/index");
       }
 
    }).catch(erro =>{
       res.redirect("/admin/articles/index");
 
    })
 
 
 });

 router.post("/articles/update", (req, res) => {
    var id = req.body.id;
    var title = req.body.title;
    var body = req.body.body;
    Article.update({title: title, slug: slugify(title), body: body},{
       where: {
          id: id
       }
 
    }).then(() => {
       res.redirect("/admin/articles/index");
 
    })
 
 }) // ||
 
 router.get("/articles/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;

    if(isNaN(page) || page == 1 ){
        offset = 0;

    }else {
        
        offset = (parseInt(page) -1 )* 4;

    }

    Article.findAndCountAll({
        limit: 4,
        offset: offset,
        order:[['id', 'DESC']]
    }).then(articles => {
        var next;
        if(offset + 4 >= articles.count){
            next = false;

        }else{
            next = true;
        }

        var result = {
            page: parseInt(page),
            next: next,
            articles: articles

        }

        

            Category.findAll().then(categories => {
                res.render("admin/articles/page", {result: result, categories: categories })

            });

       // res.json(result) ;
    })

 });

module.exports = router;