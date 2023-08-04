const { io } = require('../server');
const { Usuarios } = require('../classes/usuarios');
const { crearMensaje } = require('../utils/utilidades');


const usuarios = new Usuarios();


io.on('connection', (client) => {

    client.on('entrarChat', (data, callback) => {
        
        if(!data.nombre && !data.sala) {
            return callback({
                error: true,
                mensaje: 'El nombre/sala es necesario'
            })
        }

        // UNIR AL CLIENTE A UNA SALA
        client.join(data.sala);

        const personas = usuarios.agregarPersona(client.id, data.nombre, data.sala);

        // SE MANDA UN MENSAJE SOLO A LOS USUARIOS DE LA SALA QUE SE UNIO ALGUIEN
        client.broadcast.to(data.sala).emit('listaPersonas', usuarios.getPersonasPorSala(data.sala));
        client.broadcast.to(data.sala).emit('crearMensaje', crearMensaje('Administrador', `${data.nombre} ingreso al chat`));

        return callback(usuarios.getPersonasPorSala(data.sala));

    });


    // Mensaje de usuarios
    client.on('crearMensaje', (data, callback) => {
        const persona = usuarios.getPersona(client.id);
        const mensaje = crearMensaje(persona.nombre, data.mensaje);
        client.broadcast.to(persona.sala).emit('crearMensaje', mensaje);

        callback(mensaje);
    });



    // Mensaje privado
    client.on('mensajePrivado', (data) => {
        const persona = usuarios.getPersona(client.id);
        client.broadcast.to(data.para).emit('mensajePrivado', crearMensaje(persona.nombre, data.mensaje));
    });


    client.on('disconnect', () => {
        const personaBorrada = usuarios.borrarPersona(client.id);

        client.broadcast.to(personaBorrada.sala).emit('crearMensaje', crearMensaje('Administrador', `${personaBorrada.nombre} salió`));
        client.broadcast.to(personaBorrada.sala).emit('listaPersonas', usuarios.getPersonasPorSala(personaBorrada.sala));
    })

});