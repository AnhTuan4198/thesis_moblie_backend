const config = require("config");
const ProvisioningTransport = require("azure-iot-provisioning-device-mqtt").Mqtt;

//Provisioning Service  Client
const ProvisioningServiceClient = require("azure-iot-provisioning-service").ProvisioningServiceClient;

//Provisioning Service connection string 
    
const ProvisionServiceConnectionString = config.get(
  "provisionServiceConnection"
);

// Provisioning Device Client
const SymmetricKeySecurityClient = require("azure-iot-security-symmetric-key").SymmetricKeySecurityClient;
const ProvisioningDeviceClient = require("azure-iot-provisioning-device").ProvisioningDeviceClient;


//config variable
const provisioningHost = "thesisDPS.azure-devices-provisioning.net";
const idScope = "0ne0025B427";

//auto-gen variable
const shortId = require("shortid");

exports.enrollmentRegister = async function (req,res,next) {
    try {
        const provisionService = await ProvisioningServiceClient.fromConnectionString(ProvisionServiceConnectionString);
        
        let registrationId = shortId.generate();
        const enrollment = {
            registrationId,
            deviceID:registrationId,
            attestation: {
                type: 'symmetricKey'
            },
            provisioningStatus: 'enabled',
            allocationPolicy: 'geoLatency',
        };

        let result = await provisionService.createOrUpdateIndividualEnrollment(enrollment);
        // return res.status(200).json({
        //     result:result.responseBody  
        // })
        res.locals = result.responseBody;
        return next();
    } catch (error) {
       return next(error.responseBody) 
    }

}

exports.deviceRegister = async function(req,res,next ){
    try {
        const payload = res.locals;
        const registrationId = payload.registrationId;
        const symmetricKey = payload.attestation.symmetricKey.primaryKey;

        const provisioningSecurityClient = new SymmetricKeySecurityClient(
            registrationId,
            symmetricKey
        )

        const provisioningClient = await ProvisioningDeviceClient.create(
            provisioningHost,
            idScope,
            new ProvisioningTransport(),
            provisioningSecurityClient
        )

        const response = await provisioningClient.register();
        const deviceConnectionString = `HostName=${response.assignedHub};DeviceId=${response.deviceId};SharedAccessKey=${symmetricKey}`
        
        return res.status(200).json({
            connectionString:deviceConnectionString
        })
    } catch (error) {
        console.log(error)
        return next(error.result)
    }
}


// exports.enrollmentRegister();
// exports.deviceRegister()