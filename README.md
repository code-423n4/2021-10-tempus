# Tempus Finance contest details
- $47,500 USDC main award pot
- $2,500 USDC gas optimization award pot
- Join [C4 Discord](https://discord.gg/EY5dvm3evD) to register
- Submit findings [using the C4 form](https://code423n4.com/2021-10-tempus-finance-contest/submit)
- [Read our guidelines for more details](https://docs.code4rena.com/roles/wardens)
- Starts October 14, 2021 00:00 UTC
- Ends October 20, 2021 23:59 UTC

This repo will be made public before the start of the contest. (C4 delete this line when made public)

| Glossary| |
|-------------------------------|------------------------------------------------------|
| Backing token| Any token that can be deposited to earn some interest via landing or staking. Currently we support ETH, DAI, and USDC |
| YBT Yield bearing token| Landing or staking token, currently we support stETH, aTokens (aDAI, aUSDC), and cTokens (cDAI, cUSDC) |
| TempusPool| Holds all locked YieldBearingToken, and is used to mint Principals and Yields on deposits, and to burn them on redemption in exchange for YieldBearingToken |
| Principals| Zero coupon bond redeemable for 1 Backing token after maturity |
| Yields| Zero-coupon bond redeemable to BackingTokens after maturity for amount of yield accrued during the lifetime of the pool. Example: 10% yield would exchange 0.1 BackingToken for each Yield share |
| Tempus AMM| Tempus AMM implementation based on Stable Pools from Balancer v2. It is used for trading Principals against Yields |
| LP token| Token that represent share in Tempus AMM. Users get this token when they provide liquidity with Principals and Yields |
| Tempus Controller| Entry point to protocol. Used for all user-facing actions related to Tempus Pool. Only TempusController singleton is allowed to operate on a TempusPool. |

# Contest Scope
This contest is open for one week. Submissions are open from the beginning until the end. Representatives from Tempus will be available in the Code Arena Discord to answer any questions during the contest period. The focus of the contest is to try and find any logic errors or ways to drain funds from the protocol in a way that is advantageous for an attacker at the expense of users with funds invested in the protocol. Gas optimization suggestions are also welcome.

## Protocol overview
Tempus is a future yield tokenization and fixed rate protocol.
Most forms of yield farming return a variable rate of yield. This means that liquidity providers can be subject to unpredictable fluctuations in their returns.
Currently, there is no easy way to obtain a fixed yield or otherwise speculate on the returns in a capital-efficient way. This is where Tempus steps in, allowing users to perform two different use cases, each one offering a unique value proposition:
- Buy and sell interest rate protection using any supported Yield Bearing Token (such as stETH, cDai and others).
- Earn swap fees as a liquidity provider by depositing any supported Yield Bearing Token (thus earning additional yield on top of yield earned through other yield farming protocols).

Users can deposit Backing Tokens or Yield Bearing Tokens to mint equal amounts of Principals and Yields. More information can be found in [deposit docs](https://docs.tempus.finance/docs/tempuspool/deposit).

Redemption has two different flows:
- Early redemption (this is possible only with equal amount of Principals and Yields)
- Mature redemption (user can deposit any combination of Principals and Yields after maturity)
Users can redeem their funds into either Backing Tokens or Yield Bearing Tokens. You can find more in [redemption docs](https://docs.tempus.finance/docs/tempuspool/redemption).

All swaps between Principals and Yields are done via Tempus AMM. Information about our AMM can be found in [TempusAMM docs](https://docs.tempus.finance/docs/tempusamm) or in our [blog post](https://medium.com/tempusfinance/diving-into-tempus-amm-23a92cc6a2fc) about it.

## Smart contracts
All smart contracts are located in `contracts/` directory. However, we added mocked implementations of underlying landing/staking protocols (Lido, Aave, and Compound). These mocks are not in focus for this contest, as they are only used for unit testing of the underlying protocols. You can find these mocks in `contracts/mocks/`.
Unit tests are located in `test` directory.

### TempusController
Tempus controller is used as a main entry point for all protocol related actions. It implements all batching actions as well (For example `depositAndFix`). Contract is implemented in `TempusController.sol`.

### Pools
We have shared abstract implementation for concrete Tempus pools. Abstract TempusPool is implemented in `TempusPool.sol`.
For now we implemented 3 different concrete pools integrating with Aave, Compound, and Lido:
- `pools/AaveTempusPool.sol`
- `pools/CompoundTempusPool.sol`
- `pools/LidoTempusPool.sol`

### Tokens
PoolShare is base contract for Principals and Yields. PrincipalShare and YieldShare are actual implementations for Principals and Yields. We have also two helper token implementations for fixed supply and owner mintable tokens. Here is a list of all tokens that we want to audit:
- `token/PoolShare.sol`
- `token/PrincipalShare.sol`
- `token/YieldShare.sol`
- `token/ERC20FixedSupply.sol`
- `token/ERC20OwnerMintableToken.sol`

### Utils
We have few utility contracts/libraries:
- `utils/AMMBalancesHelper.sol` (does some ratio calculations for amm balances)
- `utils/PermanentlyOwnable.sol` (Ownable without possibility to change ownership)
- `utils/UntrustedERC20.sol` (we use this for transfers of external tokens)
- `math/Fixed256xVar.sol` (fixed point math implementation for variable amount of decimals)

### TempusAMM
Tempus AMM is implemented as modification of Balancer Stable Pool. We use Balancer's Vault contracts for our deployments.
- `amm/TempusAMM.sol`
- `amm/TempusAMMUserDataHelpers.sol`
- `amm/VecMath.sol`

Contracts in `protocols` directory are only interfaces from underlying protocols.

## Performed Audits
We did a security Audit with Coinspect, and full report is available [here](https://www.coinspect.com/doc/Coinspect%20-%20Smart%20Contract%20Audit%20-%20Tempus%20v211013.pdf).

## Setting up and running unit tests
Installing dependancies `yarn install`
To compile run `yarn build`
To run the unit tests `yarn test`

## Learn more about Tempus
[Website](tempus.finance)
[Medium](medium.tempus.finance)
[Discord](discord.tempus.finance)
[Twitter](twitter.tempus.finance)
[GitHub](github.tempus.finance)
[Docs](docs.tempus.finance)