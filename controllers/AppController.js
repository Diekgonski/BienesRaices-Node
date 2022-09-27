import { Sequelize } from 'sequelize'
import { Propiedad, Precio, Categoria } from '../models/index.js'

const inicio = async (req, res) => {

    const [categorias, precios, casas, departamentos] = await Promise.all([
        Categoria.findAll({
            raw: true
        }),
        Precio.findAll({
            raw: true
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                CategoriaId: 1
            },
            include: [
                {
                    model: Precio,
                    as: 'precio'
                } 
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        }),
        Propiedad.findAll({
            limit: 3,
            where: {
                CategoriaId: 2
            },
            include: [
                {
                    model: Precio,
                    as: 'precio'
                } 
            ],
            order: [
                ['createdAt', 'DESC']
            ]
        })
    ]);

    res.render('inicio', {
        pagina: 'Inicio',
        precios: precios,
        categorias: categorias,
        casas: casas,
        departamentos: departamentos,
        csrfToken: req.csrfToken()
    })
}

const categoria = async (req, res) => {
    const { id } = req.params;

    //Comprobar que la categoria existe
    const categoria = await Categoria.findByPk(id);

    if(!categoria){
        return res.redirect('/404');
    }

    //Obtener las propiedades de la categoria
    const propiedades = await Propiedad.findAll({
        where: {
            CategoriaId: id
        },
        include: [
            {
                model: Precio,
                as: 'precio'
            }
        ]
    });

    res.render('categoria', {
        pagina: `${categoria.nombre}s en Venta`,
        propiedades: propiedades,
        csrfToken: req.csrfToken()
    })
}

const noEncontrado = (req, res) => {
    res.render('404', {
        pagina: 'Pagina No Encontrada',
        csrfToken: req.csrfToken()
    });
}

const buscador = async (req, res) => {
    const { termino } = req.body;

    //Validar que el termino no este vacío 
    if(!termino.trim()){
        return res.redirect('back')
    }

    // Consultar las propiedades
    const propiedades = await Propiedad.findAll({
        where: {
            titulo: {
                [Sequelize.Op.like] : '%' + termino + '%'
            }
        },
        include: [
            {
                model: Precio,
                as: 'precio'
            }
        ]
    })

    res.render('busqueda', {
        pagina: 'Resultados de la busqueda',
        propiedades: propiedades,
        csrfToken: req.csrfToken()
    })
}

export {
    inicio,
    categoria,
    noEncontrado,
    buscador
}