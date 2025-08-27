const socket = io();
let audio = null;

document.body.addEventListener('click', () => {
    if (!audio) {
        audio = new Audio('./audio/new-ticket.mp3');
    }
    audio.play();
}, { once: true });

const lblTicket1     = document.querySelector('#lblTicket1');
const btnAtendiendo  = document.querySelector('#btnAtendiendo');
const lblTicket2     = document.querySelector('#lblTicket2');
const lblEscritorio2 = document.querySelector('#lblEscritorio2');
const lblTicket3     = document.querySelector('#lblTicket3');
const lblEscritorio3 = document.querySelector('#lblEscritorio3');
const lblTicket4     = document.querySelector('#lblTicket4');
const lblEscritorio4 = document.querySelector('#lblEscritorio4');


const lblNombre1 = document.querySelector('#lblNombre1');
const lblId1 = document.querySelector('#lblId1');
const lblNombre2 = document.querySelector('#lblNombre2');
const lblId2 = document.querySelector('#lblId2');
const lblNombre3 = document.querySelector('#lblNombre3');
const lblId3 = document.querySelector('#lblId3');
const lblNombre4 = document.querySelector('#lblNombre4');
const lblId4 = document.querySelector('#lblId4');

const lblTickets = [ lblTicket1, lblTicket2, lblTicket3, lblTicket4 ];
const lblEscritorios = [ null, lblEscritorio2, lblEscritorio3, lblEscritorio4 ];
const lblNombres = [ lblNombre1, lblNombre2, lblNombre3, lblNombre4 ];
const lblIds = [ lblId1, lblId2, lblId3, lblId4 ];

socket.on('estado-actual', ({ proximos4 }) => {
    for (let i = 0; i < lblTickets.length; i++) {
        if (proximos4 && proximos4[i]) {
            lblTickets[i].innerText = 'Ticket ' + proximos4[i].numero;
            if (i === 0) {

            } else {
                lblEscritorios[i].innerText = proximos4[i].escritorio ? 'Escritorio ' + proximos4[i].escritorio : 'En espera';
            }
            lblNombres[i].innerText = proximos4[i].nombre ? 'Nombre: ' + proximos4[i].nombre : 'Nombre: ---';
            lblIds[i].innerText = proximos4[i].idNumber ? 'ID: ' + proximos4[i].idNumber : 'ID: ---';
        } else {
            lblTickets[i].innerText = '---';
            if (i !== 0) lblEscritorios[i].innerText = '---';
            lblNombres[i].innerText = 'Nombre: ---';
            lblIds[i].innerText = 'ID: ---';
        }
    }
});

socket.on('ticket-atendiendo', (ticket) => {
    if (ticket && ticket.numero) {
        lblTickets[0].innerText = 'Ticket ' + ticket.numero;

        lblNombres[0].innerText = ticket.nombre ? 'Nombre: ' + ticket.nombre : 'Nombre: ---';
        lblIds[0].innerText = ticket.idNumber ? 'ID: ' + ticket.idNumber : 'ID: ---';
    }
});


socket.on('ticket-atendido', () => {
    if (!audio) {
        audio = new Audio('./audio/new-ticket.mp3');
    }
    audio.currentTime = 0;
    audio.play();
});

