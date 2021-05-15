const { Module, updateModuleValidator } = require("../../models/moduleModel");
const {generateQuery} = require('../../helper/query');
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
    console.log(`this is query: ${JSON.stringify(req.query)}`)
    const {current,pageSize} = req.query;
    const size = parseInt(pageSize,10);
    const currentPage = parseInt(current,10)
    const skipItems = (size-1)*currentPage;

    const list = await Module.find().skip(skipItems).limit(size);
    const total = await Module.countDocuments();
    console.log(list)


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
    await Module.findOneAndUpdate(
      {
        moduleId: req.params.module_id,
      },
      { $set: requestBody["serviceConfig"] },
      { upsert: true }
    );

    let updatedModule = await Module.findOne({
      moduleId: req.params.module_id,
    });
    let serviceConfig = {
	service_type: requestBody.serviceConfig.serviceType,
      service_name: updatedModule.serviceName,
      gate: updatedModule.gate,
    };
    res.locals["moduleId"] = updatedModule.moduleId;
    res.locals["serviceConfig"] = serviceConfig;
    return next();
  } catch (error) {
    return next(error);
  }
};
