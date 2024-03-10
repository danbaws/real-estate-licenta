import React, { useState } from 'react';
import { realEstateContract } from '../contracts/RealEstateContract.json';
import storage from '../utils/firebase';

const ListProperty = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState(0);
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Upload image to Firebase Storage
    const imageRef = storage.ref().child(`images/${imageFile.name}`);
    const snapshot = await imageRef.put(imageFile);
    const imageUrl = await snapshot.ref.getDownloadURL();

    // Call the listProperty function from the RealEstateContract
    await realEstateContract.methods
      .listProperty(name, description, price, imageUrl)
      .send({ from: 0x62696a59F8374382D58bCa9a1bdB4df1042863c9 });

    // Reset form fields
    setName('');
    setDescription('');
    setPrice(0);
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
          <label htmlFor="price">Price:</label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(parseInt(e.target.value))}
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