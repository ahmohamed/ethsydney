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
    string dirURI;
    mapping(uint256 => bool) internal nullifierHashes;
    mapping(address => uint256) internal addressHashes;
    mapping(address => uint256) internal addressToNFCHash;
    mapping(uint256 => address) internal NFCHashToaddress;
    mapping (address => mapping (uint256 => bool)) internal Connections;

    constructor(address initialOwner, address _connektAddress, string memory _dirURI)
        ERC721("Connectvatar", "CVATAR")
        Ownable(initialOwner)
    {
        connektAddress = _connektAddress;
        dirURI = _dirURI;
    }

    modifier onlyNewUser(uint256 nullifierHash) {
        require(!nullifierHashes[nullifierHash], "User already registered");
        _;
    }

    function safeMint(uint256 nullifierHash, uint256 signedHash, uint256 nfcSerialHash) public payable onlyNewUser(nullifierHash) {
        require(msg.value >= NFTPRICE, "Insufficient funds");
        uint256 tokenId = _nextTokenId++;

        _safeMint(msg.sender, tokenId);
        _updateMaps(msg.sender, nullifierHash, nfcSerialHash);
        // _setTokenURI(tokenId, uri);
        checkRaffle();
    }
    
    function connekt(uint256 nfcSerialHash) public {
        require(addressHashes[msg.sender] != 0, "Unregistered user");
        require(!Connections[msg.sender][nfcSerialHash], "Users already connected");
        IConnekt(connektAddress).mint(msg.sender);
    }

    function updateNFC(uint256 nfcSerialHash) public {
        require(addressHashes[msg.sender] != 0, "Unregistered user");
        uint256 previousNFC = addressToNFCHash[msg.sender];
        addressToNFCHash[msg.sender] = nfcSerialHash;
        NFCHashToaddress[nfcSerialHash] = msg.sender;
        NFCHashToaddress[previousNFC] = address(0);
    }

    function checkRaffle() internal {
        if (address(this).balance >= POTSIZE) {
            address payable holder = IConnekt(connektAddress).getHighestHolder();
            holder.transfer(address(this).balance);
            IConnekt(connektAddress).resetBalance(holder);
        }
    }
    
    function _updateMaps(address to, uint256 nullifierHash, uint256 nfcSerialHash) internal { 
        nullifierHashes[nullifierHash] = true;
        addressHashes[to] = nullifierHash;
        addressToNFCHash[to] = nfcSerialHash;
        NFCHashToaddress[nfcSerialHash] = to;
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

    function _baseURI() internal view override returns (string memory) {
        return dirURI;
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
