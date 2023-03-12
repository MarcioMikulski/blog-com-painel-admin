const Sequelize = require("sequelize");
const connection = require("../database/database");
const Category = require("../categories/category");

const Article = connection.define('articles', {
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },slug:{
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
    type: Sequelize.TEXT,
    allowNull: false 

    }

})

//2 modelos de criar um relacionamento entre tabelas hasMany e belongsTo
Category.hasMany(Article); // Tem Muitos artigos (1 para muitos)
Article.belongsTo(Category); //Um artigo pertence a uma categoria (1 para 1)


//usado para criar a tabela e que deve ser apagado apos o uso
// Article.sync({force:true});

module.exports = Article;