import path from 'path';

export default {
    mode: 'development',
    entry: {
        mapa: './src/js/Mapa.js',
        AgregarImagen: './src/js/AgregarImagen.js',
        mostrarMapa: './src/js/mostrarMapa.js',
        MapaInicio: './src/js/MapaInicio.js',
    },
    output: {
        filename: '[name].js',
        path: path.resolve('public/js')
    }
}