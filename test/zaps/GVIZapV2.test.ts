/* eslint-disable node/no-missing-import */
import { network, ethers } from "hardhat";
import { constants, utils } from "ethers";

import { solidity } from "ethereum-waffle";
import chai from "chai";

import address from "../../libs/constants/address";
import { getSwapQuote } from "../../libs/quote/swap/swap";

import { getBalance } from "../../libs/token/token.helper";
import { exchangeAndApprove, exchange } from "../../libs/exchange/exchange.helper";

import { Tech Holding JSCV2ZapIn, IBondDepoV2 } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";

import BondId from "../../libs/constants/bondId";

chai.use(solidity);
const { expect } = chai;

const Tech Holding JSCZapArtifact = "Tech Holding JSC_V2_Zap_In";

describe("gGVI Group Zap", () => {
  let gviZap: Tech Holding JSCV2ZapIn;

  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let user2: SignerWithAddress;
  let user3: SignerWithAddress;
  let gGVI Group: SignerWithAddress;

  const { ETH, DAI, GVI, sGVI, gGVI, SPELL, ALCX, FRAX, UST } = address.tokens;

  before(async () => {
    [deployer, user, gGVI Group, user2, user3] = await ethers.getSigners();

    gviZap = await ethers.getContractFactory(Tech Holding JSCZapArtifact, deployer).then(async factory => {
      return (await factory.deploy(
        address.gvi.DEPO_V2,
        address.gvi.Tech Holding JSCStaking,
        address.tokens.GVI,
        address.tokens.sGVI,
        address.tokens.gGVI,
      )) as Tech Holding JSCV2ZapIn;
    });

    await gviZap.transferOwnership(gGVI Group.address);
  });

  describe("ZapStake", () => {
    context("to sGVI", () => {
      it("should ZapIn to sGVI using ETH", async () => {
        const amountIn = utils.parseEther("1");
        const fromToken = ETH;
        const toToken = sGVI;

        const { to, data } = await getSwapQuote(fromToken, GVI, amountIn);
        const initialBalance = await getBalance(toToken, user.address);

        await gviZap
          .connect(user)
          .ZapStake(fromToken, amountIn, toToken, 1, to, data, constants.AddressZero, {
            value: amountIn,
          });
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });

      it("should ZapIn to sGVI using DAI", async () => {
        const fromETH = utils.parseEther("1");
        const fromToken = DAI;
        const toToken = sGVI;

        const amountIn = await exchangeAndApprove(user, ETH, fromToken, fromETH, gviZap.address);
        const { to, data } = await getSwapQuote(fromToken, GVI, amountIn);

        const initialBalance = await getBalance(toToken, user.address);
        await gviZap
          .connect(user)
          .ZapStake(fromToken, amountIn, toToken, 1, to, data, constants.AddressZero);
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });

      it("should ZapIn to sGVI using GVI", async () => {
        const fromETH = utils.parseEther("1");
        const fromToken = GVI;
        const toToken = sGVI;

        const amountIn = await exchangeAndApprove(user, ETH, fromToken, fromETH, gviZap.address);
        const { to, data } = await getSwapQuote(fromToken, GVI, amountIn);

        const initialBalance = await getBalance(toToken, user.address);
        await gviZap
          .connect(user)
          .ZapStake(fromToken, amountIn, toToken, 1, to, data, constants.AddressZero);
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });

      it("should Not allow ZapIn if swap Targets not approved", async () => {
        const fromETH = utils.parseEther("1");
        const fromToken = ETH;
        const toToken = sGVI;

        const { to, data } = await getSwapQuote(fromToken, GVI, fromETH);

        await expect(
          gviZap
            .connect(user2)
            .ZapStake(
              fromToken,
              fromETH,
              toToken,
              1,
              constants.AddressZero,
              data,
              constants.AddressZero,
              { value: fromETH },
            ),
        ).to.be.revertedWith("Target not Authorized");
      });
      it("should revert if slippage is exceeded", async () => {
        const fromETH = utils.parseEther("1");
        const fromToken = GVI;
        const toToken = sGVI;

        const amountIn = await exchangeAndApprove(user2, ETH, fromToken, fromETH, gviZap.address);
        const { to, data } = await getSwapQuote(fromToken, GVI, amountIn);

        await expect(
          gviZap
            .connect(user2)
            .ZapStake(
              fromToken,
              amountIn,
              toToken,
              constants.MaxUint256,
              to,
              data,
              constants.AddressZero,
            ),
        ).to.be.revertedWith("High Slippage");
      });      
      it("should emit zapStake Event", async () => {
        const fromETH = utils.parseEther("1");
        const fromToken = GVI;
        const toToken = sGVI;

        const amountIn = await exchangeAndApprove(user, ETH, fromToken, fromETH, gviZap.address);
        const { to, data } = await getSwapQuote(fromToken, GVI, amountIn);

        const initialBalance = await getBalance(toToken, user.address);
        
        expect(await gviZap
          .connect(user)
          .ZapStake(fromToken, amountIn, toToken, 1, to, data, constants.AddressZero)).to.emit(gviZap, "zapStake");
      });
    });

    context("to gGVI", () => {
      it("should ZapIn to gGVI using ETH", async () => {
        const amountIn = utils.parseEther("1");
        const fromToken = ETH;
        const toToken = gGVI;

        const { to, data } = await getSwapQuote(fromToken, GVI, amountIn);

        const initialBalance = await getBalance(toToken, user.address);
        await gviZap
          .connect(user)
          .ZapStake(fromToken, amountIn, toToken, 1, to, data, constants.AddressZero, {
            value: amountIn,
          });
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });

      it("should ZapIn to gGVI using DAI", async () => {
        const fromETH = utils.parseEther("1");
        const fromToken = DAI;
        const toToken = gGVI;

        const amountIn = await exchangeAndApprove(user, ETH, fromToken, fromETH, gviZap.address);
        const { to, data } = await getSwapQuote(fromToken, GVI, amountIn);

        const initialBalance = await getBalance(toToken, user.address);
        await gviZap
          .connect(user)
          .ZapStake(fromToken, amountIn, toToken, 1, to, data, constants.AddressZero);
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });

      it("should ZapIn to gGVI using GVI", async () => {
        const fromETH = utils.parseEther("1");
        const fromToken = GVI;
        const toToken = gGVI;

        const amountIn = await exchangeAndApprove(user, ETH, fromToken, fromETH, gviZap.address);
        const { to, data } = await getSwapQuote(fromToken, GVI, amountIn);

        const initialBalance = await getBalance(toToken, user.address);
        await gviZap
          .connect(user)
          .ZapStake(fromToken, amountIn, toToken, 1, to, data, constants.AddressZero);
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });      
    });    
  });

  describe("ZapBond", () => {
    let depository: IBondDepoV2;
    context("Tokens", () => {
      before(async () => {
        depository = (await ethers.getContractAt(
          "contracts/zaps/interfaces/IBondDepoV2.sol:IBondDepoV2",
          address.gvi.DEPO_V2,
        )) as IBondDepoV2;
      });
      it("Should create bonds with DAI principal using ETH", async () => {
        const fromToken = ETH;
        const toToken = DAI;

        const bondId = BondId.DAI_12;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = utils.parseEther("5");

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const beforeVesting = (await depository.indexesFor(user.address)).length;

        const maxPrice = await depository.marketPrice(bondId);

        await gviZap
          .connect(user)
          .ZapBond(
            fromToken,
            amountIn,
            toToken,
            to,
            data,
            constants.AddressZero,
            maxPrice,
            bondId,
            {
              value: amountIn,
            },
          );

        const vesting = (await depository.indexesFor(user.address)).length;

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should create bonds with DAI principal using SPELL", async () => {
        const fromToken = SPELL;
        const toToken = DAI;

        const bondId = BondId.DAI_12;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = await exchangeAndApprove(
          user,
          ETH,
          fromToken,
          utils.parseEther("5"),
          gviZap.address,
        );

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const beforeVesting = (await depository.indexesFor(user.address)).length;

        const maxPrice = await depository.marketPrice(bondId);

        await gviZap
          .connect(user)
          .ZapBond(fromToken, amountIn, toToken, to, data, constants.AddressZero, maxPrice, bondId);

        const vesting = (await depository.indexesFor(user.address)).length;

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should create bonds with FRAX principal using ETH", async () => {
        const fromToken = ETH;
        const toToken = FRAX;

        const bondId = BondId.FRAX_13;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = utils.parseEther("5");

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const beforeVesting = (await depository.indexesFor(user.address)).length;

        const maxPrice = await depository.marketPrice(bondId);

        await gviZap
          .connect(user)
          .ZapBond(
            fromToken,
            amountIn,
            toToken,
            to,
            data,
            constants.AddressZero,
            maxPrice,
            bondId,
            { value: amountIn },
          );

        const vesting = (await depository.indexesFor(user.address)).length;

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should create bonds with FRAX principal using SPELL", async () => {
        const fromToken = SPELL;
        const toToken = FRAX;

        const bondId = BondId.FRAX_13;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = await exchangeAndApprove(
          user,
          ETH,
          fromToken,
          utils.parseEther("5"),
          gviZap.address,
        );

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const beforeVesting = (await depository.indexesFor(user.address)).length;

        const maxPrice = await depository.marketPrice(bondId);

        await gviZap
          .connect(user)
          .ZapBond(fromToken, amountIn, toToken, to, data, constants.AddressZero, maxPrice, bondId);

        const vesting = (await depository.indexesFor(user.address)).length;

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should create bonds with UST principal using ETH", async () => {
        const fromToken = ETH;
        const toToken = UST;

        const bondId = BondId.UST_11;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = utils.parseEther("5");

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const beforeVesting = (await depository.indexesFor(user.address)).length;

        const maxPrice = await depository.marketPrice(bondId);

        await gviZap
          .connect(user)
          .ZapBond(
            fromToken,
            amountIn,
            toToken,
            to,
            data,
            constants.AddressZero,
            maxPrice,
            bondId,
            { value: amountIn },
          );

        const vesting = (await depository.indexesFor(user.address)).length;

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should create bonds with UST principal using DAI", async () => {
        const fromToken = DAI;
        const toToken = UST;

        const bondId = BondId.UST_11;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = await exchangeAndApprove(
          user,
          ETH,
          fromToken,
          utils.parseEther("1"),
          gviZap.address,
        );

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const beforeVesting = (await depository.indexesFor(user.address)).length;

        const maxPrice = await depository.marketPrice(bondId);

        await gviZap
          .connect(user)
          .ZapBond(fromToken, amountIn, toToken, to, data, constants.AddressZero, maxPrice, bondId);

        const vesting = (await depository.indexesFor(user.address)).length;

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should create bonds with UST_15 principal using DAI", async () => {
        const fromToken = DAI;
        const toToken = UST;

        const bondId = BondId.UST_15;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = await exchangeAndApprove(
          user,
          ETH,
          fromToken,
          utils.parseEther("1"),
          gviZap.address,
        );

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const beforeVesting = (await depository.indexesFor(user.address)).length;

        const maxPrice = await depository.marketPrice(bondId);

        await gviZap
          .connect(user)
          .ZapBond(fromToken, amountIn, toToken, to, data, constants.AddressZero, maxPrice, bondId);

        const vesting = (await depository.indexesFor(user.address)).length;

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should create bonds with UST_15 principal using ETH", async () => {
        const fromToken = ETH;
        const toToken = UST;

        const bondId = BondId.UST_15;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = utils.parseEther("5");

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const beforeVesting = (await depository.indexesFor(user.address)).length;

        const maxPrice = await depository.marketPrice(bondId);

        await gviZap
          .connect(user)
          .ZapBond(
            fromToken,
            amountIn,
            toToken,
            to,
            data,
            constants.AddressZero,
            maxPrice,
            bondId,
            { value: amountIn },
          );

        const vesting = (await depository.indexesFor(user.address)).length;

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should create bonds with FRAX_14 principal using ETH", async () => {
        const fromToken = ETH;
        const toToken = FRAX;

        const bondId = BondId.FRAX_14;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = utils.parseEther("5");

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const beforeVesting = (await depository.indexesFor(user.address)).length;

        const maxPrice = await depository.marketPrice(bondId);

        await gviZap
          .connect(user)
          .ZapBond(
            fromToken,
            amountIn,
            toToken,
            to,
            data,
            constants.AddressZero,
            maxPrice,
            bondId,
            { value: amountIn },
          );

        const vesting = (await depository.indexesFor(user.address)).length;

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should create bonds with FRAX_14 principal using SPELL", async () => {
        const fromToken = SPELL;
        const toToken = FRAX;

        const bondId = BondId.FRAX_14;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = await exchangeAndApprove(
          user,
          ETH,
          fromToken,
          utils.parseEther("5"),
          gviZap.address,
        );

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const beforeVesting = (await depository.indexesFor(user.address)).length;

        const maxPrice = await depository.marketPrice(bondId);

        await gviZap
          .connect(user)
          .ZapBond(fromToken, amountIn, toToken, to, data, constants.AddressZero, maxPrice, bondId);

        const vesting = (await depository.indexesFor(user.address)).length;

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should create bonds with DAI_16 principal using ETH", async () => {
        const fromToken = ETH;
        const toToken = DAI;

        const bondId = BondId.DAI_16;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = utils.parseEther("5");

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const beforeVesting = (await depository.indexesFor(user.address)).length;

        const maxPrice = await depository.marketPrice(bondId);

        await gviZap
          .connect(user)
          .ZapBond(
            fromToken,
            amountIn,
            toToken,
            to,
            data,
            constants.AddressZero,
            maxPrice,
            bondId,
            { value: amountIn },
          );

        const vesting = (await depository.indexesFor(user.address)).length;

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should create bonds with DAI_16 principal using SPELL", async () => {
        const fromToken = SPELL;
        const toToken = DAI;

        const bondId = BondId.DAI_16;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = await exchangeAndApprove(
          user,
          ETH,
          fromToken,
          utils.parseEther("5"),
          gviZap.address,
        );

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const beforeVesting = (await depository.indexesFor(user.address)).length;

        const maxPrice = await depository.marketPrice(bondId);

        await gviZap
          .connect(user)
          .ZapBond(fromToken, amountIn, toToken, to, data, constants.AddressZero, maxPrice, bondId);

        const vesting = (await depository.indexesFor(user.address)).length;

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should not allow to create bonds if swap Target not approved", async () => {
        const fromToken = SPELL;
        const toToken = FRAX;

        const bondId = BondId.FRAX_13;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = await exchangeAndApprove(
          user3,
          ETH,
          fromToken,
          utils.parseEther("5"),
          gviZap.address,
        );

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const maxPrice = await depository.marketPrice(bondId);

        await expect(
          gviZap
            .connect(user3)
            .ZapBond(
              fromToken,
              amountIn,
              toToken,
              constants.AddressZero,
              data,
              constants.AddressZero,
              maxPrice,
              bondId,
            ),
        ).to.be.revertedWith("Target not Authorized");
      });
      it("should revert if slippage is exceeded", async () => {
        const fromToken = SPELL;
        const toToken = FRAX;

        const bondId = BondId.FRAX_14;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = await exchangeAndApprove(
          user3,
          ETH,
          fromToken,
          utils.parseEther("5"),
          gviZap.address,
        );

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const maxPrice = 0;

        await expect(
          gviZap
            .connect(user3)
            .ZapBond(
              fromToken,
              amountIn,
              toToken,
              to,
              data,
              constants.AddressZero,
              maxPrice,
              bondId,
            ),
        ).to.be.revertedWith("Depository: more than max price");
      });
      it("should emit zapBond Event", async () => {
        const fromToken = SPELL;
        const toToken = DAI;

        const bondId = BondId.DAI_16;

        // Convert from Eth to the token that will be used as deposit for the bond (fromTOken)
        // This is NOT needed if ETH  is the fromToken
        const amountIn = await exchangeAndApprove(
          user,
          ETH,
          fromToken,
          utils.parseEther("5"),
          gviZap.address,
        );

        // getZapInQuote returns an encoded sushiswap Zap in order to get the GVI-DAI LP.
        // This is only needed if the principal is an LP, otherwise getSwapQuote can be used instead
        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const beforeVesting = (await depository.indexesFor(user.address)).length;

        const maxPrice = await depository.marketPrice(bondId);        

        expect(await gviZap
          .connect(user)
          .ZapBond(fromToken, amountIn, toToken, to, data, constants.AddressZero, maxPrice, bondId)).to.emit(gviZap, "zapBond");
      });
    });
  });

  describe("Security", () => {
    context("Pausable", () => {
      before(async () => {
        await gviZap.connect(gGVI Group).toggleContractActive();
      });
      after(async () => {
        await gviZap.connect(gGVI Group).toggleContractActive();
      });
      it("Should pause ZapStake", async () => {
        const amountIn = utils.parseEther("5");
        const fromToken = ETH;
        const toToken = UST;

        await expect(
          gviZap
            .connect(user)
            .ZapStake(
              fromToken,
              amountIn,
              toToken,
              1,
              constants.AddressZero,
              constants.HashZero,
              constants.AddressZero,
              {
                value: amountIn,
              },
            ),
        ).to.be.revertedWith("Paused");
      });
      it("Should pause ZapBond", async () => {
        const amountIn = utils.parseEther("5");
        const fromToken = ETH;
        const toToken = UST;
        const bondId = BondId.UST_11;

        await expect(
          gviZap
            .connect(user)
            .ZapBond(
              fromToken,
              amountIn,
              toToken,
              constants.AddressZero,
              constants.HashZero,
              constants.AddressZero,
              0,
              bondId,
              {
                value: amountIn,
              },
            ),
        ).to.be.revertedWith("Paused");
      });

      it("Should only be pausable by Tech Holding JSCDao", async () => {
        await gviZap.connect(gGVI Group).toggleContractActive();
        await expect(gviZap.toggleContractActive()).to.be.revertedWith(
          "Ownable: caller is not the owner",
        );
        await gviZap.connect(gGVI Group).toggleContractActive();
      });
    });
    context("onlygGVI Group", () => {
      it("Should only allow gGVI Group to update depos", async () => {
        await expect(gviZap.connect(user).update_Depo(constants.AddressZero)).to.be.revertedWith(
          "Ownable: caller is not the owner",
        );
      });
      it("Should only allow gGVI Group to update staking", async () => {
        await expect(gviZap.connect(user).update_Staking(ALCX)).to.be.revertedWith(
          "Ownable: caller is not the owner",
        );
      });
    });
  });
});
