const { jsPDF } = require("jspdf");

const { Router } = require('express');
const router = Router();
const {exec} = require("child_process");
const mysqlConnection= require('../database');  
const nodemailer = require("nodemailer");
const { contentType } = require("express/lib/response");



router.post('/pdf', (req,res) => {
    const doc = new jsPDF();
    const tiempoTranscurrido = Date.now();
    const hoy = new Date(tiempoTranscurrido);
    var aux = "", total =0, iva = 0, neto=0, envio=0;
    console.log(hoy.toLocaleDateString());

    aux = hoy.toLocaleDateString(); ;
    aux +=  "\n" + "\n" +"Factura de venta"+ "\n" + "\n";
    aux += "Tus productos: "+ "\n"+ "\n";
       
   

    for (let i = 1; i <=Object.keys(req.body).length; i++) {
        aux += "Producto: " + req.body[i].producto + " - "+ " Cantidad: " +" - "+ req.body[i].cantidad + " - "+ " Precio: " +req.body[i].precio + "\n";
        total += parseInt(req.body[i].precio,10);
    }
    

    iva=(total*0.19);
    neto = total - iva;
    if(total < 100000){
        envio = 10000;
        total +=envio;
    }

    aux += "\n" +"Su pedido llegará en: " + "27/04/2022" + "\n";
    aux += "El subtotal a pagar es de: " + neto + "\n";
    aux += "Su precio del IVA a pagar es de: " + iva + "\n";
    aux += "Su precio del envio es de: " + envio + "\n";
    aux += "Su precio total a pagar es de: " + total + "\n";
 


    doc.text(aux, 10,10);
    doc.save("factura.pdf");
     // will save the file in the current working directory

});


router.get('/consultarRepos', (req,res) => {
    mysqlConnection.query('select * from productos.productostotales;', (err,rows,fields) =>{
    if(!err){ 
       res.json(rows);
    }
    else{
         console.log(err);
        }
    })
});


router.get('/login/:id',(req, res)=>{

    const {id}=req.params;
    
    mysqlConnection.query('select * from personas where correo = ? ',[id],(err,rows, fields)=>{
        if(!err){ 
            res.json(rows);
        }
        else{
            console.log(err);
        } 
        console.log(rows);
    });
})


router.post('/register',async (req, res)=>{

    const name = req.body.name;
    const lastName = req.body.lastName;
    const phone = req.body.phone;
    const email = req.body.email;
    const password = req.body.password;
    const rol = req.body.rol;
    
    mysqlConnection.query('INSERT INTO personas SET ?', {nombres:name , apellidos:lastName , telefono:phone , correo:email ,contrasena: password, rol:rol}, async (error, results)=>{
        if(error){
            console.log(error);
        }else{
            console.log("Registro exitoso");
        }
    });
})


router.get('/enviarCorreo',async (req, res)=>{

    let testAccount = await nodemailer.createTestAccount();
    
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'cristiancamiloduarte1502@gmail.com', // generated ethereal user
          pass: 'kjjaluhzgnbkngen', // generated ethereal password
        },
      });

      let info = await transporter.sendMail({
        from: 'cristiancamiloduarte1502@gmail.com"', // sender address
        to: "cristiancamiloduarte1502@gmail.com", // list of receivers
        subject: "Factura de venta", // Subject line
        text: "Buen día, adjuntamos tu factura, espero lo disfrutes!", // plain text body
        attachments:[
            {
                filename: 'factura.pdf',
                path: 'C:/Users/Cristian Duarte/Documents/Universidad/Semestre IX/WEB/BACK DEL PARCIAL 2 CORTE/factura.pdf',
                contentType: 'application/pdf'
            }
        ],
        html: "<b>Buen día, adjuntamos tu factura, espero lo disfrutes!</b>", // html body
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
})


router.post('/enviarCorreoRegistro',async (req, res)=>{

    let testAccount = await nodemailer.createTestAccount();
    
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true, // true for 465, false for other ports
        auth: {
          user: 'cristiancamiloduarte1502@gmail.com', // generated ethereal user
          pass: 'kjjaluhzgnbkngen', // generated ethereal password
        },
      });

      let correo = req.body.email;
      let password = req.body.password;

      let info = await transporter.sendMail({
        from: 'cristiancamiloduarte1502@gmail.com', // sender address
        to: req.body.email, // list of receivers
        subject: "Registro exitoso", // Subject line
        text: "", // plain text body
        html: "<b>Buen día, adjuntamos tu usuario y contrseña de nuestra tienda virtual"+ "\n" +"User:" +correo + "\n" +"Contraseña:" +password+"</b>", // html body
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
})


module.exports = router;
