const Sequelize  = require("sequelize");
const connection = require("../database/database");
const Category   = require("../categories/Category");

const Article = connection.define('articles',{
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    slug: {
        type: Sequelize.STRING,
        allowNull: false
    },
    body: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})


Category.hasMany(Article); //uma categoria tem muitos artigos relacionamento um pra muitos  HAS= TEM, MANY = MUITOS
Article.belongsTo(Category); //relacionamento um para um belongsTo = pertence

//Article.sync({force: true});

module.exports = Article;

