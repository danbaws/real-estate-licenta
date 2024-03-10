// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract EscrowContract {
    struct Escrow {
        address buyer;
        address seller;
        uint256 amount;
        bool isCompleted;
    }

    mapping(uint256 => Escrow) public escrows;
    uint256 public escrowCount;

    event EscrowCreated(uint256 escrowId, address buyer, address seller, uint256 amount);
    event EscrowCompleted(uint256 escrowId);

    function createEscrow(address _seller, uint256 _amount) public payable {
        require(msg.value == _amount, "Incorrect amount sent");

        escrowCount++;
        escrows[escrowCount] = Escrow({
            buyer: msg.sender,
            seller: _seller,
            amount: _amount,
            isCompleted: false
        });

        emit EscrowCreated(escrowCount, msg.sender, _seller, _amount);
    }

    function completeEscrow(uint256 _escrowId) public {
        require(_escrowId <= escrowCount, "Invalid escrow ID");
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.seller == msg.sender, "Only the seller can complete the escrow");
        require(!escrow.isCompleted, "Escrow already completed");

        escrow.isCompleted = true;
        payable(escrow.seller).transfer(escrow.amount);

        emit EscrowCompleted(_escrowId);
    }

    function cancelEscrow(uint256 _escrowId) public {
        require(_escrowId <= escrowCount, "Invalid escrow ID");
        Escrow storage escrow = escrows[_escrowId];
        require(escrow.buyer == msg.sender, "Only the buyer can cancel the escrow");
        require(!escrow.isCompleted, "Escrow already completed");

        payable(escrow.buyer).transfer(escrow.amount);
        delete escrows[_escrowId];
    }
}