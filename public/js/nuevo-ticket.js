const lblNuevoTicket = document.querySelector('#lblNuevoTicket');
const btnCrear = document.querySelector('button');
const inputNombre = document.querySelector('#inputNombre');
const inputId = document.querySelector('#inputId');

const socket = io();

function updateTicketLabel(nextTicket) {
    lblNuevoTicket.innerText = nextTicket ? `Ticket ${nextTicket}` : 'Ticket ...';
}

socket.on('connect', () => {
    btnCrear.disabled = false;
});

socket.on('disconnect', () => {
    btnCrear.disabled = true;
});

socket.on('estado-actual', ({ nextTicket }) => {
    updateTicketLabel(nextTicket);
});

btnCrear.addEventListener('click', () => {
    const nombre = inputNombre.value.trim();
    const idNumber = inputId.value.trim();
    if (!nombre || !idNumber) {
        alert('Por favor ingrese nombre y número de identificación.');
        return;
    }
    socket.emit('siguiente-ticket', { nombre, idNumber }, (resp) => {
        if (!resp.ok) {
            alert(resp.msg);
            return;
        }
        updateTicketLabel(resp.nextTicket);
        inputNombre.value = '';
        inputId.value = '';
        inputNombre.focus();
    });
});