require('./config/config');

const express = require('express');
// Using Node.js `require()`
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const bodyParser = require('body-parser');

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

app.use(express.static(path.resolve(__dirname, '../public')));
//console.log(path.resolve(__dirname, '../public'));

//Configuracion global de rutas
app.use(require('./routes/index'));


//await
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true },
    (err, res) => {
        //   useNewUrlParser: true,
        //   useUnifiedTopology: true
        if (err) throw err;

        console.log('Base de datos Online');

    });

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});