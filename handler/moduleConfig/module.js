const { Module, updateModuleValidator } = require("../../models/moduleModel");
const {generateQuery} = require('../../helper/query');
const { Service } = require("../../models/serviceModel");
exports.getAllModules = async (req, res, next) => {
  try {
    let allModules = await Module.find();
    return res.status(200).send(allModules);
  } catch (error) {
    return next(error);
  }
};



exports.getModules = async (req,res,next) =>{
  try{
    // console.log(`this is query: ${JSON.stringify(req.query)}`)
    const {current,pageSize} = req.query;
    const size = parseInt(pageSize,10);
    const currentPage = parseInt(current,10)
    const skipItems = (size-1)*currentPage;

    const list = await Module.find().populate('serviceName','serviceName').skip(skipItems).limit(size);
    const total = await Module.countDocuments();
    // console.log(list)


    const result = {
    data: list,
    total,
    success: true,
    pageSize:size,
    current: currentPage || 1,
  };
  return res.status(200).json(result);

  }catch (error){
    console.log(error)
    return next(error)
  }
}

exports.addModule = async(req, res, next) => {
	try {
		let existModule = await Module.findOne({
			moduleId: res.locals.deviceId
		});
		if (existModule) return next({
			message: "Module already exists",
			statusCode: 400
		});
		let newModule = await Module.create({
			moduleId: res.locals.deviceId
		});
		return res.status(200).json({
			device_id: res.locals.deviceId,
			connection_string: res.locals.deviceConnectionString
		});
	} catch (error) {
		return next(error);
	}
}

exports.updateModuleService = async (req, res, next) => {
  try {
    let requestBody = { ...req.body };
    console.log(requestBody);
    const { error } = updateModuleValidator(requestBody["serviceConfig"]);
    if (error) return res.status(400).send(error.details[0].message);
   
    let existModule = await Module.findOne({
      moduleId: req.params.module_id,
    });
    
    if (!existModule)
      return next({
        message: "Module does not exist",
        statusCode: 404,
      });
    
       let existService = await Service.findOne({serviceName:requestBody["serviceConfig"].serviceName});

      if(!existService)
        return next({
        message: "Service does not exist",
        statusCode: 404,
      });
      console.log(existService);
      await Module.findOneAndUpdate(
      {
        moduleId: req.params.module_id,
      },
      { $set:{ ...requestBody["serviceConfig"],serviceName:existService._id} },
      { upsert: true ,useFindAndModify: false}
    );

    let updatedModule = await Module.findOne({
      moduleId: req.params.module_id,
    });
    let serviceConfig = {
      service_name: updatedModule.serviceName,
      gate: updatedModule.gate,
      service_type:existService.serviceType
    };
    res.locals["moduleId"] = updatedModule.moduleId;
    res.locals["serviceConfig"] = serviceConfig;
    console.log(`end`)
    return next();
  } catch (error) {
    return next(error);
  }
};
