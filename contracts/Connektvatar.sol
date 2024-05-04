// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "interfaces/IConnekt.sol";

contract Connectvatar is ERC721, ERC721URIStorage, Ownable {
    uint256 private _nextTokenId;
    uint256 constant NFTPRICE = 0.01 * 10 ** 18;
    uint256 constant POTSIZE = 0.5 * 10 ** 18;
    address connektAddress;
    mapping(uint256 => bool) internal nullifierHashes;
    mapping(address => uint256) internal addressHashes;

    constructor(address initialOwner, address _connektAddress)
        ERC721("Connectvatar", "CVATAR")
        Ownable(initialOwner)
    {
        connektAddress = _connektAddress;
    }

    modifier onlyNewUser(uint256 nullifierHash) {
        require(!nullifierHashes[nullifierHash], "User already registered");
        _;
    }

    function safeMint(address to, uint256 nullifierHash, uint256 signedHash) public payable onlyNewUser(nullifierHash) {
        require(msg.value >= NFTPRICE, "Insufficient funds");
        uint256 tokenId = _nextTokenId++;

        _safeMint(to, tokenId);
        checkRaffle();
        // _setTokenURI(tokenId, uri);
    }

    function checkRaffle() internal {
        if (address(this).balance >= POTSIZE) {
            address payable holder = IConnekt(connektAddress).getHighestHolder();
            holder.transfer(address(this).balance);
            IConnekt(connektAddress).resetBalance(holder);
        }
    }

    // The following functions are overrides required by Solidity.

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}
