const express = require("express");
const router = express.Router(); 
const Category = require("../categories/Category");
const Article = require("./Article");
const slugify  = require("slugify");

router.get("/admin/articles",(req, res)=>{
    Article.findAll({include: Category})
   .then(articles =>{
    res.render("admin/articles/index",{articles: articles});
   })
})

router.get("/admin/articles/new",(req, res)=>{
    Category.findAll().then(categories =>{
        res.render("admin/articles/new",{categories: categories});
    })
    
})


//lembrar de alterar o time no arquivo de banco de dados
router.post("/articles/save",(req, res)=>{
    var title = req.body.title;
    var slug  = slugify(title);
    var body  = req.body.body;
    var categoryId = req.body.category;

    Article.create({
        title: title,
        slug: slug,
        body: body,
        categoryId: categoryId
    }).then(()=>{
        res.redirect("/admin/articles");
    })  
})

router.get("/articles/delete/:id",(req, res)=>{
    var id = req.params.id;
    Article.destroy({
        where: {
            id:id
        }
    }).then(()=>{
        res.redirect("/admin/articles");
    })
});


router.get("/admin/articles/edit/:id",(req, res)=>{
   var id = req.params.id;
   //aqui está buscando um artigo pelo id e guardando na variavel article que poderia ser qualquer nome
   Article.findByPk(id).then(article => {
    if(article != undefined){
       Category.findAll().then(categories =>{
        res.render("admin/articles/edit", {categories : categories, article: article}) 
       }) 
       
    }else{
        res.redirect("/")  
    }

   }).catch(err => {
        res.redirect("/")
   })
});

module.exports = router;
