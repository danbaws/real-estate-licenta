// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EscrowContract {
    struct Escrow {
        address buyer;
        address seller;
        address arbiter;
        uint256 amount;
        bool isCompleted;
    }

    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCount;

    event EscrowCreated(uint256 escrowId, address buyer, address seller, address arbiter, uint256 amount);
    event EscrowCompleted(uint256 escrowId);

    function createEscrow(address _seller, address _arbiter, uint256 _amount) public payable {
        require(msg.value == _amount, "Incorrect amount sent");

        escrowCount++;
        escrows[escrowCount] = Escrow({
            buyer: msg.sender,
            seller: _seller,
            arbiter: _arbiter,
            amount: _amount,
            isCompleted: false
        });

        emit EscrowCreated(escrowCount, msg.sender, _seller, _arbiter, _amount);
    }

    function completeEscrow(uint256 _escrowId) public {
        require(_escrowId <= escrowCount, "Invalid escrow ID");
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.arbiter == msg.sender, "Only the arbiter can complete the escrow");
        require(!escrow.isCompleted, "Escrow already completed");

        escrow.isCompleted = true;
        (bool success, ) = payable(escrow.seller).call{value: escrow.amount}("");
        require(success, "Transfer to seller failed");

        emit EscrowCompleted(_escrowId);
    }

    function cancelEscrow(uint256 _escrowId) public {
        require(_escrowId <= escrowCount, "Invalid escrow ID");
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.buyer == msg.sender, "Only the buyer can cancel the escrow");
        require(!escrow.isCompleted, "Escrow already completed");

        (bool success, ) = payable(escrow.buyer).call{value: escrow.amount}("");
        require(success, "Refund to buyer failed");

        delete escrows[_escrowId];
    }
}
