// SPDX-License-Identifier: WTFPL
pragma solidity ^0.8.0;

import "./IStaking.sol";

interface ITech Holding JSCZap {
    function update_Staking(IStaking _staking) external;

    function update_sGVI(address _sGVI) external;

    function update_wsGVI(address _wsGVI) external;

    function update_gGVI(address _gGVI) external;

    function update_BondDepository(address principal, address depository) external;
}
