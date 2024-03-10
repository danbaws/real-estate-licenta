import React, { useState, useEffect } from 'react';
import { realEstateContract } from '../contracts/RealEstateContract.json';

const BuyProperty = () => {
  const [properties, setProperties] = useState([]);

  useEffect(() => {
    const fetchProperties = async () => {
      const propertyCount = await realEstateContract.methods.propertyCount().call();
      const fetchedProperties = [];

      for (let i = 1; i <= propertyCount; i++) {
        const property = await realEstateContract.methods.properties(i).call();
        fetchedProperties.push(property);
      }

      setProperties(fetchedProperties);
    };

    fetchProperties();
  }, []);

  const buyProperty = async (tokenId, price) => {
    await realEstateContract.methods
      .buyProperty(tokenId)
      .send({ from: 0xD9B56C544705106b658b8Af6BDf82c9749a89Ff2, value: price });
  };

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
            <button onClick={() => buyProperty(property.id, property.price)}>
              Buy
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BuyProperty;