// public/js/nuevo-ticket.js
const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');

const socket = io();

socket.on('connect', () => {
    btnCrear.disabled = false;
});

socket.on('disconnect', () => {
    btnCrear.disabled = true;
});

// Escuchamos el evento de tickets pendientes del servidor
socket.on('tickets-pendientes', (pendientes) => {
    // Puedes actualizar un label de tickets pendientes si lo agregas al HTML
    // Por ahora, solo lo logueamos
    console.log('Tickets pendientes:', pendientes);
});

btnCrear.addEventListener('click', () => {
    socket.emit('siguiente-ticket', null, (ticket) => {
        lblNuevoTicket.innerText = ticket;
    });
});