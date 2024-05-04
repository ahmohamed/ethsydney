// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IConnekt {
    function resetBalance(address holder) external ;
    function getHighestHolder() external view returns (address payable );
}
