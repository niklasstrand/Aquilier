"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var web3_1 = require("web3");
var axios_1 = require("axios");
// Import the ABI
var BookingManagement_abi_json_1 = require("../contract/BookingManagement.abi.json");
// 1. Setup web3 provider
var web3 = new web3_1.default(new web3_1.default.providers.WebsocketProvider('ws://localhost:7545')); // assuming Ganache is running on this endpoint
// 3. Address of the deployed BookingManagement contract
var bookingManagementAddress = '0xa0C5BD86c0494C121ff180A15542481964B9b0A2';
// 4. Create a contract instance
var bookingManagementContract = new web3.eth.Contract(BookingManagement_abi_json_1.default, bookingManagementAddress);
// 5. Listen to the BookingApproved event
bookingManagementContract.events.BookingApproved({})
    .once('data', function (event) {
    console.log('Booking approved detected:', event);
    unlockVirtualLock().catch(function (err) {
        console.error('Error unlocking virtual lock:', err);
    });
})
    .once('error', function (error) {
    console.error('Error on event:', error);
});
function unlockVirtualLock() {
    return __awaiter(this, void 0, void 0, function () {
        var apiUrl, token, response, error_1;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    apiUrl = 'http://localhost:8123/api/services/input_boolean/toggle';
                    token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI1M2ZmNjFkYzA1MWE0ZGM0YTM4NzIwMWY0MWY0MTRmYiIsImlhdCI6MTY5ODA2MTU1MCwiZXhwIjoyMDEzNDIxNTUwfQ.GyNUECFqs6cae0B1FyxUjE6K5qjNK-veuphsOpRUA9g';
                    _a.label = 1;
                case 1:
                    _a.trys.push([1, 3, , 4]);
                    return [4 /*yield*/, axios_1.default.post(apiUrl, {
                            entity_id: 'input_boolean.virtual_lock'
                        }, {
                            headers: {
                                'Authorization': "Bearer ".concat(token),
                                'Content-Type': 'application/json'
                            }
                        })];
                case 2:
                    response = _a.sent();
                    console.log('Virtual lock unlocked:', response.data);
                    return [3 /*break*/, 4];
                case 3:
                    error_1 = _a.sent();
                    console.error('Error unlocking virtual lock:', error_1);
                    return [3 /*break*/, 4];
                case 4: return [2 /*return*/];
            }
        });
    });
}
