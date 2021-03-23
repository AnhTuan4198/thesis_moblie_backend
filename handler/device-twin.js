const iotHub = require("azure-iothub");
const twinServiceKey  = "HostName=thesis-hcmut.azure-devices.net;SharedAccessKeyName=serviceAndRead;SharedAccessKey=vzcZ8QqY8XyjPmXeeEz8z1pvQd4bGEa4a/KwsMpUq2I=";

const twinService = iotHub.Registry.fromConnectionString(twinServiceKey);


exports.updateIndividualDevice = async function (req,res,next){
    try{
       
        
        const {deviceId , payload} = req.body;

        const instance = await twinService.getTwin(deviceId);
        const twin = instance.responseBody;

        const patch = {...payload}

        // twin.update(payload, immediately invoke)
        const feedback = await twin.update(patch);
        //return response here
        return res.status(200).json({
            Message:"update device successfully",
            statusCode:"200"
        })

    }catch(err){
        //console.log(err)
        return next(err.responseBody)
    }
}


