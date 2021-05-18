const {
	errorHandler
} = require("./error");

const {
	EventHubConsumerClient
} = require("@azure/event-hubs");

const eventHubsCompatibleEndpoint = "sb://ihsuprodhkres007dednamespace.servicebus.windows.net/";

const eventHubsCompatiblePath = "iothub-ehub-thesis-hcm-8910473-adb4d200a9";

const iotHubSasKey = "NN2Pq5f9fXxWuiwzRCcV2ZhNE+8spTXK/1hEA9X/GTk=";

const serviceConStr = "HostName=thesis-hcmut.azure-devices.net;SharedAccessKeyName=service;SharedAccessKey=NN2Pq5f9fXxWuiwzRCcV2ZhNE+8spTXK/1hEA9X/GTk="

const connectionString = `Endpoint=${eventHubsCompatibleEndpoint};EntityPath=${eventHubsCompatiblePath};SharedAccessKeyName=service;SharedAccessKey=${iotHubSasKey}`;

const {cinemaVerifyTicket} = require("./serviceHandler/cinemaHandler");
const {foodVerifyTicket} = require("./serviceHandler/foodHandler");
const {resortVerifyTicket, roomChecking} = require("./serviceHandler/resortHandler");




const cinemaHandler = (payload) => {
	cinemaVerifyTicket(payload);
};

const foodHandler = (payload) => {
	foodVerifyTicket(payload);
}

const resortHandler = (payload) => {
	resortVerifyTicket(payload);
}

const roomHandler = (payload) => {
	roomChecking(payload);
}

const eventHandler = function (messages) {
	for (const message of messages) {
		const splitTicket = message.body.toString().split('-');
		const ticketCode=splitTicket[0];
		const ticketType=splitTicket[1];
		const serviceName = message.properties.serviceName;
		const serviceType = message.properties.serviceType;
		const gate = message.properties.gate;
		const deviceId = message.systemProperties['iothub-connection-device-id'];
		const payload = {
			ticketCode,
			ticketType,
			serviceName,
			serviceType,
			gate,
			deviceId,
			serviceKey:serviceConStr
		}
		switch (message.properties.serviceType) {
			case "Cinema":
				console.log("in cinema handler	")
				cinemaHandler(payload);
				break;
			case "Food":
				foodHandler(payload);
				break;
			case "Resort":
				resortHandler(payload);
				break;
			case "Room":
				roomHandler(payload);
				break;
		}
	}
};

async function receiveData() {
	const clientOptions = {
		// custom options for event hubs
	};

	const server = new EventHubConsumerClient(
		"$Default",
		connectionString,
		clientOptions
	);

	server.subscribe({
		processError: errorHandler,
		processEvents: eventHandler,
	});
}

module.exports = receiveData;
