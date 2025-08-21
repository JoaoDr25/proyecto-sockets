// models/ticket-control.js
import path from 'path';
import fs from 'fs';

class Ticket {
    constructor(numero, escritorio) {
        this.numero = numero;
        this.escritorio = escritorio;
    }
}

class TicketControl {
    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.tickets = []; // Tickets pendientes
        this.ultimos4 = []; // Tickets que se están atendiendo

        this.init();
    }

    init() {
        // En una aplicación real, esto se cargaría desde una base de datos o un archivo de persistencia
        // Por ahora, lo reiniciaremos al iniciar el día.
        if (this.hoy === new Date().getDate()) {
            this.ultimo = 0;
            this.tickets = [];
            this.ultimos4 = [];
        } else {
            // Reiniciar si es un nuevo día
            this.guardarDB();
        }
    }

    guardarDB() {
        // En una app real, aquí guardarías el estado en un archivo JSON o una base de datos
    }

    siguiente() {
        this.ultimo += 1;
        const ticket = new Ticket(this.ultimo, null);
        this.tickets.push(ticket);
        this.guardarDB();
        return `Ticket ${ticket.numero}`;
    }

    get ultimosTickets() {
        return this.ultimos4;
    }

    get ticketsPendientes() {
        return this.tickets.length;
    }

    atenderTicket(escritorio) {
        if (this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift(); // Saca el primer ticket de la cola
        ticket.escritorio = escritorio;

        this.ultimos4.unshift(ticket); // Añade el ticket atendido al inicio de la lista
        if (this.ultimos4.length > 4) {
            this.ultimos4.splice(-1, 1); // Elimina el último si hay más de 4
        }
        
        this.guardarDB();
        return ticket;
    }
}

export { TicketControl };