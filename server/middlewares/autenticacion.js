const jwt = require('jsonwebtoken');

// ================================
// Verificar Token
// ================================
let verificaToken = (req, res, next) => {

    let token = req.get('token');
    // console.log(token);

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {

            return res.status(401).json({
                ok: false,
                err: 'Token no valido'
            });
        }
        req.usuario = decoded.usuario;
        next();

    });


    //console.log(token);
    // res.json({
    //     token
    // });

};

// ================================
// Verificar AdminRole
// ================================

let verificaAdmin_Role = (req, res, next) => {

    let usuario = req.usuario;
    if (!usuario.role === 'ADMIN_ROLE') {

        res.json({
            ok: false,
            err: {
                message: 'El ususario no es administrador'
            }
        });
    }
    next();
};

module.exports = {
    verificaToken,
    verificaAdmin_Role
}