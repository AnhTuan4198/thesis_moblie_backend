const { Modules } = require('azure-iothub/dist/pl/operations');
const { random } = require('lodash');
const shortid = require('shortid');
const {Module} = require('../../models/moduleModel');


const exampleList =[`Vesda's Kitchen`,`L'Italiano`,`Namase Omar's`,`Casa Tapas`,`Mahazaja Indian`,`Limonceno`,`Luna Pub`,'Western',`Cessie`,`Alisea`,]

const exampleType=[`Cinema`,`Food`,`Resort`]
const genDevices = (max)=>{
   const tableListDataSource = [];
  for (let i = 0; i < max; i += 1) {
    tableListDataSource.push({
      moduleId: shortid.generate(),
      serviceName: exampleList[Math.ceil(Math.random()*9)],
      gate:parseInt(Math.ceil(Math.random()*100),10),
      updatedAt: new Date(),
      createdAt: new Date(),
    });
  }

  tableListDataSource.reverse();
  return tableListDataSource;
}

exports.insertModules = async ()=>{
    const devices = genDevices(20);
    try{
        const devicesList = await Module.insertMany(devices,false);
        console.log(devicesList);
    }catch(e){
        console.log(e)
    }
}
