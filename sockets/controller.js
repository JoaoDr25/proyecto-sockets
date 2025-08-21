// sockets/controller.js
import { TicketControl } from '../models/ticket-control.js'; 

const ticketControl = new TicketControl();

const socketController = (socket) => {
    // Al conectar, emitir el estado actual
    socket.emit('estado-actual', {
        ultimos4: ticketControl.ultimosTickets,
        pendientes: ticketControl.ticketsPendientes
    });

    socket.on('siguiente-ticket', (payload, callback) => {
        const siguiente = ticketControl.siguiente();
        callback(siguiente); // Devuelve el nuevo ticket al cliente que lo pidió

        // Notificar a todos los clientes que hay un nuevo ticket
        socket.broadcast.emit('tickets-pendientes', ticketControl.ticketsPendientes);
    });

    socket.on('atender-ticket', ({ escritorio }, callback) => {
        if (!escritorio) {
            return callback({ ok: false, msg: 'El escritorio es obligatorio' });
        }

        const ticket = ticketControl.atenderTicket(escritorio);

        // Notificar a todos los clientes el cambio
        socket.broadcast.emit('estado-actual', {
            ultimos4: ticketControl.ultimosTickets,
            pendientes: ticketControl.ticketsPendientes
        });
        
        // Notificar a todos el número de tickets pendientes
        socket.broadcast.emit('tickets-pendientes', ticketControl.ticketsPendientes);

        if (!ticket) {
            callback({ ok: false, msg: 'Ya no hay más tickets' });
        } else {
            callback({ ok: true, ticket });
        }
    });

}

export { socketController };
