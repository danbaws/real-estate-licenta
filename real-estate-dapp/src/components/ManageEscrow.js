import React, { useState } from 'react';
import { escrowContract } from '../contracts/EscrowContract.json';

const ManageEscrow = () => {
  const [sellerAddress, setSellerAddress] = useState('');
  const [amount, setAmount] = useState(0);

  const createEscrow = async () => {
    await escrowContract.methods
      .createEscrow(sellerAddress, amount)
      .send({ from: 0xD9B56C544705106b658b8Af6BDf82c9749a89Ff2, value: amount });
  };

  const completeEscrow = async (escrowId) => {
    await escrowContract.methods
      .completeEscrow(escrowId)
      .send({ from: 0x62696a59F8374382D58bCa9a1bdB4df1042863c9 });
  };

  const cancelEscrow = async (escrowId) => {
    await escrowContract.methods
      .cancelEscrow(escrowId)
      .send({ from: 0xD9B56C544705106b658b8Af6BDf82c9749a89Ff2 });
  };

  return (
    <div>
      <h2>Manage Escrow</h2>
      <div>
        <h3>Create Escrow</h3>
        <div>
          <label htmlFor="sellerAddress">Seller Address:</label>
          <input
            type="text"
            id="sellerAddress"
            value={sellerAddress}
            onChange={(e) => setSellerAddress(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="amount">Amount:</label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(parseInt(e.target.value))}
          />
        </div>
        <button onClick={createEscrow}>Create Escrow</button>
      </div>
      <div>
        <h3>Complete Escrow</h3>
        <input
          type="text"
          placeholder="Escrow ID"
          onChange={(e) => completeEscrow(parseInt(e.target.value))}
        />
      </div>
      <div>
        <h3>Cancel Escrow</h3>
        <input
          type="text"
          placeholder="Escrow ID"
          onChange={(e) => cancelEscrow(parseInt(e.target.value))}
        />
      </div>
    </div>
  );
};

export default ManageEscrow;