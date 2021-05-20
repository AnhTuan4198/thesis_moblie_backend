const {
  Service,
} = require('../../models/serviceModel');
const {ResortService} = require('../../models/resortModel');
const {ResortServiceItem} = require('../../models/resortServiceModel');
const {Food} = require('../../models/foodModel');
const {CinemaService} = require('../../models/cinemaService');
const {Movie} =require('../../models/movieModel');
const {FoodService} = require('../../models/foodServiceModel');

const specifyService = (serviceType)=>{
  switch (serviceType) {
    case "Food":
      return {
        ServiceModel:FoodService,
        SubService:Food
      }
    case "Cinema":
      return {
        ServiceModel:CinemaService,
        SubService:Movie
      }
    case "Resort":
      return {
         ServiceModel:ResortService,
         SubService:ResortServiceItem
      }
    default:
      return Service
  }
}

exports.getAllService = async (req, res, next) => {
  try {
    const {current ,pageSize,serviceType} = req.query;
    const size = parseInt(pageSize,10);
    const currentPage = parseInt(current,10)
    const skipItems = (currentPage-1)*size;
    let allService = await Service.find({serviceType:serviceType}).skip(skipItems).limit(size);


    const total = await Service.find({serviceType:serviceType}).countDocuments();
    const result = {
      data: allService,
      total,
      success: true,
      pageSize:size,
      current: currentPage || 1,
    }
    return res.status(200).send(result);
  } catch (error) {
    return next(error);
  }
};

exports.getSpecificService = async (req, res, next) => {
  try {
    //  console.log(req.query)
    let service = await Service.findOne(
      { _id: req.params.service_id },
      {
        serviceName: 1,
        availableTicket: 1,
        createdBy: 1,
      }
    ).populate("subService");
    console.log(service)
    return res.status(200).send(service);
  } catch (error) {
    return next(error);
  }
};

exports.createService = async (req, res, next) => {
  try {
    // const { error } = createServiceValidator(req.body);
    // if (error) return res.status(400).send(error.details[0].message);
    console.log(Service)
    console.log(req.body)
    const {
      serviceName,
      serviceType,
      location,
      availableTicketType,
      subService
    } = req.body;

    console.log(`serviceName:${serviceName}`)
    const existedService =  await Service.findOne({serviceName}).exec();
    console.log(existedService);
    if(existedService) return next({
      message:"Service already exist",
      statusCode:409
    })

    console.log(`heer`)
    const {ServiceModel,SubService} = specifyService(serviceType);

    const SubServiceArr = await SubService.insertMany(subService)
    console.log(`this is Subservice :${SubServiceArr}`)
    let listSubServiceId = SubServiceArr.map(item=> item._id)

    const NewService = await Service.create({
      serviceName,
      serviceType,
      availableTicketType,
      location,
      updatedAt: new Date(),
      createdAt: new Date(),
    })

    console.log(`this is NewService :${NewService}`)
    let UpdatedService = await ServiceModel.findByIdAndUpdate(NewService._id,{
      $addToSet :{subService:[...listSubServiceId]}
    },{
      new:true
    }).populate("subService")


    console.log(`this is UpdatedService :${UpdatedService}`)
    return res.status(200).json({
      ...UpdatedService
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
