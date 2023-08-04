let params2 = new URLSearchParams(window.location.search);

// Referencias
const divUsuarios = document.getElementById('divUsuarios');
const formEnviar = document.getElementById('formEnviar');
const txtMensaje = document.getElementById('txtMensaje');
const divChatbox = document.getElementById('divChatbox');
const titleSala = document.getElementById('titleSala');

titleSala.innerText = `Sala de chat de ${params2.get('sala')}`;


function geIdDeUsuario(id) {
    if(id) {
        console.log(id)
    }
}

// FUNCIONES PARA RENDERIZAR USUARIOS
function renderizarUsuarios(personas = []) {
    let html = `
        <li style="border-radius: 20px; text-align: center; font-weight: bold;">
            <a style="cursor: auto; padding: 15px 0;" onclick="geIdDeUsuario()" href="javascript:void(0)" class="active">Usuarios conectados</a>
        </li>
    `;

    personas.forEach(persona => {
        html += `
            <li>
                <a style="cursor: auto;" onclick="geIdDeUsuario('${persona.id}')" data-id="${persona.id}" href="javascript:void(0)">
                    <!--<img src="assets/images/users/1.jpg" alt="user-img" class="img-circle"> -->
                    <span style="color: #fff; font-weight: bold;">${persona.nombre} <small class="text-success">online</small></span>
                </a>
            </li>
        `;
    })

    divUsuarios.innerHTML = html;
}

// FORM
formEnviar.addEventListener('submit', (e) => {
    e.preventDefault();
    const mensaje = txtMensaje.value.trim();
    
    if(mensaje.length === 0) {
        return;
    }

    // Enviar información
    socket.emit('crearMensaje', {
        nombre: params.get('nombre'),
        mensaje: mensaje
    }, function(mensaje) {
        txtMensaje.value = '';
        renderizarMensajes(mensaje.nombre, mensaje.mensaje, mensaje.fecha, true);
    });

});


// RENDERIZAR MENSAJES
function renderizarMensajes(nombre, mensaje, fecha_num, propio=true) {

    const fecha = new Date(fecha_num);
    const hora = fecha.getHours() + ':' + fecha.getMinutes();

    const isAdmin = nombre==="Administrador";

    let html = '';
    propio?
    html = `
        <li class="animated fadeIn">
            <!--<div class="chat-img">
                ${isAdmin? '' : '<img src="assets/images/users/1.jpg" alt="user" />'}
            </div>-->
                <div class="chat-content">
                    <h5>${nombre}</h5>
                    <div class="box" style="background: ${isAdmin? '#f6f6f6' : '#6686FD'}; color: ${isAdmin? '#000' : '#fff'};">${mensaje}</div>
                </div>
            <div class="chat-time">${hora}</div>
        </li>
    ` :
    html = `
        <li class="reverse">
            <div class="chat-content">
                <h5>${nombre}</h5>
                <div class="box" style="background: ${isAdmin? '#f6f6f6' : '#252837'}; color: ${isAdmin? '#000' : '#fff'};">${mensaje}</div>
            </div>
            <!--<div class="chat-img">
                ${isAdmin? '' : '<img src="assets/images/users/5.jpg" alt="user" />'}
            </div>-->
            <div class="chat-time">${hora}</div>
        </li>
    `;

    divChatbox.innerHTML += html;
}

