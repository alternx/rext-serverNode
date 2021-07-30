const { response, request } = require('express');

const jwt = require('jsonwebtoken');
const Usuario = require('../models/usuario');

const validarJWT = async(req = request, res = response, next) => {

    const token = req.header('x-token');

    if (!token) {
        return res.status(401).json({
            msg: 'No hay token en la petición'
        });
    }

    try {

        //Valida que el token sea válido (creado con la misma llave)
        const { uid } = jwt.verify(token, process.env.SECRETORPRIVATEKEY);

        //Se extrae la información del usuario autenticado
        const usuario = await Usuario.findById(uid);

        if (!usuario) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario no existe en DB'
            });
        }



        //Checar si el usuario no ha sido borrado, sigue con estado true
        if (!usuario.estado) {
            return res.status(401).json({
                msg: 'Token no válido - Usuario con estado: false'
            });
        }

        req.usuario = usuario;

        next();
    } catch (error) {
        console.log(error);
        res.status(401).json({
            msn: 'Token no válido'
        });
    }


}

module.exports = {
    validarJWT
}