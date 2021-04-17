const iotHub = require("azure-iothub");
const twinServiceKey  = "HostName=thesis-hcmut.azure-devices.net;SharedAccessKeyName=serviceAndRead;SharedAccessKey=vzcZ8QqY8XyjPmXeeEz8z1pvQd4bGEa4a/KwsMpUq2I=";

const twinService = iotHub.Registry.fromConnectionString(twinServiceKey);


exports.updateIndividualDevice = async function (req,res,next){
    try{
	const deviceId = req.params.module_id;
	const payload = req.body;

        const instance = await twinService.getTwin(deviceId);
        const twin = instance.responseBody;

	const patch = {
		properties:{
			desired: {...payload}
		}
	};
	/**
         * Patch format below 
         * only: and new properties in to desired properties
         */
// var patch = {
//            tags: {
//              location: {
//                plant: "hcmut",
//              },
//            },
//            properties:{
//              desired:{
//                wifiConfig:{
//                  ssid:'Anh Lua',
//                  password:"74759306"
//                },
//                serviceId:"A2FAAA"
//              }
//            }
//          };
        // twin.update(payload, immediately invoke)
        const feedback = await twin.update(patch);
        console.log(feedback);
	//return response here
        return res.status(200).json({
            Message:"update device successfully",
            statusCode:"200"
        })

    }catch(err){
        return next(err.responseBody)
    }
}


