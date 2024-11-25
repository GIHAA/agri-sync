"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeedTransactionFactory = void 0;
const faker_1 = require("@faker-js/faker");
const rosie_1 = require("rosie");
exports.SeedTransactionFactory = new rosie_1.Factory()
    .attr("id", () => faker_1.faker.number.int({ min: 1, max: 1000 }))
    .attr("farmerId", () => faker_1.faker.number.int({ min: 1, max: 100 })) // Mock farmer ID
    .attr("seedType", () => faker_1.faker.commerce.productMaterial()) // Mock seed type
    .attr("quantity", () => faker_1.faker.number.int({ min: 10, max: 500 })) // Random quantity
    .attr("pricePerUnit", () => +faker_1.faker.commerce.price({ min: 1, max: 100 })) // Random price
    .attr("totalPrice", ["quantity", "pricePerUnit"], (quantity, pricePerUnit) => quantity * pricePerUnit)
    //.attr("location", () => faker.address.cityName()) // Mock location
    .attr("status", () => faker_1.faker.helpers.arrayElement(["Pending", "Completed", "Failed"])) // Random status
    .attr("blockchainTxId", () => (faker_1.faker.datatype.boolean() ? faker_1.faker.string.uuid() : null)) // Mock blockchain ID
    .attr("createdAt", () => faker_1.faker.date.recent())
    .attr("updatedAt", () => faker_1.faker.date.recent());
