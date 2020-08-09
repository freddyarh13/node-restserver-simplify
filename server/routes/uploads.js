const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');


// default options
app.use(fileUpload());

app.put('/upload/:tipo/:id', function(req, res) {

    let tipo = req.params.tipo;
    let id = req.params.id;


    if (!req.files) /*|| Object.keys(req.files).length === 0)*/ {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    //Validar tipo
    let tipoValidos = ['productos', 'usuarios'];

    if (tipoValidos.indexOf(tipo) < 0) {

        return res.status(400).json({
            ok: false,
            err: {
                message: 'Los tipos validos permitidas son ' + tipoValidos.join(', '),
                ext: tipo
            }

        })
    }


    // The name of the input field (i.e. "archivo") is used to retrieve the uploaded file
    let archivo = req.files.archivo;
    let nombreCortado = archivo.name.split('.');
    let [nombre, extension] = nombreCortado; //extension = nombreCortado[nombreCortado.length - 1];
    //console.log(extension);

    //Extenciones permitidas
    let extencionesPermitidas = ['png', 'jpg', 'gif', 'jpeg'];

    if (extencionesPermitidas.indexOf(extension) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extensiones permitidas son ' + extencionesPermitidas.join(', '),
                ext: extension
            }

        })
    }

    //Cambiar nombre al archivo
    let nombreArchivo = `${id}-${new Date().getMilliseconds() }.${extension}`;

    // Use the mv() method to place the file somewhere on your server
    archivo.mv(`uploads/${tipo}/${nombreArchivo}`, (err) => {
        if (err) {

            return res.status(500).json({
                ok: false,
                err
            });
        }

        //Aqui imagen cargada
        if (tipo === 'usuarios') {

            imagenUsuario(id, res, nombreArchivo);
        } else {

            imagenProducto(id, res, nombreArchivo);
        }

    });

});

function imagenUsuario(id, res, nombreArchivo) {
    Usuario.findById(id, (err, usuarioBD) => {
        if (err) {
            borrarArchvo(nombreArchivo, 'usuarios');

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!usuarioBD) {
            borrarArchvo(nombreArchivo, 'usuarios');


            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${usuarioBD.img}`);


        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }

        borrarArchvo(usuarioBD.img, 'usuarios');

        usuarioBD.img = nombreArchivo;
        usuarioBD.save((err, usuarioGuardado) => {
            res.json({
                ok: true,
                usuario: usuarioGuardado,
                img: nombreArchivo
            });
        });


    });
}

function imagenProducto(id, res, nombreArchivo) {

    Producto.findById(id, (err, productoDB) => {
        if (err) {
            borrarArchvo(nombreArchivo, 'productos');

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!productoDB) {
            borrarArchvo(nombreArchivo, 'productos');


            return res.status(500).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            })
        }

        // let pathImagen = path.resolve(__dirname, `../../uploads/usuarios/${productoDB.img}`);


        // if (fs.existsSync(pathImagen)) {
        //     fs.unlinkSync(pathImagen);
        // }

        borrarArchvo(productoDB.img, 'productos');

        productoDB.img = nombreArchivo;
        productoDB.save((err, productoGuardado) => {
            res.json({
                ok: true,
                producto: productoGuardado,
                img: nombreArchivo
            });
        });


    });



}

function borrarArchvo(nombreImagen, tipo) {

    let pathImagen = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImagen}`);


    if (fs.existsSync(pathImagen)) {
        fs.unlinkSync(pathImagen);
    }

}



module.exports = app;