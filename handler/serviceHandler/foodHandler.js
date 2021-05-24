const Client = require("azure-iothub").Client;
const Message = require("azure-iot-common").Message;
const errorHandler = require("../error");

const { Food, createFoodValidator } = require("../../models/foodModel");
const { Service } = require("../../models/serviceModel");
const { User } = require("../../models/userModel");
const { Ticket } = require("../../models/ticketModel");
const { History } = require("../../models/historyModel");
const { pushNotification } = require("../../ultils/PushNotification");

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

    const service = Client.fromConnectionString(serviceKey);

    const userNotificationToken = await User.findOne({
      _id: userId,
    }).select({ _id: 0, notificationToken: 1 });

    console.log(userNotificationToken);
    let validService = await Service.findOne({
      serviceName: { $eq: serviceName },
      availableTicketType: { $eq: ticketType },
    });

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
        }else{
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
        pushNotification(userNotificationToken.notificationToken, notification);
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
