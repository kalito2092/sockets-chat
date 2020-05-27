const { io } = require('../server');
const { Usuarios } = require('../clases/usuarios');
const { crearMensaje } = require('../utilidades/utils');


const usuarios = new Usuarios();

io.on('connection', (client) => {

    client.on('entrarChat', (usuario, callback) => {
        if (!usuario.nombre || !usuario.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre y sala son necesarios'
            })
        }

        client.join(usuario.sala);

        usuarios.agregarPersona(client.id, usuario.nombre, usuario.sala);

        client.broadcast.to(usuario.sala).emit('listarPersonas', usuarios.getPersonasPorSala(usuario.sala));

        callback(usuarios.getPersonasPorSala(usuario.sala));

    });

    client.on('crearMensaje', (data) => {
        let persona = usuarios.getPersona(client.id);
        let mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

    });

    client.on('mensajePrivado', data => {
        let persona = usuarios.getPersona(client.id);
        client.to(data.id).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));

    });


    client.on('disconnect', () => {

        let personaEliminada = usuarios.eliminarPersona(client.id);

        client.broadcast.to(personaEliminada.sala).emit('crearMensaje', crearMensaje('Admin', `${personaEliminada.nombre} abandonó el chat`));

        client.broadcast.to(personaEliminada.sala).emit('listarPersonas', usuarios.getPersonasPorSala(personaEliminada.sala));


    });

});