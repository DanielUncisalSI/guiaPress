
   function confirmaDelecao(event){
        var decisao = false;
        decisao = confirm("Deseja realmente excluir este registro ?");
        console.log(decisao);
        if (decisao == false){
            event.preventDefault();
        }
    }
