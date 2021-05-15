const {Service} = require("../../models/serviceModel")

const exampleList =[`Vesda's Kitchen`,`L'Italiano`,`Namase Omar's`,`Casa Tapas`,`Mahazaja Indian`,`Limonceno`,`Luna Pub`,'Western',`Cessie`,`Alisea`,]

const ticketType = [`Standard`,`Gold`,`Platinum`];
const exampleType=[`Cinema`,`Food`,`Resort`];


function genService() {

    const listServices = [];
    for(let i = 0; i< exampleList.length;i++){
        const ticketTypeEnum = Math.ceil(Math.random()*3);
        let ticketTypeArr = [];
        for(let j =0; j<ticketTypeEnum;j++){
            ticketTypeArr.push(ticketType[i])
        }
        const instance = {
            serviceName:exampleList[i],
            serviceType:exampleType[Math.ceil(Math.random()*2)],
            availableTicketType:ticketTypeArr,
            updatedAt:new Date(),
            createdAt:new Date(),
        }
        listServices.push(instance);
    }
    return listServices
}

exports.insertServices = async ()=>{
    const services = genService();
    try{
        const serviceList = await Service.insertMany(services,false);
        console.log(serviceList);
    }catch(e){
        console.log(e)
    }
}

