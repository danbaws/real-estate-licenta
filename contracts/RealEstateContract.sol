// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract RealEstateContract is ERC721URIStorage {
    struct PropertyMetadata {
        string name;
        string description;
        uint256 price;
    }

    mapping(uint256 => PropertyMetadata) public propertyMetadata;
    mapping(uint256 => bool) public propertyListedForSale;
    uint256 public nextTokenId;

    event PropertyListed(uint256 tokenId, string imageUrl, PropertyMetadata metadata);
    event PropertySold(uint256 tokenId, address newOwner, uint256 price);

    constructor() ERC721("RealEstate", "RESTN") {}

    function listProperty(
        string memory _name,
        string memory _description,
        uint256 _price,
        string memory _imageUrl
    ) public {
        uint256 tokenId = nextTokenId++;

        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, _imageUrl);

        propertyMetadata[tokenId] = PropertyMetadata({
            name: _name,
            description: _description,
            price: _price
        });

        propertyListedForSale[tokenId] = true;

        emit PropertyListed(tokenId, _imageUrl, propertyMetadata[tokenId]);
    }

    function buyProperty(uint256 _tokenId) public payable {
        require(ownerOf(_tokenId) != address(0), "Property does not exist");
        require(propertyListedForSale[_tokenId], "Property is not listed for sale");
        require(msg.value == propertyMetadata[_tokenId].price, "Incorrect amount sent");

        address previousOwner = ownerOf(_tokenId);
        _transfer(previousOwner, msg.sender, _tokenId);

        propertyListedForSale[_tokenId] = false;

        payable(previousOwner).transfer(msg.value);

        emit PropertySold(_tokenId, msg.sender, msg.value);
    }

    function editPropertyMetadata(
        uint256 _tokenId,
        string memory _name,
        string memory _description,
        uint256 _price
    ) public {
        require(ownerOf(_tokenId) != address(0), "Property does not exist");
        require(ownerOf(_tokenId) == msg.sender, "Only the owner can edit the property");

        propertyMetadata[_tokenId] = PropertyMetadata({
            name: _name,
            description: _description,
            price: _price
        });
    }

  function deleteProperty(uint256 _tokenId) public {
    require(ownerOf(_tokenId) == msg.sender, "Only the owner can delete the property");

    _burn(_tokenId);

    delete propertyMetadata[_tokenId];
    propertyListedForSale[_tokenId] = false;
}


}