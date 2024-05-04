// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.0.0
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Permit.sol";
import {IVRFCoordinatorV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/interfaces/IVRFCoordinatorV2Plus.sol";
import {VRFConsumerBaseV2Plus} from "@chainlink/contracts/src/v0.8/vrf/dev/VRFConsumerBaseV2Plus.sol";
import {VRFV2PlusClient} from "@chainlink/contracts/src/v0.8/vrf/dev/libraries/VRFV2PlusClient.sol";

import "interfaces/IConnekt.sol";


contract ConnectERC20 is ERC20, ERC20Burnable, ERC20Permit, VRFConsumerBaseV2Plus, IConnekt {
    event RequestSent(uint256 requestId, uint32 numWords);
    event RequestFulfilled(uint256 requestId, uint256 randomWords, uint256 amount);

    /// @notice Chainlink VRF Coordinator Config for Sepolia Testnet
    IVRFCoordinatorV2Plus COORDINATOR;
    uint256 subscriptionId;
    address vrfCoordinator = 0x9DdfaCa8183c41ad55329BdeeD9F6A8d53168B1B;
    bytes32 keyHash = 0x787d74caea10b2b357790d5b5247c2f63d1d91572a9846f780606e4d953677ae;

    uint32 callbackGasLimit = 2500000;
    uint16 requestConfirmations = 3;
    uint32 numWords = 1;
    mapping(uint256 => address) public requests;

    // TODO: off-chain leaderboard?
    address payable highestHolder;
    uint256 highestBalance;
    
    constructor(uint256 _subscriptionId) 
        ERC20("Connekt", "CNKT")
        ERC20Permit("Connekt")
        VRFConsumerBaseV2Plus(vrfCoordinator)
    {
        COORDINATOR = IVRFCoordinatorV2Plus(vrfCoordinator);
        subscriptionId = _subscriptionId;
    }
    
    function randomNumber() internal  view returns (uint256) {
        return uint256(blockhash(block.number - 1));
    }
    
    function _randomNumberToAmount(uint256 rand) internal pure returns (uint256) {
        uint256 rand5 = (rand % 5) + 1;
        uint256 rand7 = (rand % 5) + 1;
        uint256 rand29 = (rand % 5) + 1;
        return rand5 * rand7 * rand29;
    }

    function mint(address to) public onlyOwner {
        // chainlink is stalled on sepolia
        // See Txns on https://sepolia.etherscan.io/address/0x79f2743c4526a267a0e285d436ff3f787f784337
        // uint256 requestId = COORDINATOR.requestRandomWords(
        //     VRFV2PlusClient.RandomWordsRequest({
        //         keyHash: keyHash,
        //         subId: subscriptionId,
        //         requestConfirmations: requestConfirmations,
        //         callbackGasLimit: callbackGasLimit,
        //         numWords: numWords,
        //         extraArgs: VRFV2PlusClient._argsToBytes(
        //             VRFV2PlusClient.ExtraArgsV1({nativePayment: false})
        //         )
        //     })
        // );
        // requests[requestId] = to;
        // emit RequestSent(requestId, numWords);

        uint256 amount = _randomNumberToAmount(randomNumber());
        emit RequestFulfilled(0, 0, amount);
        _internal_mint(to, amount);
    }

    function _internal_mint(address to, uint256 amount) internal {
        _mint(to, amount);
    }
    
    function getHighestHolder() external view returns (address payable ){
        return highestHolder;
    }

    function resetBalance(address holder) external onlyOwner{
        // TODO
        // highestHolder;
    }

    // User zero decimals. Tokens not divisible.
    function decimals() public view virtual override returns (uint8) {
        return 0;
    }
    
    // disable token transfer
    function transfer(address to, uint256 value) public override returns (bool) {
        require(false, "CNCT points are not transferable");
        return super.transfer(to, value);
    }
    
    function fulfillRandomWords(
        uint256 _requestId,
        uint256[] memory _randomWords
    ) internal override {
        require(requests[_requestId] != address(0), "Error: Request not found");
        uint256 amount = _randomNumberToAmount(_randomWords[0]);
        _internal_mint(requests[_requestId], amount);
        requests[_requestId] = address(0);
        emit RequestFulfilled(_requestId, _randomWords[0], amount);
    }
}
