import { faker } from "@faker-js/faker";
import { Factory } from "rosie";
import { SeedTransaction } from "../../models/seedTransaction.model";

export const SeedTransactionFactory = new Factory<SeedTransaction>()
  .attr("id", () => faker.number.int({ min: 1, max: 1000 }))
  .attr("farmerId", () => faker.number.int({ min: 1, max: 100 })) // Mock farmer ID
  .attr("seedType", () => faker.commerce.productMaterial()) // Mock seed type
  .attr("quantity", () => faker.number.int({ min: 10, max: 500 })) // Random quantity
  .attr("pricePerUnit", () => +faker.commerce.price({ min: 1, max: 100 })) // Random price
  .attr("totalPrice", ["quantity", "pricePerUnit"], (quantity: number, pricePerUnit: number) => quantity * pricePerUnit)
  .attr("location", () => faker.address.cityName()) // Mock location
  .attr("status", () => faker.helpers.arrayElement(["Pending", "Completed", "Failed"])) // Random status
  .attr("blockchainTxId", () => (faker.datatype.boolean() ? faker.string.uuid() : null)) // Mock blockchain ID
  .attr("createdAt", () => faker.date.recent())
  .attr("updatedAt", () => faker.date.recent());
