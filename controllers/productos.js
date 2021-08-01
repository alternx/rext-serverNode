 const { response } = require("express");
 const { Categoria, Usuario, Producto } = require("../models");


 //obtenerProductos - paginado - total - populate
 const obtenerProductos = async(req, res = response) => {

     const { limite = 5, desde = 0 } = req.query;
     const query = { estado: true };

     const [total, productos] = await Promise.all([
         Producto.countDocuments(query),
         Producto.find(query)
         .populate('usuario', 'nombre')
         .populate('categoria', 'nombre')
         .skip(Number(desde))
         .limit(Number(limite))
     ]);

     //await Usuario.populate(categorias, { path: "usuario" });

     res.json({
         total,
         productos,
     });


 }


 //obtenerProducto - populate {}
 const obtenerProducto = async(req, res = response) => {
     const { id } = req.params;
     const producto = await Producto.findById(id)
         .populate('usuario', 'nombre')
         .populate('categoria', 'nombre');

     //await Usuario.populate(categoria, { path: "usuario" });

     res.json(producto);


 }



 const crearProducto = async(req, res = response) => {

     const nombre = req.body.nombre.toUpperCase();

     const productoDB = await Producto.findOne({ nombre });

     //Se checa si no existe ya un producto con el mismo nombre
     if (productoDB) {
         return res.status(400).json({
             msg: `El producto ${productoDB.nombre} ya existe`
         });
     }

     nomcat = req.body.categoria.toUpperCase();

     const cat = await Categoria.findOne({ nombre: nomcat });

     console.log(nomcat);
     console.log(cat);
     const { precio, descripcion, disponible } = req.body;

     const pr = Number.parseInt(precio);

     //Generar la data a guardar
     let data = {
         nombre,
         usuario: req.usuario._id,
         precio: (pr) ? pr : 0,
         categoria: cat._id,
         descripcion,
         disponible,
     }

     const producto = new Producto(data);

     //Guardar en DB
     await producto.save();

     res.status(201).json(producto);

 }


 //actualizarProducto
 const actualizarProducto = async(req, res = response) => {

     const { id } = req.params;
     const { _id, __v, estado, usuario, ...data } = req.body;

     //Si se envió el nombre se convierte a mayúsculas
     if (data.nombre) {
         data.nombre = data.nombre.toUpperCase();
     }

     //Se asigna el usuario con el que "inicio sesión" o sea el del token que envió   
     data.usuario = req.usuario._id;

     //Se checa si el precio que se envió cumple con el formato de número
     //Si no entonces se elimina de los datos a grabar

     if (isNaN(Number.parseInt(data.precio))) {
         delete data.precio;
     }

     //Se checa si se envió la categoría (por nombre)
     if (data.categoria) {

         //En caso de que se haya enviado se checa si se trata de una categoría existente
         try {
             const existeCat = await Categoria.findOne({ nombre: data.categoria.toUpperCase() });
             if (!existeCat || !existeCat.estado) {
                 throw new Error('');
             }
             //Si la categoria existe no se lanza el error y serecupera su id
             data.categoria = existeCat._id;
         } catch (error) {
             //Si la categoría que se envió no existe, se lanza una excepcion y
             //se elimina del objeto a grabar         
             delete data.categoria;
         }

     }



     const productoDB = await Producto.findByIdAndUpdate(id, data, { new: true });


     res.json(productoDB);

 }

 //borrarProducto - estado: false
 const borrarProducto = async(req, res = response) => {
     const { id } = req.params;

     //Borrar físicamente
     //const usuario = await Usuario.findByIdAndDelete(id);

     const producto = await Producto.findByIdAndUpdate(id, { estado: false, usuario: req.usuario._id }, { new: true });

     res.json(producto);
 }


 module.exports = {
     crearProducto,
     obtenerProductos,
     obtenerProducto,
     actualizarProducto,
     borrarProducto
 }