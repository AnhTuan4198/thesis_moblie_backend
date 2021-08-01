const express = require("express");
const userRoute = require("../route/User");
const moduleRoute = require("../route/Module");
const errorHandler = require("../handler/error");
const bookingRoute = require('../route/Mobile_booking'); 
const ticketRoute = require('../route/Tickets');
const movieRoute = require("../route/Movie");
const foodRoute = require("../route/Food");
const historyRoute = require('../route/History')

const serviceRoute = require("../route/Service");

module.exports = function (app) {
	app.use(express.json());

	app.use('/api/tickets',ticketRoute)
	// all route for user
	app.use("/auth", userRoute);

	app.use("/api/services", serviceRoute);

	// route for IoT device
	app.use("/api/modules", moduleRoute);

	// route for sending code

	app.use("/booking",bookingRoute)
	app.use("/movie", movieRoute);
	app.use("/food", foodRoute);
	app.use("/history",historyRoute);
	app.use('/api/currentUser',(req,res)=>{
		return res.send({
    name: 'Admin',
    avatar: 'https://gw.alipayobjects.com/zos/antfincdn/XAosXuNZyF/BiazfanxmamNRoxxVxka.png',
    userid: '00000001',
    email: 'antdesign@alipay.com',
    tags: [
      {
        key: '0',
        label: '很有想法的',
      },
      {
        key: '1',
        label: '专注设计',
      },
      {
        key: '2',
        label: '辣~',
      },
      {
        key: '3',
        label: '大长腿',
      },
      {
        key: '4',
        label: '川妹子',
      },
      {
        key: '5',
        label: '海纳百川',
      },
    ],
    notifyCount: 12,
    unreadCount: 0,
    country: 'China',
    geographic: {
      province: {
        label: '浙江省',
        key: '330000',
      },
      city: {
        label: '杭州市',
        key: '330100',
      },
    },
    address: '西湖区工专路 77 号',
    phone: '0752-268888888',
  })
	})
	//app error handler
	app.use(errorHandler);
}