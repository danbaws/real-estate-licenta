import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Link } from 'react-router-dom';

const web3 = new Web3(window.ethereum);

const { abi } = require('../contracts/EscrowContract.json');
const escrowContract = new web3.eth.Contract(abi, '0xc48ADEF25a5047276F938D697B086F70B8c9e9Dd');
const { abi: RealEstateABI } = require('../contracts/RealEstateContract.json');
const realEstateContract = new web3.eth.Contract(RealEstateABI, '0x2622Ea1DbB4545C70b2e3915815e28D020d43bF1');

const ManageEscrow = () => {
  const [escrows, setEscrows] = useState([]);
  const [selectedEscrow, setSelectedEscrow] = useState(null);
  const [account, setAccount] = useState('');

  useEffect(() => {
    const fetchEscrows = async () => {
      try {
        const accounts = await web3.eth.getAccounts();
        setAccount(accounts[0]);

        const escrowsCount = await escrowContract.methods.escrowCount().call();
        const escrowsList = [];

        for (let i = 1; i <= escrowsCount; i++) {
          const escrow = await escrowContract.methods.escrows(i).call();
          escrowsList.push({ id: i, ...escrow });
        }

        setEscrows(escrowsList);
      } catch (error) {
        console.error('Error fetching escrows:', error);
      }
    };

    fetchEscrows();
  }, []);

  const handleSelectEscrow = (escrow) => {
    setSelectedEscrow(escrow);
  };

  const completeEscrow = async (escrowId) => {
    try {
      const selectedEscrow = escrows.find((escrow) => escrow.id === escrowId);
      if (!selectedEscrow) {
        throw new Error('Selected escrow not found');
      }

      await escrowContract.methods.completeEscrow(escrowId).send({ from: account, gas: 500000 });

      // Transfer the token to the buyer
      await realEstateContract.methods.safeTransferFrom(selectedEscrow.seller, selectedEscrow.buyer, selectedEscrow.tokenId).send({ from: account, gas: 500000 });

      // After completing, refresh the escrows list
      const updatedEscrows = escrows.filter((escrow) => escrow.id !== escrowId);
      setEscrows(updatedEscrows);
      setSelectedEscrow(null);
    } catch (error) {
      console.error('Error completing escrow:', error);
    }
  };

  const cancelEscrow = async (escrowId) => {
    try {
      const selectedEscrow = escrows.find((escrow) => escrow.id === escrowId);
      if (!selectedEscrow) {
        throw new Error('Selected escrow not found');
      }

      await escrowContract.methods.cancelEscrow(escrowId).send({ from: account, gas: 500000 });

      // Refund the payment to the buyer
      await web3.eth.sendTransaction({ to: selectedEscrow.buyer, value: selectedEscrow.amount, from: account, gas: 500000 });

      // After canceling, refresh the escrows list
      const updatedEscrows = escrows.filter((escrow) => escrow.id !== escrowId);
      setEscrows(updatedEscrows);
      setSelectedEscrow(null);
    } catch (error) {
      console.error('Error canceling escrow:', error);
    }
  };

  return (
    <div>
      <h2>Manage Escrow</h2>
      <div>
        <h3>Pending Escrows</h3>
        <ul>
          {escrows.map((escrow) => (
            <li key={escrow.id}>
              <button onClick={() => handleSelectEscrow(escrow)}>View Escrow #{escrow.id}</button>
            </li>
          ))}
        </ul>
      </div>

      {selectedEscrow && (
        <div>
          <h3>Selected Escrow: #{selectedEscrow.id}</h3>
          <p>Buyer: {selectedEscrow.buyer === account ? 'You' : selectedEscrow.buyer}</p>
          <p>Seller: {selectedEscrow.seller}</p>
          <p>Amount: {web3.utils.fromWei(selectedEscrow.amount, 'ether')} ETH</p>
          <p>Is Completed: {selectedEscrow.isCompleted ? 'Yes' : 'No'}</p>

          <div>
            <button onClick={() => completeEscrow(selectedEscrow.id)}>Complete Escrow</button>
            <button onClick={() => cancelEscrow(selectedEscrow.id)}>Cancel Escrow</button>
          </div>
        </div>
      )}

      <div>
        <Link to="/">Go back</Link>
      </div>
    </div>
  );
};

export default ManageEscrow;
