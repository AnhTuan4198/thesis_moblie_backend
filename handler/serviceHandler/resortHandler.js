const Client = require("azure-iothub").Client;
const Message = require("azure-iot-common").Message;
const { Resort, registerResortValidator } = require("../../models/resortModel");
const { Service } = require("../../models/serviceModel");
const { Ticket } = require("../../models/ticketModel");

exports.resortVerifyTicket = async (identificationObj) => {
  try {
    const {
      serviceName,
      deviceId,
      ticketCode,
      ticketType,
      serviceKey,
    } = identificationObj;

    const service = Client.fromConnectionString(serviceKey);

    let validService = await Service.findOne({
      serviceName: { $eq: serviceName },
      availableTicket: { $eq: ticketType },
    });
    if (!validService)
      return errorHandler({
        message: "Unavailable service for this user",
        status: 403,
      });
    // Custom implement for resort service

    let currentUser = await Ticket.findOne({ ticketCode: ticketCode });
    // log history
    let newLog = await History.create({
      serviceName: validService.serviceName,
      serviceType: validService.serviceType,
      ticketCode: ticketCode,
      user: currentUser,
    });

    service.open(function (err) {
      if (err) {
        return errorHandler({
          message: "Cannot connect to device" + err.message,
        });
      } else {
        const message = new Message(
          JSON.stringify({
            message: "Validate success!",
            open: true,
          })
        );
        service.send(deviceId, message, function (err) {
          if (err) {
            console.log(`message sent `);
            return err.toString();
          } else {
            console.log("message sent: " + message.getData());
            // process.exit(0)
            return newLog;
          }
        });
      }
    });
  } catch (error) {
    return next();
  }
};

exports.roomChecking = async (identificationObj) => {
  try {
    let serviceInformation = await Resort.findOne({
      ticketCode: identificationObj.ticketCode,
    });
    const {
      ticketCode,
      resortName,
      room,
      resortService,
      updatedBy,
    } = serviceInformation;
    return {
      ticketCode,
      resortName,
      room,
      resortService,
      updatedBy,
    };
  } catch (error) {
    return next();
  }
};
