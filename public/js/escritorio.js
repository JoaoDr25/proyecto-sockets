const socket = io();
let currentTicket = null;

const searchParams = new URLSearchParams(window.location.search);
if (!searchParams.has('escritorio')) {
  window.location = 'index.html';
  throw new Error('Escritorio es obligatorio');
}

const escritorio    = searchParams.get('escritorio');
const DESK_SECRET = 'supersecret123'; 
const lblTicket     = document.querySelector('#lblTicket');
const btnAtender    = document.querySelector('#btnAtender');
const btnReset      = document.querySelector('#btnReset');
const lblPendientes = document.querySelector('#lblPendientes'); 


socket.on('estado-actual', ({ proximos4 }) => {
  if (currentTicket) return;
  lblTicket.innerText = '---';
});

socket.on('ticket-atendiendo', (ticket) => {
  if (ticket && ticket.escritorio && ticket.escritorio.toString().toLowerCase() === escritorio.toLowerCase()) {
    lblTicket.innerText = 'Ticket ' + ticket.numero;
    currentTicket = ticket;
  }
});

socket.on('tickets-pendientes', (n) => {
  if (lblPendientes) lblPendientes.innerText = n;
});

btnAtender.addEventListener('click', () => {
  socket.emit('atender-ticket', { escritorio, token: DESK_SECRET }, ({ ok, ticket, msg }) => {
    if (!ok) {
      lblTicket.innerText = msg || '---';
      currentTicket = null;
      return;
    }
    if (ticket && ticket.numero) {
      lblTicket.innerText = 'Ticket ' + ticket.numero;
      currentTicket = ticket;
    } else {
      lblTicket.innerText = '---';
      currentTicket = null;
    }
  });
});

btnReset.addEventListener('click', () => {
  if (!confirm('Desea resetear los tickets?')) return;

  socket.emit('reset-tickets', (resp) => {
    console.log(resp.msg);
    lblTicket.innerText = '---';
    currentTicket = null;
  }, DESK_SECRET);
});

