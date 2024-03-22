import React, { useState, useEffect, useCallback } from 'react';
import Web3 from 'web3';
import { Link } from 'react-router-dom';

const web3 = new Web3(window.ethereum);
const { abi: RealEstateABI } = require('../contracts/RealEstateContract.json');

const BuyProperty = () => {
  const [properties, setProperties] = useState([]);
  const [realEstateContract, setRealEstateContract] = useState(null);
  const [account, setAccount] = useState('');

  const fetchProperties = useCallback(async () => {
    if (!realEstateContract) return;

    try {
      const propertiesCount = await realEstateContract.methods.nextTokenId().call();
      const fetchedProperties = [];

      for (let i = 1; i <= propertiesCount; i++) {
        try {
          const property = await realEstateContract.methods.propertyMetadata(i).call();
          fetchedProperties.push({
            id: i,
            name: property.name,
            description: property.description,
            price: web3.utils.fromWei(property.price, 'ether'), // Convert price to ETH
            tokenURI: await realEstateContract.methods.tokenURI(i).call(),
            seller: await realEstateContract.methods.ownerOf(i).call(),
          });
        } catch (error) {
          console.error('Error fetching property:', error);
        }
      }

      setProperties(fetchedProperties);
    } catch (error) {
      console.error('Error fetching properties:', error);
    }
  }, [realEstateContract]);

  useEffect(() => {
    const initWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
          await window.ethereum.enable();
          const web3 = window.web3;
          const realEstateContract = new web3.eth.Contract(RealEstateABI, '0x2622Ea1DbB4545C70b2e3915815e28D020d43bF1');
          setRealEstateContract(realEstateContract);
          const accounts = await web3.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error('Error initializing Web3:', error);
        }
      } else {
        console.error('Web3 provider not detected');
      }
    };

    initWeb3();
  }, []);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  const buyProperty = async (tokenId, price) => {
    try {
      await realEstateContract.methods
        .buyProperty(tokenId)
        .send({ from: account, value: web3.utils.toWei(price, 'ether') });

      fetchProperties();
    } catch (error) {
      console.error('Error buying property:', error);
    }
  };

  const deleteProperty = async (tokenId) => {
    try {
      await realEstateContract.methods
        .deleteProperty(tokenId)
        .send({ from: account, gas: 500000 }); // Manually set gas limit
      fetchProperties();
    } catch (error) {
      console.error('Error deleting property:', error);
    }
  };

  if (!realEstateContract) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Buy Property</h2>
      <ul>
        {properties.map((property) => (
          <li key={property.id}>
            <h3>{property.name}</h3>
            <p>{property.description}</p>
            <p>Price: {property.price} ETH</p>
            <img src={property.tokenURI} alt={property.name} />
            {property.seller.toLowerCase() === account.toLowerCase() && (
              <button onClick={() => deleteProperty(property.id)}>
                Delete
              </button>
            )}
            {property.seller.toLowerCase() !== account.toLowerCase() && (
              <button onClick={() => buyProperty(property.id, property.price)}>
                Buy
              </button>
            )}
          </li>
        ))}
      </ul>

      <div>
        <Link to="/">Go back</Link>
      </div>
    </div>
  );
};

export default BuyProperty;
