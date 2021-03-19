const config = require("config");

const {Identification, identificationValidator} = require("../models/identificationModel");
const {Module} = require("../models/moduleModel");

exports.identifyCustomer = async(req, res, next) => {
	if (req.get("secret_key") != config.get("secretKey")) return next({
		message: "Unauthorize",
		statusCode: 401
	});
	const {
		error
	} = identificationValidator(req.body);
	if (error) return res.status(400).send(error.details[0].message);

	try {
		// Checking existing module
		let existModule = await Module.findOne({
			moduleId: req.body.moduleId
		});
		if (!existModule) return next({
			message: "Module does not exist",
			statusCode: 404
		});

		// Checking existing customer's code

		
		// Handle valid access to services of customer


		// Record successful scan 
		let newIdentification = await Identification.create({
			...req.body
		});
		const {
			_id,
			moduleId,
			customerCode,
			scannedAt
		} = newIdentification;
		return res.status(200).json({
			_id,
			moduleId,
			customerCode,
			scannedAt
		});
	} catch(error) {
		return next(error);
	}
}