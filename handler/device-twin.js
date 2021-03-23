const iotHub = require("azure-iothub");
const twinServiceKey  = "HostName=thesis-hcmut.azure-devices.net;SharedAccessKeyName=serviceAndRead;SharedAccessKey=vzcZ8QqY8XyjPmXeeEz8z1pvQd4bGEa4a/KwsMpUq2I=";

const twinService = iotHub.Registry.fromConnectionString(twinServiceKey);


exports.updateIndividualDevice = async function (req,res,next){
    try{
        const deviceId = "myDeviceId5";

        const instance = await twinService.getTwin(deviceId);
        const twin = instance.responseBody;

        const patch = {
            tags:{
                location:"hcmut"
            }
        }
        const feedback = await twin.update(patch,query);
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
        function query(err,twin) {
                let query = twinService.createQuery("SELECT * FROM devices WHERE tags.location = 'hcmut'",100);
                query.nextAsTwin((err,result)=>{
                    if(err){
                        console.log(err)
                    }else{
                        console.log(`All device in hcmut:${result.map(d=>d.deviceId)}`)
                    }
                })
        }

exports.updateIndividualDevice();