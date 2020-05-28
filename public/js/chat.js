var socket = io();

var params = new URLSearchParams(window.location.search);

if (!params.has('nombre') || !params.has('sala')) {
    window.location = 'index.html';
    throw new Error('El nombre y sala son necesarios');
}

let usuario = {
    nombre: params.get('nombre'),
    sala: params.get('sala')
}

socket.on('connect', function() {
    console.log('Conectado al servidor');

    socket.emit('entrarChat', usuario, function(resp) {
        console.log('Usuarios conectados', resp);
        renderizarUsuarios(resp);

    });

});

// escuchar
socket.on('disconnect', function() {

    console.log('Perdimos conexión con el servidor');

});


// Enviar información
/*socket.emit('crearMensaje', {
    mensaje: 'Hola a todos por segunda vez'
});

//Enviar mensaje privado
socket.emit('mensajePrivado', {
    mensaje: 'Hola a todos por segunda vez',
    id: ''
});*/



// Escuchar información
socket.on('crearMensaje', function(mensaje) {
    //console.log('Servidor:', mensaje);
    renderizarMensajes(mensaje, false);
    scrollBottom();

});


socket.on('listarPersonas', function(personas) {
    console.log(personas);
    renderizarUsuarios(personas);

});


//Mensajes privados
socket.on('mensajePrivado', function(mensaje) {
    console.log('Mensaje privado:', mensaje);

})