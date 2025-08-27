import fs from 'fs';

class Ticket {
    constructor(numero, escritorio, nombre = '', idNumber = '') {
        this.numero = numero;
        this.escritorio = escritorio;
        this.nombre = nombre;
        this.idNumber = idNumber;
    }
}

class TicketControl {
    getNextTicketNumber() {
        return (this.ultimo % 99) + 1;
    }
    constructor() {
        this.ultimo = 0;
        this.hoy = new Date().getDate();
        this.ticketsPendientes = [];
        this.ultimosTickets = [];

        this.init();
    }

    get toJSON() {
        return {
            ultimo: this.ultimo,
            hoy: this.hoy,
            ticketsPendientes: this.ticketsPendientes,
            ultimosTickets: this.ultimosTickets
        }
    }

    init() {
        const data = this.leerDB();
        if (data && data.hoy === this.hoy) {
            this.ultimo = data.ultimo || 0;

            this.ticketsPendientes = Array.isArray(data.ticketsPendientes) ? data.ticketsPendientes : [];
            this.ultimosTickets = Array.isArray(data.ultimosTickets) ? data.ultimosTickets : [];

        } else {
            this.guardarDB();
        }
    }


    guardarDB() {
        fs.writeFileSync('./db/data.json', JSON.stringify(this.toJSON));
    }

    leerDB() {
        try {
            return JSON.parse(fs.readFileSync('./db/data.json', 'utf8'));
        } catch (error) {
            return null;
        }
    }

    siguiente(nombre, idNumber) {
    this.ultimo = (this.ultimo % 99) + 1;
    const ticket = new Ticket(this.ultimo, null, nombre, idNumber);
    this.ticketsPendientes.push(ticket);
    this.guardarDB();
    return ticket;
    }

    atenderTicket(escritorio) {
        if (!escritorio) {
            return { error: true, msg: 'El escritorio es obligatorio' };
        }
        if (this.ticketsPendientes.length === 0) {
            return { error: true, msg: 'Ya no hay más tickets' };
        }

        const ticket = this.ticketsPendientes.shift();
        ticket.escritorio = escritorio;

        this.ultimosTickets.unshift(ticket);
        if (this.ultimosTickets.length > 4) {
            this.ultimosTickets.splice(-1, 1);
        }

        this.guardarDB();
        return { error: false, ticket };
    }

    reset() {
    this.ultimo = 0;
    this.ticketsPendientes = [];
    this.ultimosTickets = [];
    this.guardarDB();
    console.log('Tickets han sido reiniciados exitosamente');
    }

}

export { TicketControl }
