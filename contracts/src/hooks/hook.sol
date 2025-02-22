// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "../interfaces/IHook.sol";

contract hook is IHook {
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    function beforeAppealCreated(
        address executor,
        bytes calldata
    ) external virtual override returns (bool success) {}

    function afterAppealCreated(
        address,
        uint256,
        bytes calldata
    ) external virtual override {}

    function beforeVoteCast(
        address voter,
        uint256 appealId,
        int128 weight,
        bytes calldata
    ) external virtual override returns (int128) {
        hasVoted[appealId][voter] = true;
        return weight;
    }

    function afterVoteCast(
        address,
        uint256,
        int256,
        bytes calldata
    ) external virtual override {}

    function beforeAppealExecution(
        address executor,
        uint256 proposalId
    ) external virtual override returns (bool success) {}

    function afterAppealExecution(
        address,
        uint256,
        bool
    ) external virtual override {}
}
