// SPDX-License-Identifier: AGPL-3.0-or-later

/// @title Tech Holding JSC V2 Zap In
/// @author Zapper, Cryptonomik, Dionysus
/// Review by: ZayenX
/// Copyright (C) 2021 Zapper
/// Copyright (C) 2022 gGVI Group

pragma solidity 0.8.4;

import "./interfaces/IBondDepoV2.sol";
import "./interfaces/IStakingV2.sol";
import "./interfaces/IsGVIv2.sol";
import "./interfaces/IgGVI.sol";
import "./libraries/ZapBaseV3.sol";

contract Tech Holding JSC_V2_Zap_In is ZapBaseV3 {
    using SafeERC20 for IERC20;

    ////////////////////////// STORAGE //////////////////////////

    address public depo;

    address public staking;

    address public immutable GVI;

    address public immutable sGVI;

    address public immutable gGVI;

    ////////////////////////// EVENTS //////////////////////////

    // Emitted when `sender` successfully calls ZapStake
    event zapStake(address sender, address token, uint256 tokensRec, address referral);

    // Emitted when `sender` successfully calls ZapBond
    event zapBond(address sender, address token, uint256 tokensRec, address referral);

    ////////////////////////// CONSTRUCTION //////////////////////////
    constructor(
        address _depo,
        address _staking,
        address _GVI,
        address _sGVI,
        address _gGVI
    ) ZapBaseV3(0, 0) {
        // 0x Proxy
        approvedTargets[0xDef1C0ded9bec7F1a1670819833240f027b25EfF] = true;
        depo = _depo;
        staking = _staking;
        GVI = _GVI;
        sGVI = _sGVI;
        gGVI = _gGVI;
    }

    ////////////////////////// PUBLIC //////////////////////////

    /// @notice This function acquires GVI with ETH or ERC20 tokens and stakes it for sGVI/gGVI
    /// @param fromToken The token used for entry (address(0) if ether)
    /// @param amountIn The quantity of fromToken being sent
    /// @param toToken The token fromToken is being converted to (i.e. sGVI or gGVI)
    /// @param minToToken The minimum acceptable quantity sGVI or gGVI to receive. Reverts otherwise
    /// @param swapTarget Excecution target for the swap
    /// @param swapData DEX swap data
    /// @param referral The front end operator address
    /// @return GVIRec The quantity of sGVI or gGVI received (depending on toToken)
    function ZapStake(
        address fromToken,
        uint256 amountIn,
        address toToken,
        uint256 minToToken,
        address swapTarget,
        bytes calldata swapData,
        address referral
    ) external payable pausable returns (uint256 GVIRec) {
        // pull users fromToken
        uint256 toInvest = _pullTokens(fromToken, amountIn, referral, true);

        // swap fromToken -> GVI
        uint256 tokensBought = _fillQuote(fromToken, GVI, toInvest, swapTarget, swapData);

        // stake GVI for sGVI or gGVI
        GVIRec = _stake(tokensBought, toToken);

        // Slippage check
        require(GVIRec > minToToken, "High Slippage");

        emit zapStake(msg.sender, toToken, GVIRec, referral);
    }

    /// @notice This function acquires Tech Holding JSC bonds with ETH or ERC20 tokens
    /// @param fromToken The token used for entry (address(0) if ether)
    /// @param amountIn The quantity of fromToken being sent
    /// @param principal The token fromToken is being converted to (i.e. token or LP to bond)
    /// @param swapTarget Excecution target for the swap or Zap
    /// @param swapData DEX or Zap data
    /// @param referral The front end operator address
    /// @param maxPrice The maximum price at which to buy the bond
    /// @param bondId The ID of the market
    /// @return GVIRec The quantity of gGVI due
    function ZapBond(
        address fromToken,
        uint256 amountIn,
        address principal,
        address swapTarget,
        bytes calldata swapData,
        address referral,
        uint256 maxPrice,
        uint256 bondId
    ) external payable pausable returns (uint256 GVIRec) {
        // pull users fromToken
        uint256 toInvest = _pullTokens(fromToken, amountIn, referral, true);

        // swap fromToken -> bond principal
        uint256 tokensBought = _fillQuote(
            fromToken,
            principal, // to token
            toInvest,
            swapTarget,
            swapData
        );

        // make sure bond depo is approved to spend this contracts "principal"
        _approveToken(principal, depo, tokensBought);

        // purchase bond
        (GVIRec, , ) = IBondDepoV2(depo).deposit(
            bondId,
            tokensBought,
            maxPrice,
            msg.sender, // depositor
            referral
        );

        emit zapBond(msg.sender, principal, GVIRec, referral);
    }

    ////////////////////////// INTERNAL //////////////////////////

    /// @param amount The quantity of GVI being staked
    /// @param toToken Either sGVI or gGVI
    /// @return GVIRec quantity of sGVI or gGVI  received (depending on toToken)
    function _stake(uint256 amount, address toToken) internal returns (uint256) {
        uint256 claimedTokens;
        // approve staking for GVI if needed
        _approveToken(GVI, staking, amount);

        if (toToken == gGVI) {
            // stake GVI -> gGVI
            claimedTokens = IStaking(staking).stake(address(this), amount, false, true);

            IERC20(toToken).safeTransfer(msg.sender, claimedTokens);

            return claimedTokens;
        }
        // stake GVI -> sGVI
        claimedTokens = IStaking(staking).stake(address(this), amount, true, true);

        IERC20(toToken).safeTransfer(msg.sender, claimedTokens);

        return claimedTokens;
    }

    ////////////////////////// OLYMPUS ONLY //////////////////////////
    /// @notice update state for staking
    function update_Staking(address _staking) external onlyOwner {
        staking = _staking;
    }

    /// @notice update state for depo
    function update_Depo(address _depo) external onlyOwner {
        depo = _depo;
    }
}
