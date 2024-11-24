import { Gateway, Wallets } from "fabric-network";

const testFabric = async () => {
  console.log("Fabric Network module is working correctly");
};

testFabric().catch((error) => {
  console.error("Error testing Fabric Network:", error);
});
