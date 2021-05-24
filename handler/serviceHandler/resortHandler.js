const Client = require("azure-iothub").Client;
const Message = require("azure-iot-common").Message;
const { Resort, registerResortValidator } = require("../../models/resortModel");
const { Service } = require("../../models/serviceModel");
const { Ticket } = require("../../models/ticketModel");
const { User } = require("../../models/userModel");
const { History } = require("../../models/historyModel");
const { pushNotification } = require("../../ultils/PushNotification");

exports.resortVerifyTicket = async (identificationObj) => {
  try {
    const {
      userId,
      serviceName,
      deviceId,
      ticketCode,
      ticketType,
      serviceKey,
    } = identificationObj;

    const service = Client.fromConnectionString(serviceKey);

    const userNotificationToken = await User.findOne({
      _id: userId,
    }).select({ _id: 0, notificationToken: 1 });

    let validService = await Service.findOne({
      serviceName: { $eq: serviceName },
      availableTicket: { $eq: ticketType },
    });

    // Custom implement for resort service

    // log history
    let newLog = await History.create({
      serviceName: serviceName,
      ticketCode: ticketCode,
      user: userId,
      validateStatus: !validService ? false : true,
    });

    service.open(function (err) {
      if (err) {
        return errorHandler({
          message: "Cannot connect to device" + err.message,
        });
      } else {
        if (!validService) {
          const message = new Message(
            JSON.stringify({
              message: "Your ticket is not available for this service!",
              open: false,
            })
          );
          const notification = [
            {
              message: "Validation fail",
              data: newLog._id,
            },
          ];

          pushNotification(
            userNotificationToken.notificationToken,
            notification
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
        } else {
          const message = new Message(
            JSON.stringify({
              message: "Validate success!",
              open: true,
            })
          );
          const notification = [
            {
              message: "Validation success",
              data: newLog._id,
            },
          ];

          pushNotification(
            userNotificationToken.notificationToken,
            notification
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
