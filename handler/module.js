const {Module,registerModuleValidator } = require("../models/moduleModel");

exports.addModule = async(req, res, next) => {
	const {
		error
	} = registerModuleValidator(req.body);
	if  (error) return res.status(400).send(error.details[0].message);

	try {
		let existModule = await Module.findOne({
			customerId: req.body.moduleId
		});
		if (existModule) return next({
			message: "Module already exists",
			statusCode: 400
		});

		let newModule = await Module.create({
			...req.body
		});
		const {
			_id,
			moduleId,
			serviceId,
			createdAt,
			createdBy
		} = newModule;
		return res.status(200).json({
			_id,
			moduleId,
			serviceId,
			createdAt,
			createdBy
		});
	} catch (error) {
		return next(error);
	}
}

exports.getAllModules = async (req, res, next) => {
	try {
		let allModules = await Module.find();
		return res.status(200).send(allModules);
	} catch (error) {
		return next(error);
	}
}