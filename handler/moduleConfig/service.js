const {
  Service,
  createServiceValidator,
} = require("../../models/serviceModel");

exports.getAllService = async (req, res, next) => {
  try {
    let allService = await Service.find();
    let allServiceRes = allService.map((service) => {
      return {
        serviceName: service.serviceName,
        availableTicketType: service.availableTicketType,
      };
    });
    return res.status(200).send(allServiceRes);
  } catch (error) {
    return next(error);
  }
};

exports.getSpecificService = async (req, res, next) => {
  try {
    let service = await Service.findOne(
      { serviceName: req.params.service_id },
      {
        serviceName: 1,
        availableTicket: 1,
        createdBy: 1,
      }
    );
    return res.status(200).send(service);
  } catch (error) {
    return next(error);
  }
};

exports.createService = async (req, res, next) => {
  try {
    const { error } = createServiceValidator(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let newService = await Service.create({ ...req.body });
    const { serviceName, availableTicketType, createdBy } = newService;
    return res.status(200).json({
      serviceName,
      availableTicketType,
      createdBy,
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
