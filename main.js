const{app, BrowserWindow,ipcMain}=require('electron');
const path= require('path')
const mysql = require('mysql2')

//Conectar squelize para la base de datos
const {Sequelize, DataTypes}=require('sequelize');

//conexion a base de datos
const sequelize=new Sequelize('bibliografia','root','THE PERFECT',{
    host:'localhost',
    dialect:'mysql'
});
//creacion de inicio sesion
const Nombre=sequelize.define('Nombre',{
    //Aqui definimos los atributos del modelo autor
    id:{
        type: DataTypes.INTEGER,
        allowNull: false,
     // allowNull:false si no se coloca, permite ver si es requerido o no
        primaryKey: true,
        autoIncrement: true,
    },
    codigo:{
        type: DataTypes.STRING,       
    },
    rol:{
        type: DataTypes.STRING
    },
    nombre:{
        type: DataTypes.STRING
    },
    version:{
        type: DataTypes.STRING
    },
    fecha:{
        type: DataTypes.DATE
    }
},{
    //otras opciones del modelo aqui  timestamps, la ultima vez que modifico si la tabla no lo lleva hay que deshabilitar
    timestamps: false  
});

//evaluacion de la conexion correcta
sequelize.authenticate()
.then(()=>{
    console.log('coneccion correcta');
})
.catch((error)=>{
    console.error('Error de conexion',error);
})
function createWindow(){
    const venta = new BrowserWindow({
        width:1500,
        heigth:800,
        webPreferences:{//nos permite accede a funciones nod, en este caso para interface de comunicacion
            preload: path.join(app.getAppPath(),'preload.js')
        },
    })
    venta.loadFile('index.html')
}

ipcMain.on("guardarregistro",function(event,args){
    for(let i =0; i<args.length;i++){
        var arreglo = args[i]
        Nombre.create({
            codigo:arreglo['key'],
            rol:arreglo['type'],
            nombre:arreglo['name'],
            version:" "+arreglo['_version_']+"",
            fecha:Date.now()
           })
    }
   
})

ipcMain.on('buscarregistro',function(event,args){//aca se reciben los datos de preload y se ejecuta metodo seleccionado
    console.log(args)
    
   // verificacion del registro
    Nombre.findAll({
        where:{
            nombre:args
        }
    })
    .then((results, fields)=>{//con esto indicamos que si existe un registro valido
       var registros=results
        console.log(registros)
        venta.webContents.send('enviarregistro',registros)
      
        })
        
})

app.whenReady().then(createWindow)