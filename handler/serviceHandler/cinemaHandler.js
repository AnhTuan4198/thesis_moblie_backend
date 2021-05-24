const Client = require("azure-iothub").Client;
const Message = require("azure-iot-common").Message;
const errorHandler = require("../error");

const { Movie, createMovieValidator } = require("../../models/movieModel");
const { Service } = require("../../models/serviceModel");
const { History } = require("../../models/historyModel");
const { User } = require("../../models/userModel");
const { Ticket } = require("../../models/ticketModel");
const { pushNotification } = require("../../ultils/PushNotification");

exports.cinemaVerifyTicket = async (identificationObj) => {
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

    let validService = await Service.findOne({
      serviceName: { $eq: serviceName },
      availableTicket: { $eq: ticketType },
    });

    const userNotificationToken = await User.findOne({
      _id: userId,
    }).select({ _id: 0, notificationToken: 1 });

    // Custom implementation for movie service
    Movie.updateOne(
      { serviceName: serviceName },
      { $inc: { availableSeat: -1 } }
    );

    // log history
    let newLog = await History.create({
      serviceName: serviceName,
      ticketCode: ticketCode,
      user: userId,
      validateStatus: !validService ? false : true,
    });

    // Open connection to the device
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
    return error;
  }
};

exports.createMovie = async (req, res, next) => {
  try {
    const { error } = createMovieValidator(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let newMovie = await Movie.create({ ...req.body });
    const {
      serviceName,
      movieName,
      performanceTime,
      theater,
      availableSeat,
      createdBy,
    } = newMovie;
    return res.status(200).json({
      serviceName,
      movieName,
      performanceTime,
      theater,
      availableSeat,
      createdBy,
    });
  } catch (error) {
    return next(error);
  }
};

exports.getAllMovie = async (req, res, next) => {
  try {
    let allMovies = await Movie.find();
    let allMovieRes = allMovies.map((movie) => {
      return {
        movieId: movie._id,
        movieName: movie.movieName,
      };
    });
    return res.status(200).send(allMovieRes);
  } catch (error) {
    return next(error);
  }
};

exports.getSpecificMovie = async (req, res, next) => {
  try {
    let movie = await Movie.findOne(
      { _id: req.params.movie_id },
      {
        serviceName: 1,
        movieName: 1,
        performanceTime: 1,
        theater: 1,
        availableSeat: 1,
      }
    );
    return res.status(200).send(movie);
  } catch (error) {
    return next(error);
  }
};

exports.updateMovie = async (req, res, next) => {
  try {
    modifiedMovie = { ...req.body };
    await Movie.findOneAndUpdate(
      { _id: req.params.movie_id },
      { $set: modifiedMovie },
      { upsert: true }
    );
    let updatedMovie = await Movie.findOne({ _id: req.params.movie_id });
    return res.status(200).send(updatedMovie);
  } catch (error) {
    return next(error);
  }
};

exports.deleteMovie = async (req, res, next) => {
  try {
    let movieObj = await Movie.findOne({ _id: req.params.movie_id });
    await Movie.deleteOne({ _id: req.params.movie_id });
    return res.status(200).send(movieObj);
  } catch (error) {
    return next(error);
  }
};
