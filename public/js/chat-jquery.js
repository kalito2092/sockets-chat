var params = new URLSearchParams(window.location.search);

$('#title_sala').text(params.get('sala'));

//Funciones para renderizar usuarios
function renderizarUsuarios(personas) {
    var html = '';
    html += `<li>
             <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala')}</span></a>
            </li>`;


    personas.forEach((persona) => {
        html += `<li>
                  <a data-id="${persona.id}" href="javascript:void(0)"><img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> <span>${persona.nombre} <small class="text-success">online</small></span></a>
                </li>`;

    })


    $('#divUsuarios').html(html);

}

//cajas azules: mensajes de otros usuarios , cajas grises: mis mensajes
function renderizarMensajes(mensaje, esMio) {
    var html = '';
    var fecha = new Date(mensaje.fecha);
    var hora = fecha.getHours() + ':' + fecha.getMinutes();

    var adminClass = 'info';

    if (mensaje.nombre === 'Admin') {
        adminClass = 'danger';
    }

    if (!esMio) {
        if (mensaje.nombre === 'Admin') {
            var html = `<li class="animated fadeIn">
                                    <div class="chat-content">
                                        <h5>${mensaje.nombre}</h5>
                                        <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
                                    </div>
                                    <div class="chat-time">${hora}</div>
                                </li>`;


        } else {
            var html = `<li class="animated fadeIn">
                                    <div class="chat-img"><img src="assets/images/users/1.jpg" alt="user" /></div>
                                    <div class="chat-content">
                                        <h5>${mensaje.nombre}</h5>
                                        <div class="box bg-light-${adminClass}">${mensaje.mensaje}</div>
                                    </div>
                                    <div class="chat-time">${hora}</div>
                                </li>`;

        }

    } else {

        var html = `<li class="reverse">
                        <div class="chat-content">
                            <h5>${mensaje.nombre}</h5>
                            <div class="box bg-light-inverse">${mensaje.mensaje}</div>
                        </div>
                        <div class="chat-img"><img src="assets/images/users/5.jpg" alt="user" /></div>
                        <div class="chat-time">${hora}</div>
                    </li>`;

    }


    $('#divChatbox').append(html);

}


function scrollBottom() {

    // selectors
    var newMessage = $('#divChatbox').children('li:last-child');

    // heights
    var clientHeight = $('#divChatbox').prop('clientHeight');
    var scrollTop = $('#divChatbox').prop('scrollTop');
    var scrollHeight = $('#divChatbox').prop('scrollHeight');
    var newMessageHeight = newMessage.innerHeight();
    var lastMessageHeight = newMessage.prev().innerHeight() || 0;

    if (clientHeight + scrollTop + newMessageHeight + lastMessageHeight >= scrollHeight) {
        $('#divChatbox').scrollTop(scrollHeight);
    }
}


// Listeners
$('#divUsuarios').on('click', 'a', function() {
    var id = $(this).data('id');

    if (id) {
        console.log(id);

    }

});


$('#formEnviar').on('submit', function(e) {
    e.preventDefault();
    console.log($('#txtMensaje').val());

    if ($('#txtMensaje').val().trim().length === 0) {
        return;
    }

    socket.emit('crearMensaje', {
        mensaje: $('#txtMensaje').val()
    }, function(resp) {
        //Limpia el input tras confirmar que se envio el mensaje
        $('#txtMensaje').val('').focus();
        renderizarMensajes(resp, true);
        scrollBottom();


    });



})