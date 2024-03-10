import web3 from './web3';
import RealEstateContractABI from '../contracts/RealEstateContract.json';
import EscrowContractABI from '../contracts/EscrowContract.json';

const realEstateContractAddress = RealEstateContractABI.networks[Object.keys(RealEstateContractABI.networks)[0]].address;
const escrowContractAddress = EscrowContractABI.networks[Object.keys(EscrowContractABI.networks)[0]].address;

const realEstateContract = new web3.eth.Contract(RealEstateContractABI.abi, realEstateContractAddress);
const escrowContract = new web3.eth.Contract(EscrowContractABI.abi, escrowContractAddress);

export { realEstateContract, escrowContract };