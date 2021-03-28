const { errorHandler } = require("./error");

const { EventHubConsumerClient } = require("@azure/event-hubs")

const eventHubsCompatibleEndpoint = "sb://ihsuprodhkres007dednamespace.servicebus.windows.net/";

const eventHubsCompatiblePath = "iothub-ehub-thesis-hcm-8910473-adb4d200a9";

const iotHubSasKey = "NN2Pq5f9fXxWuiwzRCcV2ZhNE+8spTXK/1hEA9X/GTk=";

const connectionString = `Endpoint=${eventHubsCompatibleEndpoint};EntityPath=${eventHubsCompatiblePath};SharedAccessKeyName=service;SharedAccessKey=${iotHubSasKey}`;   

const cinemaHandler = (payload) =>{
    console.log("this is cinema handler")
    console.log(payload)
}

const sensorHandler = (payload)=>{
    console.log("this is sensor handler");
    console.log(payload)
}

const eventHandler = function (messages,context) {

    console.log(messages);
    // console.log("Consumer: " + JSON.stringify(context))
    // for (const message of messages){
    //     console.log(message)
    //     switch (message.properties.service) {
    //         case "cinema":
    //             cinemaHandler(message)
    //             break;
    //         case 'sensor':
    //             sensorHandler(message)
    //             break;
    //     }
    // }

};

    async function receiveData (){
    const clientOptions={
        // custom options for event hubs
    }

    const server = new EventHubConsumerClient(
        "$Default",
        connectionString,
        clientOptions
    )
    
    server.subscribe({
        processError:errorHandler,
        processEvents:eventHandler
    })

}


receiveData();