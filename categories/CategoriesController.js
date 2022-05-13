const express  = require("express")
const router   = express.Router()
const Category = require("./Category");
const Slugify   = require("slugify");
const { default: slugify } = require("slugify");

//rota lista categorias
router.get("/admin/categories",(req, res)=>{
    Category.findAll().then(categories => {
        res.render("admin/categories/index",{categories: categories });
    })
    
})

//rota adciona chama form nova categoria
router.get("/admin/categories/new",(req, res)=>{
    res.render("admin/categories/new");
})

//rota salva nova categorias
router.post("/categories/save",(req, res)=>{
    var title = req.body.title;
    if (title != undefined) {

        Category.create({
            title: title,
            slug: slugify(title)
        }).then(()=>{
            res.redirect("/admin/categories");
        });

    }else{
        res.redirect("admin/categories/new");
    }
})

//rota deleta categorias
router.get("/categories/delete/:id",(req, res) => {
    var id = req.params.id;
            Category.destroy({
                where: {
                    id: id
                }
            }).then(() =>{
                res.redirect("/admin/categories");
            }); 
})

//rota chama form edita categorias
router.get("/categories/edit/:id",(req, res)=>{
   Category.findByPk(req.params.id)
   .then(category =>{
    res.render("admin/categories/edit",{category: category});
   })
    
})

//rota faz alteração no banco
router.post("/categories/update/:id",(req, res)=>{
    var title = req.body.title;
    Category.update({title: title, slug: slugify(title)},{
        where: {
            id: req.params.id
        }
    }).then(()=>{
        res.redirect("/admin/categories");
    })
   
})



module.exports = router;