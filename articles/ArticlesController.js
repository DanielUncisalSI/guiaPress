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

//rota pra preencher o formulario de ediçaõ de artigos
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


//rota faz alteração no banco
//esta rota usou a opção de buscar o id de um input escondido do formulario, mas podemos usar a mesma forma da rota de exclusão
router.post("/articles/update", (req, res) => {
    //req.body pega o nome do elemento e não o ID
    var id = req.body.id;
    var title =  req.body.title;
    var body = req.body.body;
    var category = req.body.category;
    
    Article.update({ title: title, body: body, categoryId: category, slug: slugify(title)}, {
        where: {
            id: id
        }
        //.then = se houver sucesso
    }).then(() => {
        res.redirect("/admin/articles");
    }).catch(err => {
        res.redirect("/");  
    });
});

router.get("/articles/page/:num",(req, res)=>{
    var page = req.params.num;
    var offset = 0;

    //isNaN verifica se foi passado um numero no paramentro pagina
    if(isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = parseInt(page) * 4;
    }
    //metodo findAndCountAll retorna count e
    Article.findAndCountAll({
        //limite = limitar o numero de registro por pagina
        limit: 4,
        //offset = a partir de qual registro começa a exibição
        offset: offset,
        order:[['id','DESC']],
    }).then( articles =>{

        var next;
        if(offset + 4 >= articles.count){
            next = false;
        }else{
            next = true;
        }

        var result = {
            next: next,
            articles: articles,
        }

        Category.findAll().then(categories => {
            res.render("admin/articles/page",{result: result, categories: categories})
        });
       
    })
})

module.exports = router;
