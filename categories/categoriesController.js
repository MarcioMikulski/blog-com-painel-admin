const express = require("express");
const router = express.Router();
const Category = require("./category");
const slugify = require("slugify");
const adminAuth = require("../middlewares/adminAuth");



router.get("/admin/categories/new", adminAuth, (req, res) => {
   res.render("admin/categories/new");
});

router.get("/admin/categories/index", adminAuth, (req,res) => {
   Category.findAll().then(categories => {
      res.render("admin/categories/index", {categories: categories});
   });


});
   

router.post( "/categories/save", (req, res) => {
   var title = req.body.title;
   if(title){
   
      	Category.create({
       title: title,
         slug: slugify(title)
      }).then(() => {
         res.redirect("../admin/categories/index");

      })

   }else{
	res.redirect("/admin/categories/new");

   }


});


router.post("/categories/delete", (req,res) =>{
   var id = req.body.id;
   if(id != undefined){
      if(! isNaN(id)){

        Category.destroy({
         where: {
            id: id
         }

        }).then(() => {
         res.redirect("/admin/categories/index");
        });
         }else{// se o id nao for numero vai redirecionar
            res.redirect("/admin/categories/index");
         }

   }else{//se o id for nule ira redirecionar
      res.redirect("/admin/categories/index");
   }

});

//a rota busca a categoria pelo id
router.get("/admin/categories/edit/:id", adminAuth, (req, res) => {
   var id = req.params.id;
     //saber se é um numero atraves do isNaN 
   if(isNaN(id)){
         res.redirect("/admin/categories/index");

      }
   Category.findByPk(id).then(category => {
      if(category != undefined){
         res.render("admin/categories/edit", {category:category});


      }else{
         res.redirect("/admin/categories/index");
      }

   }).catch(erro =>{
      res.redirect("/admin/categories/index");

   })


});

router.post("/categories/update", (req, res) => {
   var id = req.body.id;
   var title = req.body.title;
   Category.update({title: title, slug: slugify(title)},{
      where: {
         id: id
      }

   }).then(() => {
      res.redirect("/admin/categories/index");

   })

})

module.exports = router;