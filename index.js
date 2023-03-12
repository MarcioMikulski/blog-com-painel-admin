const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const connection = require("./database/database");
const categoriesController = require("./categories/categoriesController");
const articlesController = require("./articles/articlesController");
const Article = require("./articles/article");
const Category = require("./categories/category");
const usersController = require("./users/usersController");
const User = require("./users/user");

//View engine
app.set('view engine', 'ejs');

//Sessions
app.use(session({
    secret: "ervbeuiohuio", cookie: {maxAge: 30000000}
}));


//Static
app.use(express.static('public'));

//body-parser
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Database
connection
.authenticate()
.then(() => {
    console.log("successfully connected!!!");
})
.catch((error) => {
    console.log(error);
})

app.use("/", categoriesController);
app.use("/", articlesController);
app.use("/", usersController);

app.get("/session", (req, res) => {
    req.session.email = ("mugemikulski@gmail.com"),
    req.session.nome = ("Marcio Mikulski"),
    req.session.idade = 38

    res.send("Sessão gerada");
});

app.get("/leitura", (req, res) => {
    res.json({
      email:  req.session.email,
      nome:   req.session.nome,
      idade:  req.session.idade
    })

});

app.get("/", (req, res) => {
    Article.findAll({
        order:[['id', 'DESC']],
        limit: 4
    }).then(articles => {

        Category.findAll().then(categories => {
            res.render("index", {articles: articles, categories: categories});
        });

    });

})

app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Article.findOne({
        where: {
            slug : slug
        }
        

    }).then(article => {
        if(article != undefined){
            Category.findAll().then(categories => {
                res.render("article", {article: article, categories: categories});
            });
        }else{
            res.redirect("/");
        }
    }).catch( err => {
        res.redirect("/");
    });


})


app.get("/category/:slug", (req, res) => {
    var slug = req.params.slug;
    Category.findOne({
        where: {
            slug : slug
        },
        include:[{model: Article}]
    }).then( category => {
        if(category != undefined){

            Category.findAll().then(categories => {
                res.render("index", {articles: category.articles, categories: categories });

            });




        }else{
            res.render("/");
        }
    }).catch( err =>{
        res.redirect("/")
    });


})



app.listen(8080, () => {console.log("O servido esta rodando")})