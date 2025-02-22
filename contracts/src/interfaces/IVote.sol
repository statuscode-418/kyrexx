// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

interface IVote {
    error InvalidVotingPeriod(uint256 min, uint256 max);
    error ExecutionWindowNotOpen();
    error ExecutionWindowClosed();
    //error NotVerified();
    error AlreadyVoted();
    error VotingNotStarted();
    error VotingEnded();
    error AppealALreadyExecuted();
    error HookCheckFailed();
    error HookNotRegisterd(address hookType);
    error startTimeInPast();

    event AppealCreated(
        uint256 indexed appealId,
        address indexed appealer,
        string uri,
        uint256 startTime,
        uint256 endTime,
        bytes executionData,
        address target
    );

    event voteCast(
        uint256 indexed appealId,
        address indexed voter,
        int256 weight
    );

    event AppealExecuted(uint256 indexed appealId);

    struct Appeal {
        address appealer;
        string uri;
        uint256 startTime;
        uint256 endTime;
        bool executed;
        int128 forScore;
        int128 againstScore;
        bytes executionData;
        address target;
    }

    struct createAppealParams {
        string uri;
        bytes executionData;
        address target;
        uint256 startTime;
        uint256 votingPeriod;
        bytes hookData;
    }

    struct casteVoteParams {
        uint256 appealId;
        int256 weight;
        bytes hookData;
    }

    function createAppeal(
        createAppealParams calldata params
    ) external returns (uint256 appealId);

    function castVote(casteVoteParams calldata params) external;

    function executeAppeal(uint256 appealId) external;

    function votingPeriodRange()
        external
        view
        returns (uint256 min, uint256 max);

    function executionDelay() external view returns (uint256);

    function executionWindow() external view returns (uint256);
}
