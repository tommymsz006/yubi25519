pragma solidity ^0.8.12;
pragma experimental ABIEncoderV2;

import "./libraries/Ed25519.sol";

contract TestEd25519 {
    function verify(
        bytes32 k,
        bytes32 r,
        bytes32 s,
        bytes memory m
    ) public pure returns (bool) {
        return Ed25519.verify(k, r, s, m);
    }
}