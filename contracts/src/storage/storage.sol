// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {IVote} from "../interfaces/IVote.sol";
import {IHook} from "../interfaces/IHook.sol";

abstract contract Storage {
    mapping(uint256 => IVote.Appeal) public appeals;
    uint256 public appealCount;

    IHook public hook;

    function _setHook(address _hook) internal {
        hook = IHook(_hook);
    }
}
