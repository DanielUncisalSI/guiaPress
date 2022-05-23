//vamos erro na aula 100 listando artigos na home

const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController   = require("./articles/ArticlesController");

const Article  = require("./articles/Article");
const Category = require("./categories/Category");



//carregar a view engine deve criar uma pasta views
app.set('view engine','ejs');

//arquivos static -- css. js....
app.use(express.static('public'));

//bory-parser
app.use(bodyParser.urlencoded({extended : false}));
app.use(bodyParser.json());

//databse
connection.authenticate()
.then(()=>{
    console.log("Conexão feita com sucesso!");
}).catch((error)=>{
    console.log(error);
})

app.use("/", categoriesController);
app.use("/", articlesController);

app.get("/",(req, res) =>{
    Article.findAll().then(articles => {
        res.render("index",{articles: articles});
    })
})

app.get("/:slug",(req, res)=>{
    var slug = req.params.slug;
    Article.findAll({
        where:{
            slug: slug
        }
    }).then(article =>{
        if(article!= undefined){
            res.render("article",{article: article});
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.listen(8080, ()=>{
    console.log("O servidor está rodando");
})
