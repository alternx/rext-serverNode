const Role = require('../models/role');
const Usuario = require('../models/usuario');

//Verificar si el rol está en la base de datos de roles
const esRoleValido = async(rol = '') => {
    const existeRol = await Role.findOne({ rol });
    if (!existeRol) {
        throw new Error(`El rol ${rol} no está registrado en la base de datos`);
    }
}

//Verificar si el correo existe
const existeEmail = async(correo = '') => {
    const mail = await Usuario.findOne({ correo });
    if (mail) {
        throw new Error(`El correo: ${correo} ya está registrado en la base de datos`);
    }
}


//Verificar si el ID existe
const existeUsuarioPorId = async(id) => {
    const existeId = await Usuario.findById(id);
    if (!existeId) {
        throw new Error(`El ID: ${id} no existe`);
    }
}




module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId
}