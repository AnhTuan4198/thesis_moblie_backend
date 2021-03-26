const config = require("config");

const {Module, updateModuleValidator} = require("../models/moduleModel");

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
		return next();
	} catch (error) {
		return next(error);
	}
}

exports.updateModuleService = async(req, res, next) => {
	if (req.get("secret_key") != config.get("secretKey")) return next({
		message: "Unauthorized",
		statusCode: 401
	});
	const {
		error
	} =  updateModuleValidator(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	try {
		console.log(req.params.moduleId);
		let existModule = await Module.findOne({
			moduleId: req.params.moduleId
		});
		if (!existModule) return next({
			message: "Module does not exist",
			statusCode: 404
		});
		await Module.updateOne({
			moduleId: req.params.moduleId
		}, {$set: {...req.body}}, {upsert: true});		
		let updatedModule = await Module.findOne({moduleId: req.params.moduleId});
		const {
			moduleId,
			serviceId,
			gate
		} = updatedModule
		return res.status(200).json({
			moduleId,
			serviceId,
			gate
		});
	} catch(error) {
		return next(error)
	}
}