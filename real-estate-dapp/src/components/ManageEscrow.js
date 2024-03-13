import React, { useState, useEffect } from 'react';
import Web3 from 'web3';
import { Link } from 'react-router-dom';

const web3 = new Web3(window.ethereum);

const { abi } = require('../contracts/EscrowContract.json');
const escrowContract = new web3.eth.Contract(abi, '0xD7ba4477d1c330472dbd34927E1A6E0c141A1494');

const ManageEscrow = () => {
  const [escrows, setEscrows] = useState([]);
  const [selectedEscrow, setSelectedEscrow] = useState(null);

  useEffect(() => {
    const fetchEscrows = async () => {
      try {
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

  const completeEscrow = async () => {
    try {
      await escrowContract.methods.completeEscrow(selectedEscrow.id).send({ from: '0xf2397CFA7eBE2d5878EBfCA47D5E36E9efe04B8b' });
      // After completing, refresh the escrows list
      const updatedEscrows = escrows.filter((escrow) => escrow.id !== selectedEscrow.id);
      setEscrows(updatedEscrows);
      setSelectedEscrow(null);
    } catch (error) {
      console.error('Error completing escrow:', error);
    }
  };

  const cancelEscrow = async () => {
    try {
      await escrowContract.methods.cancelEscrow(selectedEscrow.id).send({ from: '0xf2397CFA7eBE2d5878EBfCA47D5E36E9efe04B8b' });
      // After canceling, refresh the escrows list
      const updatedEscrows = escrows.filter((escrow) => escrow.id !== selectedEscrow.id);
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
          <p>Buyer: {selectedEscrow.buyer}</p>
          <p>Seller: {selectedEscrow.seller}</p>
          <p>Amount: {web3.utils.fromWei(selectedEscrow.amount, 'ether')} ETH</p>
          <p>Is Completed: {selectedEscrow.isCompleted ? 'Yes' : 'No'}</p>

          <div>
            <button onClick={completeEscrow}>Complete Escrow</button>
            <button onClick={cancelEscrow}>Cancel Escrow</button>
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
