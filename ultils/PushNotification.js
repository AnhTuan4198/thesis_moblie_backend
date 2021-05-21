const {Expo} = require('expo-server-sdk');
const errorHandler = require('../handler/error')

let tickets =[];

const pushNotification = async (targetDeviceToken,message)=>{
    let expo  = new Expo();
    if(!Expo.isExpoPushToken(targetDeviceToken)) return {message:"Invalid token"}
    let messages = message.map(item =>({
        to:targetDeviceToken,
        sound:"default",
        body:item.message,
        data:{_displayInForeground:true}
    }))
    let chunks = await expo.chunkPushNotifications(messages);
    console.log(chunks);
    const sendNotification = (async ()=>{
       chunks.forEach(async chunk => {
           try {
              let ticket = await expo.sendPushNotificationsAsync(chunk);
              tickets.push([...ticket]);
           } catch (error) {
              console.log(error)
           }
       });
    })();
}

// pushNotification("ExponentPushToken[lQxcCAHPquufOlvsKSBr2p]",[{message:"hello"},{message:"say hi"}])

module.exports = {pushNotification,tickets};