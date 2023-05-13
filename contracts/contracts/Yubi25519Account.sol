// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import "./SimpleAccount.sol";
import "./libraries/Ed25519.sol";

contract Yubi25519Account is SimpleAccount {

    constructor(IEntryPoint anEntryPoint) SimpleAccount(anEntryPoint) {
    }

    /// implement template method of BaseAccount
    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
    internal override virtual returns (uint256 validationData) {
        ( bytes32 k, bytes32 r, bytes32 s, bytes memory m ) = abi.decode(userOp.signature, (bytes32, bytes32, bytes32, bytes));

        if (Ed25519.verify(k, r, s, m))
            return SIG_VALIDATION_FAILED;

        return 0;
    }
}