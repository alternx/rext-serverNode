const { response } = require("express");
const { Categoria, Usuario } = require("../models");


//obtenerCategorias - paginado - total - populate
const obtenerCategorias = async(req, res = response) => {

    const { limite = 5, desde = 0 } = req.query;
    const query = { estado: true };

    const [total, categorias] = await Promise.all([
        Categoria.countDocuments(query),
        Categoria.find(query)
        .populate('usuario', 'nombre')
        .skip(Number(desde))
        .limit(Number(limite))
    ]);

    //await Usuario.populate(categorias, { path: "usuario" });

    res.json({
        total,
        categorias,
    });


}


//obtenerCategoria - populate {}
const obtenerCategoria = async(req, res = response) => {
    const { id } = req.params;
    const categoria = await Categoria.findById(id).populate('usuario', 'nombre');

    //await Usuario.populate(categoria, { path: "usuario" });

    res.json(categoria);


}



const crearCategoria = async(req, res = response) => {

    const nombre = req.body.nombre.toUpperCase();

    const categoriaDB = await Categoria.findOne({ nombre });

    if (categoriaDB) {
        return res.status(400).json({
            msg: `La categoria ${categoriaDB.nombre} ya existe`
        });
    }

    //Generar la data a guardar
    const data = {
        nombre,
        usuario: req.usuario._id
    }

    const categoria = new Categoria(data);

    //Guardar en DB
    await categoria.save();

    res.status(201).json(categoria);

}


//actualizarCategoria
const actualizarCategoria = async(req, res = response) => {

    const { id } = req.params;
    const { nombre } = req.body;

    const data = {
        nombre: nombre.toUpperCase(),
        usuario: req.usuario._id
    };

    const categoriaDB = await Categoria.findByIdAndUpdate(id, data, { new: true });


    res.json(categoriaDB);

}

//borrarCategoria - estado: false
const borrarCategoria = async(req, res = response) => {
    const { id } = req.params;

    //Borrar físicamente
    //const usuario = await Usuario.findByIdAndDelete(id);

    const categoria = await Categoria.findByIdAndUpdate(id, { estado: false, usuario: req.usuario._id }, { new: true });

    res.json(categoria);
}


module.exports = {
    crearCategoria,
    obtenerCategorias,
    obtenerCategoria,
    actualizarCategoria,
    borrarCategoria
}