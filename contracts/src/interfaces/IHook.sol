// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IHook {
    function beforeAppealCreated(
        address appealer,
        bytes calldata data
    ) external returns (bool success);

    function afterAppealCreated(
        address appealer,
        uint256 appealId,
        bytes calldata data
    ) external;

    function beforeVoteCast(
        address voter,
        uint256 appealId,
        int128 weight,
        bytes calldata data
    ) external returns (int128 weightDelta);

    function afterVoteCast(
        address voter,
        uint appealId,
        int256 weight,
        bytes calldata data
    ) external;

    function beforeAppealExecution(
        address executor,
        uint256 appealId
    ) external returns (bool success);

    function afterAppealExecution(
        address executor,
        uint256 appealId,
        bool success
    ) external;
}
