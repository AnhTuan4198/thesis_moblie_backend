const {
	errorHandler
} = require("./error");

const {
	EventHubConsumerClient
} = require("@azure/event-hubs");

const eventHubsCompatibleEndpoint = "sb://ihsuprodhkres007dednamespace.servicebus.windows.net/";

const eventHubsCompatiblePath = "iothub-ehub-thesis-hcm-8910473-adb4d200a9";

const iotHubSasKey = "NN2Pq5f9fXxWuiwzRCcV2ZhNE+8spTXK/1hEA9X/GTk=";

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

const eventHandler = function (messages, context) {
	for (const message of messages) {
		console.log(message);
		switch (message.properties.service) {
			case "cinema":
				cinemaHandler(message.properties);
				break;
			case "food":
				foodHandler(message.properties);
				break;
			case "resort":
				resortHandler(message.properties);
				break;
			case "room":
				roomHandler(message.properties);
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

receiveData();
