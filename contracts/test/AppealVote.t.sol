// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import "forge-std/Test.sol";
import "../src/main/AppealContract.sol";
import "../src/interfaces/IVote.sol";
import "../src/interfaces/IHook.sol";

contract MockHook is IHook {
    mapping(uint256 => mapping(address => bool)) public hasVoted;

    function beforeAppealCreated(
        address appealer,
        bytes calldata
    ) external pure override returns (bool success) {
        return true;
    }

    function afterAppealCreated(
        address,
        uint256,
        bytes calldata
    ) external pure override {}

    function beforeVoteCast(
        address voter,
        uint256 appealId,
        int128 weight,
        bytes calldata
    ) external override returns (int128 weightDelta) {
        hasVoted[appealId][voter] = true;
        return weight;
    }

    function afterVoteCast(
        address,
        uint256,
        int256,
        bytes calldata
    ) external pure override {}

    function beforeAppealExecution(
        address,
        uint256
    ) external pure override returns (bool success) {
        return true;
    }

    function afterAppealExecution(
        address,
        uint256,
        bool
    ) external pure override {}
}

contract AppealVoteTest is Test {
    AppealVote public appealVote;
    MockHook public mockHook;

    function setUp() public {
        mockHook = new MockHook();
        appealVote = new AppealVote(address(mockHook));
    }

    function testCreateAppeal() public {
        uint256 futureStartTime = block.timestamp + 100;
        IVote.createAppealParams memory params = IVote.createAppealParams({
            uri: "ipfs://someuri",
            executionData: "",
            target: address(0x123),
            startTime: futureStartTime,
            votingPeriod: 1 days,
            hookData: hex""
        });

        vm.expectEmit(true, true, true, true);
        emit IVote.AppealCreated(
            0,
            address(this),
            "ipfs://someuri",
            futureStartTime,
            futureStartTime + 1 days,
            "",
            address(0x123)
        );
        uint256 appealId = appealVote.createAppeal(params);
        assertEq(appealId, 0);

        (
            address appealer,
            string memory uri,
            uint256 startTime,
            uint256 endTime,
            bool executed,
            int128 forScore,
            int128 againstScore,
            bytes memory executionData,
            address target
        ) = appealVote.appeals(appealId);

        assertEq(appealer, address(this));
        assertEq(uri, "ipfs://someuri");
        assertEq(startTime, futureStartTime);
        assertEq(endTime, futureStartTime + 1 days);
        assertEq(executed, false);
        assertEq(forScore, 0);
        assertEq(againstScore, 0);
        assertEq(target, address(0x123));
    }

    function testCastVote() public {
        uint256 futureStartTime = block.timestamp + 100;
        IVote.createAppealParams memory params = IVote.createAppealParams({
            uri: "ipfs://voteuri",
            executionData: "",
            target: address(0x456),
            startTime: futureStartTime,
            votingPeriod: 1 days,
            hookData: hex""
        });
        uint256 appealId = appealVote.createAppeal(params);

        vm.warp(futureStartTime + 1);

        IVote.casteVoteParams memory voteParams = IVote.casteVoteParams({
            appealId: appealId,
            weight: 10,
            hookData: hex""
        });

        vm.expectEmit(true, true, true, true);
        emit IVote.voteCast(appealId, address(this), 10);
        appealVote.castVote(voteParams);

        (, , , , , int128 forScore, int128 againstScore, , ) = appealVote
            .appeals(appealId);
        assertEq(forScore, 10);
        assertEq(againstScore, 0);
    }

    function testExecuteAppeal() public {
        uint256 futureStartTime = block.timestamp + 100;
        IVote.createAppealParams memory params = IVote.createAppealParams({
            uri: "ipfs://executeuri",
            executionData: "",
            target: address(0x789),
            startTime: futureStartTime,
            votingPeriod: 1 days,
            hookData: hex""
        });
        uint256 appealId = appealVote.createAppeal(params);

        uint256 executionDelay_ = appealVote.executionDelay();
        uint256 executionWindow_ = appealVote.executionWindow();
        vm.warp(futureStartTime + 1 days + executionDelay_ + 1);

        vm.expectEmit(true, true, true, true);
        emit IVote.AppealExecuted(appealId);
        appealVote.executeAppeal(appealId);

        (, , , , bool executed, , , , ) = appealVote.appeals(appealId);
        assertTrue(executed);
    }
}
