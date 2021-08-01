const { Service } = require("../../models/serviceModel");
const { ResortService } = require("../../models/resortModel");
const { ResortServiceItem } = require("../../models/resortServiceModel");
const { Food } = require("../../models/foodModel");
const { CinemaService } = require("../../models/cinemaService");
const { Movie } = require("../../models/movieModel");
const { FoodService } = require("../../models/foodServiceModel");
const {Ticket} = require('../../models/ticketModel');
const { User } = require('../../models/userModel');
const { groupListByKey } = require("../../ultils/groupByKey");
const { subscribe } = require("../../route/Service");

const specifyService = (serviceType) => {
  switch (serviceType) {
    case "Food":
      return {
        ServiceModel: FoodService,
        SubService: Food,
      };
    case "Cinema":
      return {
        ServiceModel: CinemaService,
        SubService: Movie,
      };
    case "Resort":
      return {
        ServiceModel: ResortService,
        SubService: ResortServiceItem,
      };
    default:
      return Service;
  }
};

exports.getAllService = async (req, res, next) => {
  try {
    const { current, pageSize, serviceType } = req.query;
    const size = parseInt(pageSize, 10);
    const currentPage = parseInt(current, 10);
    const skipItems = (currentPage - 1) * size;

    let allService = await Service.find({ serviceType: serviceType })
      .skip(skipItems)
      .limit(size);

    const total = await Service.find({
      serviceType: serviceType,
    }).countDocuments();
    const result = {
      data: allService,
      total,
      success: true,
      pageSize: size,
      current: currentPage || 1,
    };
    return res.status(200).send(result);
  } catch (error) {
    return next(error);
  }
};

exports.getSpecificService = async (req, res, next) => {
  try {
     const { current, pageSize } = req.query;
    const size = parseInt(pageSize, 10);
    const currentPage = parseInt(current, 10);
    const skipItems = (currentPage - 1) * size;
    let service = await Service.findOne(
      { _id: req.params.service_id },
      {
        serviceName: 1,
        availableTicketType: 1,
        createdBy: 1,
      }
    ).populate("subService");
    let {subService} = service;
    let newSize = skipItems + size - 1;
    // if(subService.length < (skipItems + size - 1)){
    //   newSize = subService.length ;
    // }
    let querySubService =  subService.slice(skipItems,newSize);
    const result = {
       data: querySubService,
      total:subService.length||10,
      success: true,
      pageSize: size,
      current: currentPage || 1,
    }
    return res.status(200).send(result);
  } catch (error) {
    return next(error);
  }
};

exports.createService = async (req, res, next) => {
  try {
    const {
      serviceName,
      serviceType,
      location,
      availableTicketType,
      subService,
    } = req.body;

    const existedService = await Service.findOne({ serviceName }).exec();
    if (existedService)
      return next({
        message: "Service already exist",
        statusCode: 409,
      });

    const { ServiceModel, SubService } = specifyService(serviceType);

    const SubServiceArr = await SubService.insertMany(subService);
    let listSubServiceId = SubServiceArr.map((item) => item._id);

    const NewService = await Service.create({
      serviceName,
      serviceType,
      availableTicketType,
      location,
      updatedAt: new Date(),
      createdAt: new Date(),
    });

    let UpdatedService = await ServiceModel.findByIdAndUpdate(
      NewService._id,
      {
        $addToSet: { subService: [...listSubServiceId] },
      },
      {
        new: true,
      }
    ).populate("subService");

    return res.status(200).json({
      ...UpdatedService,
    });
  } catch (error) {
    return next(error);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    modifiedService = { ...req.body };
    await Service.findOneAndUpdate(
      { serviceName: req.params.service_id },
      { $set: modifiedService },
      { upsert: true }
    );
    let updatedService = await findOne({ serviceName: req.params.service_id });
    return res.status.send(updatedService);
  } catch (error) {
    return next(error);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    let serviceObj = Service.findOne({ serviceName: req.params.service_id });
    await Service.deleteOne({ serviceName: req.params.service_id });
    return res.status(200).send(serviceObj);
  } catch (error) {
    return next(error);
  }
};

exports.mobileQueryService = async (req, res, next) => {
  try {
    console.log(req.query);
    const {userId} = req.query;
    let existUser = await User.findOne({ _id: userId });
    if (!existUser){
      return next({
        message: "You are unable to access this resource",
        statusCode: 403,
      });
    }

    const ticketTypeAvailable = await Ticket.find({user:userId,endTime:{$gte:new Date()}}).select({ticketType:1,_id:0});
    let listTicketType = [];
    ticketTypeAvailable.forEach(({ticketType})=>{
      if(!listTicketType.includes(ticketType)) listTicketType.push(ticketType)
    })
   
    const availableServiceList = await Service.find({availableTicketType:{$in:listTicketType}});
    const groupedAvailableService = groupListByKey(availableServiceList,"serviceType","services");
    return res.status(200).json({
      services:groupedAvailableService
    });
  } catch (e) {
    return next(e);
  }
};
