const { Ticket ,createTicketValidator } = require("../../models/ticketModel")
const uniId = require("uniqid");
const _ =require("lodash");

exports.booking = async (req,res,next)=> {
    const payload = req.body;
    console.log(`payload: ${payload}`)
    const { startDate , endDate ,ticketTier, numCustomer } = payload;
    // console.log(`startTime ${startDate}`);
    // console.log(`endTime: ${endDate}`);
 
    const startTime = new Date(startDate.dateString);
    const endTime =new Date(endDate.dateString);
    console.log(`startTime ${startTime}`);
    console.log(`endTime: ${endTime}`);
    try {
        let tickets =[];
        for(let i = 0; i<numCustomer; i++){
            const ticketCode  = uniId.process()
            const ticketInstance = {
                startTime,
                endTime,
                ticketType:ticketTier,
                ticketCode
            }
            const {error} = createTicketValidator(ticketInstance)
            if( error ) return next({
                message:"Bad request!",
                statusCode:400
            })
            const newTicket = await Ticket.create({...ticketInstance})
            tickets.push(newTicket)
        }
       return res.status(200).json({
           tickets
       })
        

    } catch (error) {
        return next(error)
    }
}
 

 