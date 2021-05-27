const Client = require("azure-iothub").Client;
const Message = require("azure-iot-common").Message;
const errorHandler = require("../error");

const { Food, createFoodValidator } = require("../../models/foodModel");
const { Service } = require("../../models/serviceModel");
const { User } = require("../../models/userModel");
const { Ticket } = require("../../models/ticketModel");
const { History } = require("../../models/historyModel");
const { pushNotification } = require("../../ultils/PushNotification");
const moment = require("moment");

exports.foodVerifyTicket = async (identificationObj) => {
  try {
    const {
      userId,
      serviceName,
      deviceId,
      ticketCode,
      ticketType,
      serviceKey,
    } = identificationObj;
    console.log(identificationObj);
    let isValid = false;
    let isValidTime = false;
    const currentTime = moment(new Date()).format("YYYY-MM-DD");
    let endTime;
    let startTime;
    let messageNotice;

    const service = Client.fromConnectionString(serviceKey);

    const userNotificationToken = await User.findOne({
      _id: userId,
    }).select({ _id: 0, notificationToken: 1 });

    let validService = await Service.findOne({
      serviceName: { $eq: serviceName },
      availableTicketType: { $eq: ticketType },
    });

    let validTicket = await Ticket.findOne({
      ticketCode: ticketCode,
    });
    if (validTicket) {
      endTime = moment(validTicket.endTime).format("YYYY-MM-DD");
      startTime = moment(validTicket.startTime).format("YYYY-MM-DD");
    }

    if (
      moment(currentTime).isBetween(
        startTime,
        endTime
      )
    ) {
      isValidTime = true;
    }


    if (validService !== null && validTicket !== null && isValidTime) {
      isValid = true;
      messageNotice = "Validate ticket success!!";
    }

    if (!validTicket) messageNotice = "Your ticket is not available";
    else if (!validService)
      messageNotice = "Your ticket is not available for this service !";
    else if (!isValidTime)
      messageNotice = "Your ticket is not available at this time!";
    let newLog = await History.create({
      serviceName: serviceName,
      ticketCode: ticketCode,
      user: userId,
      validateStatus: isValid,
    });
    console.log(newLog);
    service.open(function (err) {
      if (err) {
        console.log(`catch error `);
        return errorHandler({
          message: "Cannot connect to device" + err.message,
        });
      } else {
        if (isValid === false) {
          const message = new Message(
            JSON.stringify({
              message: messageNotice,
              open: false,
            })
          );
          const notification = [
            {
              message: "Validation fail",
              data: newLog._id,
            },
          ];
          console.log(message.getData());
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
              message: messageNotice,
              open: true,
            })
          );
          console.log(`wrong way`);
          const notification = [
            {
              message: "Validation success!",
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
              console.log(message.getData());
              return newLog;
            }
          });
        }
      }
    });
  } catch (error) {
    console.log(error);
    // return  errorHandler({
    //   message:"Error",
    //   statusCode:500
    // })
  }
};

exports.createFood = async (req, res, next) => {
  try {
    const { error } = createFoodValidator(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let newFood = await Food.create({ ...req.body });
    const {
      serviceName,
      foodName,
      foodKind,
      location,
      price,
      createdBy,
    } = newFood;
    return res.status(200).json({
      serviceName,
      foodName,
      foodKind,
      location,
      price,
      createdBy,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllFood = async (req, res, next) => {
  try {
    let allFood = await Food.find();
    let allFoodRes = allFood.map((food) => {
      return {
        foodId: food._id,
        foodName: food.foodName,
      };
    });
    return res.status(200).send(allFoodRes);
  } catch (error) {
    return next(error);
  }
};

exports.getSpecificFood = async (req, res, next) => {
  try {
    let food = await Food.findOne(
      { _id: req.params.food_id },
      {
        serviceName: 1,
        foodName: 1,
        foodKind: 1,
        location: 1,
        price: 1,
      }
    );
    return res.status(200).send(food);
  } catch (error) {
    return next(error);
  }
};

exports.updateFood = async (req, res, next) => {
  try {
    modifiedFood = { ...req.body };
    await Food.findOneAndUpdate(
      { _id: req.params.food_id },
      { $set: modifiedFood },
      { upsert: true }
    );
    let updatedFood = await Food.findOne({ _id: req.params.food_id });
    return res.status(200).send(updatedFood);
  } catch (error) {
    return next(error);
  }
};

exports.deleteFood = async (req, res, next) => {
  try {
    let foodObj = await Food.findOne({ _id: req.params.food_id });
    await Food.deleteOne({ _id: req.params.food_id });
    return res.status(200).send(foodObj);
  } catch (error) {
    return next(error);
  }
};
