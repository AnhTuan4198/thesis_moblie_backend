"use strict";

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { var symbols = Object.getOwnPropertySymbols(object); if (enumerableOnly) symbols = symbols.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); keys.push.apply(keys, symbols); } return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

var _require = require("../../models/ticketModel"),
    Ticket = _require.Ticket,
    createTicketValidator = _require.createTicketValidator;

var uniId = require("uniqid");

var _ = require("lodash");

exports.booking = function _callee(req, res, next) {
  var payload, startDate, endDate, ticketTier, numCustomer, startTime, endTime, tickets, i, ticketCode, ticketInstance, newTicket;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          payload = req.body;
          startDate = payload.startDate, endDate = payload.endDate, ticketTier = payload.ticketTier, numCustomer = payload.numCustomer;
          startTime = new Date(startDate);
          endTime = new Date(endDate);
          console.log("startTime ".concat(startTime));
          console.log("endTime: ".concat(endTime));
          _context.prev = 6;
          tickets = [];
          i = 0;

        case 9:
          if (!(i < numCustomer)) {
            _context.next = 19;
            break;
          }

          ticketCode = uniId.process();
          ticketInstance = {
            startTime: startTime,
            endTime: endTime,
            ticketType: ticketTier,
            ticketCode: ticketCode
          }; // const {error} = createTicketValidator(ticketInstance)
          // if( error ) return next({
          //     message:"Bad request!",
          //     statusCode:400
          // })

          _context.next = 14;
          return regeneratorRuntime.awrap(Ticket.create(_objectSpread({}, ticketInstance)));

        case 14:
          newTicket = _context.sent;
          tickets.push(newTicket);

        case 16:
          i++;
          _context.next = 9;
          break;

        case 19:
          return _context.abrupt("return", res.status(200).json({
            tickets: tickets
          }));

        case 22:
          _context.prev = 22;
          _context.t0 = _context["catch"](6);
          return _context.abrupt("return", next(_context.t0));

        case 25:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[6, 22]]);
};

var startTime = new Date(startDate);
var endTime = new Date(endDate);
console.log("startTime ".concat(startTime));
console.log("endTime: ".concat(endTime));