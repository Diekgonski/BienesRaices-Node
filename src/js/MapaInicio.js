(function () {
    const lat = 4.60971;
    const lng = -74.08175;
    const mapa = L.map('mapaInicio').setView([lat, lng], 16);

    let markers = new L.FeatureGroup().addTo(mapa);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    const obtenerPropiedades = async () => {
        try {
            const url = '/api/propiedades'
            const response = await fetch(url);
            const propiedades = await response.json();

            mostrarPropiedades(propiedades);
        } catch (error) {
            console.log(error );
        }
    }

    const mostrarPropiedades = (propiedades) => {

        propiedades.forEach(propiedad => {
            //Agregar los pines
            const marker = new L.marker([propiedad?.latitud, propiedad?.longitud], {
                autoPan: true
            })
            .addTo(mapa)
            .bindPopup(`
                <p class="text-indigo-600 font-bold">${propiedad.categoria.nombre}</p>
                <h1 class="text-xl font-extrabold uppercase my-3">${propiedad?.titulo}</h1>
                <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad.titulo}">
                <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>

                <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block py-2 text-center font-bold uppercase">Ver Propiedad</a>
                
            
            `);

            markers.addLayer(marker);
        });
    }

    obtenerPropiedades();

})()

