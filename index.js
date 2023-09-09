class Event  {
    constructor (name,place,price,capacity,date) {
        this.name = name 
        this.place = place
        this.price = price 
        this.capacity = capacity && 50
        this.date = date
    }

    get name() {
        return this._name;
    }


}

class TicketManager {

    #precioBasedeGanancias 
    
    constructor(events) {
        this.events = events
        console.log(events)
        
    }
    getEventos() {
    return this.events
}
    addEvents() {
    this.events.push(event)
}

}

const ticketmanager = new TicketManager
