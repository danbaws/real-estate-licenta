import React, { useState, useEffect } from 'react';
import storage from '../utils/firebase';
import Web3 from 'web3';
const { abi } = require('../contracts/RealEstateContract.json');

const ListProperty = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [imageFile, setImageFile] = useState(null);
  const [realEstateContract, setRealEstateContract] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const loadWeb3 = async () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
          // Request account access if needed
          await window.ethereum.request({ method: 'eth_requestAccounts' });
          const accounts = await window.web3.eth.getAccounts();
          setAccount(accounts[0]);
        } catch (error) {
          console.error('User denied account access');
        }
      } else {
        console.error('No Ethereum provider detected');
      }
    };

    const initContract = async () => {
      const web3 = window.web3;
      const contract = new web3.eth.Contract(abi, '0x80da9238Db01F603430c7709141F399504f6b94D');
      setRealEstateContract(contract);
    };

    loadWeb3();
    initContract();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image to Firebase Storage
    const imageRef = storage.ref().child(`images/${imageFile.name}`);
    const snapshot = await imageRef.put(imageFile);
    const imageUrl = await snapshot.ref.getDownloadURL();

    // Convert price to Wei
    const web3 = window.web3;
    const priceInWei = web3.utils.toWei(price, 'ether');

    // Call the listProperty function from the RealEstateContract
    await realEstateContract.methods
      .listProperty(name, description, priceInWei, imageUrl)
      .send({ from: account });

    // Reset form fields
    setName('');
    setDescription('');
    setPrice('');
    setImageFile(null);
  };

  return (
    <div>
      <h2>List Property</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="description">Description:</label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          ></textarea>
        </div>
        <div>
          <label htmlFor="price">Price (in ETH):</label>
          <input
            type="text"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="image">Image:</label>
          <input
            type="file"
            id="image"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </div>
        <button type="submit">List Property</button>
      </form>
    </div>
  );
};

export default ListProperty;