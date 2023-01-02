//seção 7 vamos iniciar na aula 118
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");

const categoriesController = require("./categories/CategoriesController");
const articlesController   = require("./articles/ArticlesController");
const usersController = require("./users/UsersController");

const Article  = require("./articles/Article");
const Category = require("./categories/Category");
const User     = require("./users/User"); 
const { get } = require("./users/UsersController");

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
app.use("/", usersController);

app.get("/",(req, res) =>{
    Article.findAll({
        order:[['id','DESC']],
        limit: 4
    }).then(articles => {
        Category.findAll().then(categories =>{
            res.render("index",{articles: articles, categories: categories});
        })
        
    })
})

app.get("/admin",(regq, res) =>{
    res.render("admin")
})

app.get("/:slug",(req, res)=>{
    var slug = req.params.slug;
    Article.findOne({
        where:{
            slug: slug
        }
    }).then(article =>{
        if(article != undefined){
            Category.findAll().then(categories=>{
                res.render("article",{article: article, categories: categories});
            })
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

app.get("/category/:slug",(req,res)=>{
    var slug = req.params.slug;
    Category.findOne({
        where:{
         slug: slug   
        },
        include:[{model: Article}]
    }).then(category => {
        if (category != undefined){
           Category.findAll().then(categories =>{
            res.render("index",{articles: category.articles, categories: categories});
           });  
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
});

app.listen(3000, ()=>{
    console.log("O servidor está rodando");
})
