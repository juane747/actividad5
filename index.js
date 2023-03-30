


var botontransmitir = document.getElementById('transmitir')
var tablaResultados = document.getElementById('TablaResultados')
var botonGuardar = document.getElementById('guardar')
var botonConsultar = document.getElementById('consultar')

botontransmitir.addEventListener('click',function(){
    tablaResultados.innerHTML = "<thead><tr><th scope=col>No.</th><th scope=col>Codigo</th><th scope=col>Rol</th><th scope=col>Nombre</th><th scope=col>Version</th></tr></thead>"

    var autor= document.getElementById('nombre-autor')
    var usoautor=autor.value
    //alert(usoautor)
    fetch('https://openlibrary.org/search/authors.json?q='+usoautor)
    .then(res=>res.json())
    .then(resJson=>{
        var documentos = resJson['docs']
        botonGuardar.addEventListener('click',function(){
            window.comunicacion.guardarregistro(documentos)
           
        })
        
        for(let i =0; i<documentos.length;i++){
            var obra = documentos[i]
            tablaResultados.innerHTML += "<tr>"+
                                                "<th scope =\"row\">"+i+"</td>"+
                                                "<td>"+obra['key']+"</td>"+
                                                "<td>"+obra['type']+"</td>"+
                                                "<td>"+obra['name']+"</td>"+
                                                "<td>"+obra['_version_']+"</td>"+
                                            "</tr>"
        }
    })
})


botonConsultar.addEventListener('click',function(){
    var autor= document.getElementById('nombre-autor')
    var usoautor=autor.value
    window.comunicacion.buscarregistro(usoautor)
    window.comunicacion.enviarregistro(function(event,args){
        console.log(args);

       var documentos = args
       
       for(let i =0; i<documentos.length;i++){
           var obra = documentos[i].dataValues
           
           tablaResultados.innerHTML += "<tr>"+
                                               "<th scope =\"row\">"+i+"</td>"+
                                               "<td>"+obra['key']+"</td>"+
                                               "<td>"+obra['type']+"</td>"+
                                               "<td>"+obra['name']+"</td>"+
                                               "<td>"+obra['_version_']+"</td>"+
                                           "</tr>"
       }

    })
   
   
     
    
})

