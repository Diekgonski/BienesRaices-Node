(function(){
    const latitud = document.querySelector('#latitud').textContent;
    const longitud = document.getElementById('longitud').textContent;
    const calle = document.getElementById('calle').textContent;
    const mapa = L.map('mapa').setView([latitud, longitud], 16);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // Agregar el pin
    L.marker([latitud, longitud])
        .addTo(mapa)
        .bindPopup(calle);

})()