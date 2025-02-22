// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IVote} from "../interfaces/IVote.sol";
import {Storage} from "../storage/storage.sol";
import {IHook} from "../interfaces/IHook.sol";
import {SafeCast} from "@openzeppelin/contracts/utils/math/SafeCast.sol";

contract AppealContract is IVote, Storage {
    using SafeCast for int128;

    constructor(address _hook) {
        _setHook(_hook);
    }

    function createAppeal(
        createAppealParams calldata params
    ) external override returns (uint256 appealId) {
        if (params.startTime < block.timestamp) {
            revert startTimeInPast();
        }
        if (address(hook) != address(0)) {
            IHook(hook).beforeAppealCreated(msg.sender, params.hookData);
        }

        IVote.Appeal memory appeal = IVote.Appeal({
            appealer: msg.sender,
            uri: params.uri,
            startTime: params.startTime,
            endTime: params.startTime + params.votingPeriod,
            executed: false,
            forScore: 0,
            againstScore: 0,
            executionData: params.executionData,
            target: params.target
        });

        appealId = appealCount;
        appeals[appealId] = appeal;
        appealCount++;

        if (address(hook) != address(0)) {
            IHook(hook).afterAppealCreated(msg.sender, appealId, "");
        }

        emit AppealCreated(
            appealId,
            msg.sender,
            params.uri,
            params.startTime,
            params.startTime + params.votingPeriod,
            params.executionData,
            params.target
        );
    }

    function castVote(casteVoteParams calldata params) external override {
        int128 weightDelta = int128(params.weight);
        if (address(hook) != address(0)) {
            weightDelta = IHook(hook).beforeVoteCast(
                msg.sender,
                params.appealId,
                weightDelta,
                params.hookData
            );
        }

        IVote.Appeal storage appeal = appeals[params.appealId];
        if (appeal.startTime > block.timestamp) {
            revert VotingNotStarted();
        }
        if (appeal.endTime < block.timestamp) {
            revert VotingEnded();
        }

        if (weightDelta > 0) {
            appeal.forScore += weightDelta;
        } else {
            appeal.againstScore += weightDelta;
        }

        if (address(hook) != address(0)) {
            IHook(hook).afterVoteCast(
                msg.sender,
                params.appealId,
                int256(weightDelta),
                ""
            );
        }

        emit voteCast(params.appealId, msg.sender, int256(weightDelta));
    }

    function executeAppeal(uint256 appealId) external override {
        if (address(hook) != address(0)) {
            IHook(hook).beforeAppealExecution(msg.sender, appealId);
        }
        IVote.Appeal storage appeal = appeals[appealId];
        uint256 _executionDelay = executionDelay();
        if (appeal.endTime + _executionDelay < block.timestamp) {
            revert ExecutionWindowNotOpen();
        }
        uint256 _executionWindow = executionWindow();
        if (
            appeal.endTime + _executionDelay + _executionWindow <
            block.timestamp
        ) {
            revert ExecutionWindowClosed();
        }
        if (appeal.executed) {
            revert AppealALreadyExecuted();
        }

        appeal.executed = true;

        if (address(hook) != address(0)) {
            IHook(hook).afterAppealExecution(msg.sender, appealId, true);
        }

        emit AppealExecuted(appealId);
    }

    function votingPeriodRange()
        external
        pure
        override
        returns (uint256 min, uint256 max)
    {
        return (1 days, 30 days);
    }

    function executionDelay() public pure override returns (uint256) {
        return 1 days;
    }

    function executionWindow() public pure override returns (uint256) {
        return 1 days;
    }
}
