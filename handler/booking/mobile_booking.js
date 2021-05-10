const { Ticket ,createTicketValidator } = require("../../models/ticketModel")
const uniId = require("uniqid");
const _ =require("lodash");

exports.booking = async (req,res,next)=> {
    const payload = req.body;
    const { userId,startDate , endDate ,ticketTier, numCustomer } = payload;
 
    const startTime = new Date(startDate.dateString);
    const endTime =new Date(endDate.dateString);
    try {
        let tickets =[];
        for(let i = 0; i<numCustomer; i++){
            const ticketCode  = uniId.process()
            const ticketInstance = {
                startTime,
                endTime,
                ticketType:ticketTier,
                ticketCode,
                user:userId
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
 

 