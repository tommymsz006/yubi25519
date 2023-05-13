// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.18;

import '@openzeppelin/contracts/utils/Create2.sol';
import '@openzeppelin/contracts/proxy/ERC1967/ERC1967Proxy.sol';

import './Yubi25519Account.sol';

contract Yubi25519AccountFactory {
    Yubi25519Account public immutable accountImplementation;

    constructor(IEntryPoint entryPoint) {
        accountImplementation = new Yubi25519Account(entryPoint);
    }

    function createAccount(
        address owner,
        uint256 salt
    ) public returns (Yubi25519Account ret) {
        address addr = getAddress(owner, salt);
        uint codeSize = addr.code.length;
        if (codeSize > 0) {
            return Yubi25519Account(payable(addr));
        }
        ret = Yubi25519Account(
            payable(
                new ERC1967Proxy{salt: bytes32(salt)}(
                    address(accountImplementation),
                    abi.encodeCall(Yubi25519Account.initialize, (owner))
                )
            )
        );
    }

    function getAddress(
        address owner,
        uint256 salt
    ) public view returns (address) {
        return
            Create2.computeAddress(
                bytes32(salt),
                keccak256(
                    abi.encodePacked(
                        type(ERC1967Proxy).creationCode,
                        abi.encode(
                            address(accountImplementation),
                            abi.encodeCall(Yubi25519Account.initialize, (owner))
                        )
                    )
                )
            );
    }
}
