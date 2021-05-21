const {Ticket} = require('../../models/ticketModel');
const { User } = require('../../models/userModel');



exports.getTickets= async (req,res,next)=>{
    try{
        const {userId} = req.query;
        let existUser = await User.findOne({_id:userId});
        if(!existUser) return next({
            message:"You are unable to access this resource",
            statusCode:403
        })

        let availableTicketList = await Ticket.find({user:userId,endTime:{$gte:new Date()}}).sort("-startTime")
        
        
        return res.status(200).json(
            availableTicketList
        )
    }catch(error){
        return next(error)
    }
}