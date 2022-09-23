(function() {
    const lat = document.querySelector('#latitud').value || 4.60971;
    const lng = document.querySelector('#longitud').value || -74.08175;
    const mapa = L.map('mapa').setView([lat, lng ], 16);
    let marker;

    //Utilixar Provider y Geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Pin para posicionar en el mapa

    marker = new L.marker([lat, lng], {
        draggable: true,
        autoPan: true
    })
    .addTo(mapa);

    // Detectar el movimiento del Pin para obtener latitud y longitud
    marker.on('moveend', function(e){
        marker = e.target;
        const posicion = marker.getLatLng();
        //Nueva posición para que se centre el mapa
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        //Obtener la información de las calles al soltar el ping
        geocodeService.reverse().latlng(posicion, 13).run(function(error, resultado) {
            marker.bindPopup(resultado.address.LongLabel)

            //Llenar los cambos
            document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
            document.querySelector('#calle').value = resultado?.address?.Address ?? '';
            document.querySelector('#latitud').value = resultado.latlng?.lat ?? '';
            document.querySelector('#longitud').value = resultado.latlng.lng ?? '';
        })
    })

})()