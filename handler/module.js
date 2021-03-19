const config = require("config");

const {Module,registerModuleValidator } = require("../models/moduleModel");

exports.addModule = async(req, res, next) => {
	if (req.get("secret_key") != config.get("secretKey")) return next({
		message: "Unauthorize",
		statusCode: 401
	});
	const {
		error
	} = registerModuleValidator(req.body);
	if  (error) return res.status(400).send(error.details[0].message);

	try {
		let existModule = await Module.findOne({
			moduleId: req.body.moduleId
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
	if (req.get("secret_key") != config.get("secretKey")) return next({
		message: "Unauthorize",
		statusCode: 401
	});
	try {
		let allModules = await Module.find();
		return res.status(200).send(allModules);
	} catch (error) {
		return next(error);
	}
}