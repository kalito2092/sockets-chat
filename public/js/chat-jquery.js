var params = new URLSearchParams(window.location.search);

$('#title_sala').text(params.get('sala'));

//Funciones para renderizar usuarios
function renderizarUsuarios(personas) {
    var html = '';
    html += `<li>
             <a href="javascript:void(0)" class="active"> Chat de <span> ${params.get('sala') + ' Group'}</span></a>
            </li>`;

    var i = 1
    personas.forEach((persona) => {
        html += `<li>
                  <a data-id="${persona.id}" href="javascript:void(0)"><img src="assets/images/users/${i}.jpg" alt="user-img" class="img-circle"> <span>${persona.nombre} <small class="text-success">online</small></span></a>
                </li>`;

        i++

        if (i > 8) {
            i = 1
        }

    })


    $('#divUsuarios').html(html);

}

//cajas azules: mensajes de otros usuarios , cajas grises: mis mensajes
function renderizarMensajes(mensaje, esMio) {
    console.log('fecha: ', mensaje.fecha);
    var html = '';
    var weekday = new Array(7);
    weekday[0] = "Dom";
    weekday[1] = "Lun";
    weekday[2] = "Mar";
    weekday[3] = "Mie";
    weekday[4] = "Jue";
    weekday[5] = "Vie";
    weekday[6] = "Sab";
    var fecha = new Date(mensaje.fecha);
    var hora = weekday[fecha.getDay()] + ' , ' + fecha.getHours() + ':' + (fecha.getMinutes() < 10 ? '0' : '') + fecha.getMinutes();

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