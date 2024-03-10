const RealEstateContract = artifacts.require("RealEstateContract");
const EscrowContract = artifacts.require("EscrowContract");

module.exports = function (deployer) {
  deployer.deploy(RealEstateContract).then(function () {
    return deployer.deploy(EscrowContract);
  });
};