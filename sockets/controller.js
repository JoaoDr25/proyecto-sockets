import { TicketControl } from '../models/ticket-control.js';
const DESK_SECRET = process.env.DESK_SECRET || 'supersecret123';

const ticketControl = new TicketControl();

const socketController = (socket, io) => {
    socket.emit('estado-actual', {
        ultimos4: ticketControl.ultimosTickets,
        proximos4: ticketControl.ticketsPendientes.slice(0, 4),
        ultimoAtendido: ticketControl.ultimosTickets[0] || null,
        pendientes: ticketControl.ticketsPendientes.length,
        nextTicket: ticketControl.getNextTicketNumber()
    });

    socket.on('siguiente-ticket', (payload, callback) => {

    const { nombre, idNumber } = payload || {};
    if (!nombre || !idNumber) {
        return callback({ ok: false, msg: 'Nombre e identificación requeridos.' });
    }

    const ticket = ticketControl.siguiente(nombre, idNumber);

    const nextTicket = ticketControl.getNextTicketNumber();
    callback({ ok: true, ticket, nextTicket });

    io.emit('estado-actual', {
        ultimos4: ticketControl.ultimosTickets,
        proximos4: ticketControl.ticketsPendientes.slice(0, 4),
        ultimoAtendido: ticketControl.ultimosTickets[0] || null,
        pendientes: ticketControl.ticketsPendientes.length,
        nextTicket: ticketControl.getNextTicketNumber()
    });
    io.emit('tickets-pendientes', ticketControl.ticketsPendientes.length);
    });

    socket.on('atender-ticket', ({ escritorio, token }, callback) => {
        if (token !== DESK_SECRET) {
            return callback({ ok: false, msg: 'No autorizado' });
        }
        const result = ticketControl.atenderTicket(escritorio);

        io.emit('estado-actual', {
            ultimos4: ticketControl.ultimosTickets,
            proximos4: ticketControl.ticketsPendientes.slice(0, 4),
            ultimoAtendido: ticketControl.ultimosTickets[0] || null,
            pendientes: ticketControl.ticketsPendientes.length,
            nextTicket: ticketControl.getNextTicketNumber()
        });

        io.emit('tickets-pendientes', ticketControl.ticketsPendientes.length);

        if (!result.error) {
            io.emit('ticket-atendiendo', result.ticket);
            io.emit('ticket-atendido');
        }

        if (result.error) {
            callback({ ok: false, msg: result.msg });
        } else {
            callback({ ok: true, ticket: result.ticket });
        }
    });

    socket.on('reset-tickets', (callback, token) => {
        if (token !== DESK_SECRET) {
            return callback?.({ ok: false, msg: 'No autorizado' });
        }
        ticketControl.reset();

        io.emit('estado-actual', {
            ultimos4: ticketControl.ultimosTickets,
            proximos4: ticketControl.ticketsPendientes.slice(0, 4),
            ultimoAtendido: ticketControl.ultimosTickets[0] || null,
            pendientes: ticketControl.ticketsPendientes.length,
            nextTicket: ticketControl.getNextTicketNumber()
        });

        io.emit('tickets-pendientes', 0);

        callback?.({ ok: true, msg: 'Tickets reiniciados exitosamente' });
    });
};

export { socketController };


