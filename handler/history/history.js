const {History} = require('../../models/historyModel');


exports.getSpecificHistory = async (req,res,next)=>{
    try{
        const {history_id} = req.params;
        console.log(history_id)
        const existedHistory = await History.findOne({_id:history_id});
        if(!existedHistory) return next({message:"Record is not exist",statusCode:500});
        return res.status(200).json({
            history:existedHistory
        })
    }catch(e){
        return next(e)
    }
}