// SPDX-License-Identifier: GPL-3.0
pragma solidity ^0.8.12;

/* solhint-disable avoid-low-level-calls */
/* solhint-disable no-inline-assembly */
/* solhint-disable reason-string */

import "@openzeppelin/contracts/utils/cryptography/ECDSA.sol";
import "@openzeppelin/contracts/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts/proxy/utils/UUPSUpgradeable.sol";

import "@account-abstraction/contracts/core/BaseAccount.sol";
import "./callback/TokenCallbackHandler.sol";

import "./libraries/Ed25519.sol";

contract Yubi25519Account is BaseAccount, TokenCallbackHandler, UUPSUpgradeable, Initializable {
    using ECDSA for bytes32;

    address public owner;
    string public credentialId;
    string public credentialPublicKey;

    IEntryPoint private immutable _entryPoint;

    event Yubi25519AccountInitialized(IEntryPoint indexed entryPoint, address indexed owner, string credentialId, string credentialPublicKey);

    modifier onlyOwner() {
        _onlyOwner();
        _;
    }

    /// @inheritdoc BaseAccount
    function entryPoint() public view virtual override returns (IEntryPoint) {
        return _entryPoint;
    }


    // solhint-disable-next-line no-empty-blocks
    receive() external payable {}

    constructor(IEntryPoint anEntryPoint) {
        _entryPoint = anEntryPoint;
        _disableInitializers();
    }

    function _onlyOwner() internal view {
        //directly from EOA owner, or through the account itself (which gets redirected through execute())
        require(msg.sender == owner || msg.sender == address(this), "only owner");
    }

    function execute(address dest, uint256 value, bytes calldata func) external {
        _requireFromEntryPointOrOwner();
        _call(dest, value, func);
    }

    function executeBatch(address[] calldata dest, bytes[] calldata func) external {
        _requireFromEntryPointOrOwner();
        require(dest.length == func.length, "wrong array lengths");
        for (uint256 i = 0; i < dest.length; i++) {
            _call(dest[i], 0, func[i]);
        }
    }

    function initialize(address anOwner, string calldata aCredentialId, string calldata aCredentialPublicKey) public virtual initializer {
        _initialize(anOwner, aCredentialId, aCredentialPublicKey);
    }

    function _initialize(address anOwner, string calldata aCredentialId, string calldata aCredentialPublicKey) internal virtual {
        owner = anOwner;
        credentialId = aCredentialId;
        credentialPublicKey = aCredentialPublicKey;
        emit Yubi25519AccountInitialized(_entryPoint, owner, credentialId, credentialPublicKey);
    }

    function _requireFromEntryPointOrOwner() internal view {
        require(msg.sender == address(entryPoint()) || msg.sender == owner, "account: not Owner or EntryPoint");
    }

    function _validateSignature(UserOperation calldata userOp, bytes32 userOpHash)
        internal override virtual returns (uint256 validationData) {

        //(bytes32 k, bytes32 r, bytes32 s, bytes memory m) = abi.decode(
        //    userOp.signature,
        //    (bytes32, bytes32, bytes32, bytes)
        //);

        Ed25519.verify(  hex"06cf14cfae0ff9fe7fdf773202029a3e8976465c8919f4840d1c3c77c8162435",
                         hex"a6161c95fd4e3237b7dd12cc3052aaa69382510ecb5b89c2fbeb8b6efb78266b",
                         hex"81160af2842235a0257fc1d3e968c2c1c9f56f117da3186effcaeda256c38a0d",
                         hex"b0d8bdfd9f4d1023dae836b2e41da5019d20c60965dc40943e2c10f2ad4ee49ab0d8bdfd9f4d1023dae836b2e41da5019d20c60965dc");
        return 0;
    }

    function _call(address target, uint256 value, bytes memory data) internal {
        (bool success, bytes memory result) = target.call{value : value}(data);
        if (!success) {
            assembly {
                revert(add(result, 32), mload(result))
            }
        }
    }

    function getDeposit() public view returns (uint256) {
        return entryPoint().balanceOf(address(this));
    }

    function addDeposit() public payable {
        entryPoint().depositTo{value : msg.value}(address(this));
    }

    function withdrawDepositTo(address payable withdrawAddress, uint256 amount) public onlyOwner {
        entryPoint().withdrawTo(withdrawAddress, amount);
    }

    function _authorizeUpgrade(address newImplementation) internal view override {
        (newImplementation);
        _onlyOwner();
    }
}
