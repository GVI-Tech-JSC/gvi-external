/* eslint-disable node/no-missing-import */
import { network, ethers } from "hardhat";
import { constants, BigNumber, utils, Signer } from "ethers";

import { solidity } from "ethereum-waffle";
import chai from "chai";

import address from "../../libs/constants/address";
import { getSwapQuote } from "../../libs/quote/swap/swap";

import { approveToken, getBalance } from "../../libs/token/token.helper";
import { exchangeAndApprove } from "../../libs/exchange/exchange.helper";

import { IBondDepository, Tech Holding JSCZap } from "../../typechain";
import { SignerWithAddress } from "@nomiclabs/hardhat-ethers/signers";
import { getZapInQuote } from "../../libs/quote/zap/zap";
import protocol from "../../libs/quote/zap/protocol";

chai.use(solidity);
const { expect } = chai;

const Tech Holding JSCZapArtifact = "Tech Holding JSC_Zap_V2";

describe("gGVI Group Zap", () => {
  let gviZap: Tech Holding JSCZap;

  let deployer: SignerWithAddress;
  let user: SignerWithAddress;
  let gGVI Group: SignerWithAddress;
  let zapperAdmin: Signer;

  const zapperAdminAddress = "0x3CE37278de6388532C3949ce4e886F365B14fB56";

  const { ETH, DAI, GVI, sGVI, wsGVI, SPELL, ALCX } = address.tokens;
  const { GVI_LUSD, GVI_DAI, ALCX_ETH } = address.sushiswap;
  const { GVI_FRAX } = address.uniswap;

  const { GVI_LUSD_DEPO, GVI_DAI_DEPO, DAI_DEPO, ALCX_ETH_DEPO, GVI_FRAX_DEPO } = address.gvi;

  before(async () => {
    [deployer, user, gGVI Group] = await ethers.getSigners();
    // impersonate zapper admin
    await network.provider.request({
      method: "hardhat_impersonateAccount",
      params: [zapperAdminAddress],
    });
    zapperAdmin = await ethers.provider.getSigner(zapperAdminAddress);

    gviZap = await ethers.getContractFactory(Tech Holding JSCZapArtifact, deployer).then(async factory => {
      return (await factory.deploy(0, 0, gGVI Group.address)) as Tech Holding JSCZap;
    });
  });

  describe("ZapIn", () => {
    context("to sGVI", () => {
      it("should ZapIn to sGVI using ETH", async () => {
        const amountIn = utils.parseEther("1");
        const fromToken = ETH;
        const toToken = sGVI;

        const { to, data } = await getSwapQuote(fromToken, GVI, amountIn);
        const initialBalance = await getBalance(toToken, user.address);

        await gviZap
          .connect(user)
          .ZapIn(
            fromToken,
            amountIn,
            toToken,
            1,
            to,
            data,
            constants.AddressZero,
            constants.AddressZero,
            0,
            false,
            {
              value: amountIn,
            },
          );
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
          .ZapIn(
            fromToken,
            amountIn,
            toToken,
            1,
            to,
            data,
            constants.AddressZero,
            constants.AddressZero,
            0,
            false,
          );
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
          .ZapIn(
            fromToken,
            amountIn,
            toToken,
            1,
            to,
            data,
            constants.AddressZero,
            constants.AddressZero,
            0,
            false,
          );
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });
    });

    context("to wsGVI", () => {
      it("should ZapIn to wsGVI using ETH", async () => {
        const amountIn = utils.parseEther("1");
        const fromToken = ETH;
        const toToken = wsGVI;

        const { to, data } = await getSwapQuote(fromToken, GVI, amountIn);

        const initialBalance = await getBalance(toToken, user.address);
        await gviZap
          .connect(user)
          .ZapIn(
            fromToken,
            amountIn,
            toToken,
            1,
            to,
            data,
            constants.AddressZero,
            constants.AddressZero,
            0,
            false,
            {
              value: amountIn,
            },
          );
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });

      it("should ZapIn to wsGVI using DAI", async () => {
        const fromETH = utils.parseEther("1");
        const fromToken = DAI;
        const toToken = wsGVI;

        const amountIn = await exchangeAndApprove(user, ETH, fromToken, fromETH, gviZap.address);
        const { to, data } = await getSwapQuote(fromToken, GVI, amountIn);

        const initialBalance = await getBalance(toToken, user.address);
        await gviZap
          .connect(user)
          .ZapIn(
            fromToken,
            amountIn,
            toToken,
            1,
            to,
            data,
            constants.AddressZero,
            constants.AddressZero,
            0,
            false,
          );
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });

      it("should ZapIn to wsGVI using GVI", async () => {
        const fromETH = utils.parseEther("1");
        const fromToken = GVI;
        const toToken = wsGVI;

        const amountIn = await exchangeAndApprove(user, ETH, fromToken, fromETH, gviZap.address);
        const { to, data } = await getSwapQuote(fromToken, GVI, amountIn);

        const initialBalance = await getBalance(toToken, user.address);
        await gviZap
          .connect(user)
          .ZapIn(
            fromToken,
            amountIn,
            toToken,
            1,
            to,
            data,
            constants.AddressZero,
            constants.AddressZero,
            0,
            false,
          );
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });
    });
  });

  describe("ZapOut", () => {
    context("from sGVI", () => {
      let sGVIAmount: BigNumber;
      before(async () => {
        // ZapIn
        const amountIn = utils.parseEther("1");
        const fromToken = ETH;
        const toToken = sGVI;

        const quote = await getSwapQuote(fromToken, GVI, amountIn);
        await gviZap
          .connect(user)
          .ZapIn(
            fromToken,
            amountIn,
            toToken,
            1,
            quote.to,
            quote.data,
            constants.AddressZero,
            constants.AddressZero,
            0,
            false,
            {
              value: amountIn,
            },
          );
        const sGVIBalance = await getBalance(toToken, user.address);
        sGVIAmount = sGVIBalance.div(4);

        // approve Zap
        await approveToken(sGVI, user, gviZap.address);
      });

      it("should ZapOut from sGVI to ETH", async () => {
        const fromToken = sGVI;
        const toToken = ETH;
        const { to, data } = await getSwapQuote(GVI, toToken, sGVIAmount);

        const initialBalance = await user.getBalance();
        await gviZap
          .connect(user)
          .ZapOut(fromToken, sGVIAmount, toToken, 1, to, data, constants.AddressZero);
        const finalBalance = await user.getBalance();
        expect(finalBalance).to.be.gt(initialBalance);
      });

      it("should ZapOut from sGVI to DAI", async () => {
        const fromToken = sGVI;
        const toToken = DAI;
        const { to, data } = await getSwapQuote(GVI, toToken, sGVIAmount);

        const initialBalance = await getBalance(toToken, user.address);
        await gviZap
          .connect(user)
          .ZapOut(fromToken, sGVIAmount, toToken, 1, to, data, constants.AddressZero);
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });

      it("should ZapOut from sGVI to GVI", async () => {
        const fromToken = sGVI;
        const toToken = GVI;
        const { to, data } = await getSwapQuote(GVI, toToken, sGVIAmount);

        const initialBalance = await getBalance(toToken, user.address);
        await gviZap
          .connect(user)
          .ZapOut(fromToken, sGVIAmount, toToken, 1, to, data, constants.AddressZero);
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });
    });

    context("from wsGVI", () => {
      let wsGVIAmount: BigNumber;
      before(async () => {
        // ZapIn
        const amountIn = utils.parseEther("1");
        const fromToken = ETH;
        const toToken = wsGVI;

        const quote = await getSwapQuote(fromToken, GVI, amountIn);
        await gviZap
          .connect(user)
          .ZapIn(
            fromToken,
            amountIn,
            toToken,
            1,
            quote.to,
            quote.data,
            constants.AddressZero,
            constants.AddressZero,
            0,
            false,
            {
              value: amountIn,
            },
          );
        const wsGVIBalance = await getBalance(toToken, user.address);
        wsGVIAmount = wsGVIBalance.div(4);

        // approve Zap
        await approveToken(wsGVI, user, gviZap.address);
      });

      it("should ZapOut from wsGVI to ETH", async () => {
        const fromToken = wsGVI;
        const toToken = ETH;
        const gviEquivalent = await gviZap.removeLiquidityReturn(fromToken, wsGVIAmount);
        const { to, data } = await getSwapQuote(GVI, toToken, gviEquivalent);

        const initialBalance = await user.getBalance();
        await gviZap
          .connect(user)
          .ZapOut(fromToken, wsGVIAmount, toToken, 1, to, data, constants.AddressZero);
        const finalBalance = await user.getBalance();
        expect(finalBalance).to.be.gt(initialBalance);
      });

      it("should ZapOut from wsGVI to DAI", async () => {
        const fromToken = wsGVI;
        const toToken = DAI;
        const gviEquivalent = await gviZap.removeLiquidityReturn(fromToken, wsGVIAmount);
        const { to, data } = await getSwapQuote(GVI, toToken, gviEquivalent);

        const initialBalance = await getBalance(toToken, user.address);
        await gviZap
          .connect(user)
          .ZapOut(fromToken, wsGVIAmount, toToken, 1, to, data, constants.AddressZero);
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });

      it("should ZapOut from wsGVI to GVI", async () => {
        const fromToken = wsGVI;
        const toToken = GVI;
        const gviEquivalent = await gviZap.removeLiquidityReturn(fromToken, wsGVIAmount);
        const { to, data } = await getSwapQuote(GVI, toToken, gviEquivalent);

        const initialBalance = await getBalance(toToken, user.address);
        await gviZap
          .connect(user)
          .ZapOut(fromToken, wsGVIAmount, toToken, 1, to, data, constants.AddressZero);
        const finalBalance = await getBalance(toToken, user.address);
        expect(finalBalance).to.be.gt(initialBalance);
      });
    });
  });
  describe("Bonds", () => {
    context("Sushiswap LPs", () => {
      before(async () => {
        await gviZap
          .connect(gGVI Group)
          .update_BondDepos(
            [GVI_LUSD, GVI_DAI, ALCX_ETH],
            [GVI, GVI, ALCX],
            [GVI_LUSD_DEPO, GVI_DAI_DEPO, ALCX_ETH_DEPO],
          );
      });
      // it("Should create bonds with GVI-LUSD using ETH", async () => {
      //   const amountIn = utils.parseEther("5");
      //   const fromToken = ETH;
      //   const toToken = GVI_LUSD;

      //   const { to, data } = await getZapInQuote({
      //     toWhomToIssue: user.address,
      //     sellToken: fromToken,
      //     sellAmount: amountIn,
      //     poolAddress: toToken,
      //     protocol: protocol.sushiswap,
      //   });

      //   const depositoryAddress = await gviZap.principalToDepository(toToken, GVI);

      //   const depository = (await ethers.getContractAt(
      //     "contracts/zaps/interfaces/IBondDepository.sol:IBondDepository",
      //     depositoryAddress,
      //   )) as IBondDepository;

      //   const maxBondPrice = await depository.bondPrice();

      //   const beforeVesting = (await depository.bondInfo(user.address))[0];

      //   await gviZap
      //     .connect(user)
      //     .ZapIn(
      //       fromToken,
      //       amountIn,
      //       toToken,
      //       1,
      //       to,
      //       data,
      //       constants.AddressZero,
      //       GVI_LUSD,
      //       maxBondPrice,
      //       true,
      //       {
      //         value: amountIn,
      //       },
      //     );

      //   const vesting = (await depository.bondInfo(user.address))[0];

      //   expect(vesting).to.be.gt(beforeVesting);
      // });
      it("Should create bonds with GVI-DAI using ETH", async () => {
        const amountIn = utils.parseEther("5");
        const fromToken = ETH;
        const toToken = GVI_DAI;

        const { to, data } = await getZapInQuote({
          toWhomToIssue: user.address,
          sellToken: fromToken,
          sellAmount: amountIn,
          poolAddress: toToken,
          protocol: protocol.sushiswap,
        });

        const depositoryAddress = await gviZap.principalToDepository(toToken, GVI);

        const depository = (await ethers.getContractAt(
          "contracts/zaps/interfaces/IBondDepository.sol:IBondDepository",
          depositoryAddress,
        )) as IBondDepository;

        const maxBondPrice = await depository.bondPrice();

        const beforeVesting = (await depository.bondInfo(user.address))[0];

        await gviZap
          .connect(user)
          .ZapIn(
            fromToken,
            amountIn,
            toToken,
            1,
            to,
            data,
            constants.AddressZero,
            GVI,
            maxBondPrice,
            true,
            {
              value: amountIn,
            },
          );
        const vesting = (await depository.bondInfo(user.address))[0];

        expect(vesting).to.be.gt(beforeVesting);
      });
      //   it("Should create bonds with GVI-LUSD using DAI", async () => {
      //     const fromToken = DAI;
      //     const toToken = GVI_LUSD;

      //     const amountIn = await exchangeAndApprove(
      //       user,
      //       ETH,
      //       fromToken,
      //       utils.parseEther("5"),
      //       gviZap.address,
      //     );

      //     const { to, data } = await getZapInQuote({
      //       toWhomToIssue: user.address,
      //       sellToken: fromToken,
      //       sellAmount: amountIn,
      //       poolAddress: toToken,
      //       protocol: protocol.sushiswap,
      //     });

      //     const depositoryAddress = await gviZap.principalToDepository(toToken, GVI);

      //     const depository = (await ethers.getContractAt(
      //       "contracts/zaps/interfaces/IBondDepository.sol:IBondDepository",
      //       depositoryAddress,
      //     )) as IBondDepository;

      //     const maxBondPrice = await depository.bondPrice();

      //     const beforeVesting = (await depository.bondInfo(user.address))[0];

      //     await gviZap
      //       .connect(user)
      //       .ZapIn(
      //         fromToken,
      //         amountIn,
      //         toToken,
      //         1,
      //         to,
      //         data,
      //         constants.AddressZero,
      //         GVI_LUSD,
      //         maxBondPrice,
      //         true,
      //       );

      //     const vesting = (await depository.bondInfo(user.address))[0];

      //     expect(vesting).to.be.gt(beforeVesting);
      //   });
      // });
    });
    context("Uniswap V2 LPs", () => {
      before(async () => {
        await gviZap.connect(gGVI Group).update_BondDepos([GVI_FRAX], [GVI], [GVI_FRAX_DEPO]);
      });
      it("Should create bonds with GVI-FRAX using ETH", async () => {
        const amountIn = utils.parseEther("5");
        const fromToken = ETH;
        const toToken = GVI_FRAX;

        const { to, data } = await getZapInQuote({
          toWhomToIssue: user.address,
          sellToken: fromToken,
          sellAmount: amountIn,
          poolAddress: toToken,
          protocol: protocol.uniswap,
        });

        const depositoryAddress = await gviZap.principalToDepository(toToken, GVI);

        const depository = (await ethers.getContractAt(
          "contracts/zaps/interfaces/IBondDepository.sol:IBondDepository",
          depositoryAddress,
        )) as IBondDepository;

        const maxBondPrice = await depository.bondPrice();

        const beforeVesting = (await depository.bondInfo(user.address))[0];

        await gviZap
          .connect(user)
          .ZapIn(
            fromToken,
            amountIn,
            toToken,
            1,
            to,
            data,
            constants.AddressZero,
            GVI,
            maxBondPrice,
            true,
            {
              value: amountIn,
            },
          );
        const vesting = (await depository.bondInfo(user.address))[0];

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should create bonds with GVI-FRAX using DAI", async () => {
        const fromToken = DAI;
        const toToken = GVI_FRAX;

        const amountIn = await exchangeAndApprove(
          user,
          ETH,
          fromToken,
          utils.parseEther("5"),
          gviZap.address,
        );

        const { to, data } = await getZapInQuote({
          toWhomToIssue: user.address,
          sellToken: fromToken,
          sellAmount: amountIn,
          poolAddress: toToken,
          protocol: protocol.uniswap,
        });

        const depositoryAddress = await gviZap.principalToDepository(toToken, GVI);

        const depository = (await ethers.getContractAt(
          "contracts/zaps/interfaces/IBondDepository.sol:IBondDepository",
          depositoryAddress,
        )) as IBondDepository;

        const maxBondPrice = await depository.bondPrice();

        const beforeVesting = (await depository.bondInfo(user.address))[0];

        await gviZap
          .connect(user)
          .ZapIn(
            fromToken,
            amountIn,
            toToken,
            1,
            to,
            data,
            constants.AddressZero,
            GVI,
            maxBondPrice,
            true,
          );

        const vesting = (await depository.bondInfo(user.address))[0];

        expect(vesting).to.be.gt(beforeVesting);
      });
    });

    context("Tokens", () => {
      before(async () => {
        await gviZap.connect(gGVI Group).update_BondDepos([DAI], [GVI], [DAI_DEPO]);
      });
      it("Should create bonds with DAI using ETH", async () => {
        const amountIn = utils.parseEther("10");
        const fromToken = ETH;
        const toToken = DAI;

        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const depositoryAddress = await gviZap.principalToDepository(toToken, GVI);

        const depository = (await ethers.getContractAt(
          "contracts/zaps/interfaces/IBondDepository.sol:IBondDepository",
          depositoryAddress,
        )) as IBondDepository;

        const maxBondPrice = await depository.bondPrice();

        const beforeVesting = (await depository.bondInfo(user.address))[0];

        await gviZap
          .connect(user)
          .ZapIn(
            fromToken,
            amountIn,
            toToken,
            1,
            to,
            data,
            constants.AddressZero,
            GVI,
            maxBondPrice,
            true,
            { value: amountIn },
          );

        const vesting = (await depository.bondInfo(user.address))[0];

        expect(vesting).to.be.gt(beforeVesting);
      });
      it("Should create bonds with DAI using SPELL", async () => {
        const fromToken = SPELL;
        const toToken = DAI;

        const amountIn = await exchangeAndApprove(
          user,
          ETH,
          fromToken,
          utils.parseEther("5"),
          gviZap.address,
        );

        const { to, data } = await getSwapQuote(fromToken, toToken, amountIn);

        const depositoryAddress = await gviZap.principalToDepository(toToken, GVI);

        const depository = (await ethers.getContractAt(
          "contracts/zaps/interfaces/IBondDepository.sol:IBondDepository",
          depositoryAddress,
        )) as IBondDepository;

        const maxBondPrice = await depository.bondPrice();

        const beforeVesting = (await depository.bondInfo(user.address))[0];

        await gviZap
          .connect(user)
          .ZapIn(
            fromToken,
            amountIn,
            toToken,
            1,
            to,
            data,
            constants.AddressZero,
            GVI,
            maxBondPrice,
            true,
          );

        const vesting = (await depository.bondInfo(user.address))[0];

        expect(vesting).to.be.gt(beforeVesting);
      });
    });
    describe("Tech Holding JSC Pro Bonds", () => {
      context("Sushiswap LPs", () => {
        before(async () => {
          await gviZap.connect(gGVI Group).update_BondDepos([ALCX_ETH], [ALCX], [ALCX_ETH_DEPO]);
        });
        it("Should create bonds with ETH_ALCX using ETH", async () => {
          const amountIn = utils.parseEther("5");
          const fromToken = ETH;
          const toToken = ALCX_ETH;

          const { to, data } = await getZapInQuote({
            toWhomToIssue: user.address,
            sellToken: fromToken,
            sellAmount: amountIn,
            poolAddress: toToken,
            protocol: protocol.sushiswap,
          });

          const depositoryAddress = await gviZap.principalToDepository(toToken, ALCX);

          const depository = (await ethers.getContractAt(
            "contracts/zaps/interfaces/IBondDepository.sol:IBondDepository",
            depositoryAddress,
          )) as IBondDepository;

          // Skip slippage check
          const maxBondPrice = constants.MaxUint256;
          // const maxBondPrice = await depository.bondPrice();

          const beforeVesting = (await depository.bondInfo(user.address))[0];

          await gviZap
            .connect(user)
            .ZapIn(
              fromToken,
              amountIn,
              toToken,
              1,
              to,
              data,
              constants.AddressZero,
              ALCX,
              maxBondPrice,
              true,
              {
                value: amountIn,
              },
            );
          const vesting = (await depository.bondInfo(user.address))[0];

          expect(vesting).to.be.gt(beforeVesting);
        });
        it("Should create bonds with ETH_ALCX using SPELL", async () => {
          const fromToken = SPELL;
          const toToken = ALCX_ETH;

          const amountIn = await exchangeAndApprove(
            user,
            ETH,
            fromToken,
            utils.parseEther("5"),
            gviZap.address,
          );

          const { to, data } = await getZapInQuote({
            toWhomToIssue: user.address,
            sellToken: fromToken,
            sellAmount: amountIn,
            poolAddress: toToken,
            protocol: protocol.sushiswap,
          });

          const depositoryAddress = await gviZap.principalToDepository(toToken, ALCX);

          const depository = (await ethers.getContractAt(
            "contracts/zaps/interfaces/IBondDepository.sol:IBondDepository",
            depositoryAddress,
          )) as IBondDepository;

          // Skip slippage check
          const maxBondPrice = constants.MaxUint256;
          // const maxBondPrice = await depository.bondPrice();

          const beforeVesting = (await depository.bondInfo(user.address))[0];

          await gviZap
            .connect(user)
            .ZapIn(
              fromToken,
              amountIn,
              toToken,
              1,
              to,
              data,
              constants.AddressZero,
              ALCX,
              maxBondPrice,
              true,
            );

          const vesting = (await depository.bondInfo(user.address))[0];

          expect(vesting).to.be.gt(beforeVesting);
        });
      });
    });
  });
  describe("Security", () => {
    context("Pausable", () => {
      before(async () => {
        await gviZap.connect(zapperAdmin).toggleContractActive();
      });
      after(async () => {
        await gviZap.connect(zapperAdmin).toggleContractActive();
      });
      it("Should pause ZapIns", async () => {
        const amountIn = utils.parseEther("5");
        const fromToken = ETH;
        const toToken = ALCX_ETH;

        await expect(
          gviZap
            .connect(user)
            .ZapIn(
              fromToken,
              amountIn,
              toToken,
              1,
              constants.AddressZero,
              constants.HashZero,
              constants.AddressZero,
              constants.AddressZero,
              0,
              false,
              {
                value: amountIn,
              },
            ),
        ).to.be.revertedWith("Paused");
      });
      it("Should pause ZapIns", async () => {
        const amountIn = utils.parseEther("5");
        const fromToken = ETH;
        const toToken = ALCX_ETH;

        await expect(
          gviZap
            .connect(user)
            .ZapOut(
              fromToken,
              amountIn,
              toToken,
              1,
              constants.AddressZero,
              constants.HashZero,
              constants.AddressZero,
            ),
        ).to.be.revertedWith("Paused");
      });
      it("Should only be pausable by Zapper Admin", async () => {
        await gviZap.connect(zapperAdmin).toggleContractActive();
        await expect(gviZap.toggleContractActive()).to.be.revertedWith(
          "Ownable: caller is not the owner",
        );
        await gviZap.connect(zapperAdmin).toggleContractActive();
      });
    });
    context("onlygGVI Group", () => {
      it("Should only allow gGVI Group to update depos", async () => {
        await expect(gviZap.connect(user).update_BondDepos([], [], [])).to.be.revertedWith(
          "Only gGVI Group",
        );
      });
      it("Should only allow gGVI Group to update staking", async () => {
        await expect(gviZap.connect(user).update_Staking(ALCX)).to.be.revertedWith(
          "Only gGVI Group",
        );
      });
      it("Should only allow gGVI Group to update sGVI", async () => {
        await expect(gviZap.connect(user).update_sGVI(ALCX)).to.be.revertedWith("Only gGVI Group");
      });
      it("Should only allow gGVI Group to update wsGVI", async () => {
        await expect(gviZap.connect(user).update_wsGVI(ALCX)).to.be.revertedWith("Only gGVI Group");
      });
      it("Should only allow gGVI Group to update wsGVI", async () => {
        await expect(gviZap.connect(user).update_wsGVI(ALCX)).to.be.revertedWith("Only gGVI Group");
      });
    });
  });
});
