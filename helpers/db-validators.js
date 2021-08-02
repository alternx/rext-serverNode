const { Categoria, Role, Usuario, Producto } = require('../models');

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


//existeCategoria
const existeCategoriaPorId = async(id) => {
    const existeCat = await Categoria.findById(id);
    if (!existeCat || !existeCat.estado) {
        throw new Error(`La Categoria con ID: ${id} no existe`);
    }
}

//existeCategoria
const existeCategoriaPorNombre = async(nombre = '') => {

    const categoria = nombre.toLocaleUpperCase();
    const existeCat = await Categoria.findOne({ nombre: categoria });

    if (!existeCat || !existeCat.estado) {
        throw new Error(`La Categoria ${nombre} no existe`);
    }


}

/**
 * 
 * Validar productos 
 */
const existeProductoPorId = async(id) => {
    const existeProd = await Producto.findById(id);
    if (!existeProd || !existeProd.estado) {
        throw new Error(`El producto con ID: ${id} no existe`);
    }
}

/**
 * Validar Colecciones Permitidas
 */

const coleccionesPermitidas = (coleccion = '', colecciones = []) => {

    const incluida = colecciones.includes(coleccion);

    if (!incluida) {
        throw new Error(`La coleccion ${coleccion} no es permitida - ${colecciones}`);
    }

    return true;

}


module.exports = {
    esRoleValido,
    existeEmail,
    existeUsuarioPorId,
    existeCategoriaPorId,
    existeCategoriaPorNombre,
    existeProductoPorId,
    coleccionesPermitidas
}