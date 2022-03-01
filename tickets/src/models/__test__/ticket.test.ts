import {Ticket} from "../ticket";

it("implements optimistic concurrency control",async ()=>{
    const ticket = Ticket.build({userId:"asdfgjg",title:"Concert",price:10});
    await ticket.save();

    const ticketOne = await Ticket.findById(ticket.id);
    const ticketTwo = await Ticket.findById(ticket.id);

    ticketOne!.set({title:"Concert 2"})
    ticketTwo!.set({title:"Concert 3"})

    await ticketOne!.save();

     await expect(async ()=>{
        await ticketTwo!.save();
    }).rejects.toBeDefined();

});

it("increments the version number",async ()=>{
    const ticket = Ticket.build({userId:"asdfgjg",title:"Concert",price:10});
    await ticket.save();
    expect(ticket.version).toEqual(0);
    await ticket.save();
    expect(ticket.version).toEqual(1);
    await ticket.save();
    expect(ticket.version).toEqual(2);
})
