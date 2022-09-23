import { Dropzone } from 'dropzone'

const token = document.querySelector('meta[name="csrf-token"]').getAttribute('content')

Dropzone.options.imagen = {
    dictDefaultMessage: 'Sube tus imagenes aquí',
    //acceptedFiles: '.png,.jpg,.jpeg',
    maxFilesize: 5,
    maxFiles: 1,
    parallelUploads: 1,
    autoProcessQueue: false,
    addRemoveLinks: true,
    dictRemoveFile: 'Borrar archivo',
    dictMaxFilesExceeded: 'El limite es 1 archivo',
    headers: {
        'CSRF-Token': token
    },
    paramName: 'imagen',
    init: function(){
        const dropzone = this
        const btnPublicar = document.getElementById('publicarPropiedad');
        
        //Evento para que sea cuando el usuario toque el botón de publicar la imagen se suba y se guarde en la db
        btnPublicar.addEventListener('click', function(){
            dropzone.processQueue();
        })

        dropzone.on('queuecomplete', function(file, mensaje){
            if(dropzone.getActiveFiles().length == 0){

                setTimeout(() => {
                    window.location.href = '/misPropiedades'
                }, 2000);
                
            }
        });
    }
}