import { Contract } from "ethers";
import { NumberOrString } from "./Decimal";
import { ContractBase } from "./ContractBase";
import { ITestPool } from "../pool-utils/ITestPool";

export class Stats extends ContractBase {
  constructor(contract:Contract) {
    super("Stats", 18, contract);
  }

  static async create(): Promise<Stats> {
    return new Stats(await ContractBase.deployContract("Stats"));
  }

  /**
   * @param amount Amount of BackingTokens or YieldBearingTokens that would be deposited
   * @param isBackingToken If true, @param amount is in BackingTokens, otherwise YieldBearingTokens
   * @return Amount of Principals (TPS) and Yields (TYS), scaled as 1e18 decimals.
   *         TPS and TYS are minted in 1:1 ratio, hence a single return value
   */
  async estimatedMintedShares(pool:ITestPool, amount:NumberOrString, isBackingToken:boolean): Promise<NumberOrString> {
    const t = pool.tempus;
    const depositAmount = isBackingToken ? t.asset.toBigNum(amount) : t.yieldBearing.toBigNum(amount);
    return t.principalShare.fromBigNum(await this.contract.estimatedMintedShares(t.address, depositAmount, isBackingToken));
  }

  /**
   * @param principals Amount of Principals (TPS)
   * @param yields Amount of Yields (TYS)
   * @param toBackingToken If true, redeem amount is estimated in BackingTokens instead of YieldBearingTokens
   * @return YBT or BT amount
   */
  async estimatedRedeem(pool:ITestPool, principals:NumberOrString, yields:NumberOrString, toBackingToken:boolean): Promise<NumberOrString> {
    const t = pool.tempus;
    const p = toBackingToken ? t.asset : t.yieldBearing;
    return p.fromBigNum(
      await this.contract.estimatedRedeem(
        t.address,
        t.principalShare.toBigNum(principals),
        t.yieldShare.toBigNum(yields),
        toBackingToken
      )
    );
  }

  /**
   * @param principals Amount of Principals (TPS)
   * @param yields Amount of Yields (TYS)
   * @param toBackingToken If true, redeem amount is estimated in BackingTokens instead of YieldBearingTokens
   * @return YBT or BT amount
   */
  async estimatedDepositAndProvideLiquidity(
    pool:ITestPool,
    amount:NumberOrString,
    isBackingToken:boolean
  ): Promise<[NumberOrString,NumberOrString,NumberOrString]> {
    const t = pool.tempus;
    const tuple = await this.contract.estimatedDepositAndProvideLiquidity(
      pool.amm.address, isBackingToken ? t.toBigNum(amount) : t.yieldBearing.toBigNum(amount), isBackingToken
    );
    return [
      pool.amm.fromBigNum(tuple[0]),
      t.principalShare.fromBigNum(tuple[1]),
      t.yieldShare.fromBigNum(tuple[2])
    ];
  }
  
  async estimatedDepositAndFix(pool:ITestPool, amount:NumberOrString, isBackingToken:boolean): Promise<NumberOrString> {
    const t = pool.tempus;
    return t.principalShare.fromBigNum(
      await this.contract.estimatedDepositAndFix(
        pool.amm.address, isBackingToken ? t.asset.toBigNum(amount) : t.yieldBearing.toBigNum(amount), isBackingToken
      )
    );
  }

  async estimateExitAndRedeem(pool:ITestPool, lpTokens:NumberOrString, principals:NumberOrString, yields:NumberOrString, toBackingToken:boolean): Promise<NumberOrString> {
    const t = pool.tempus;
    const p = toBackingToken ? t : t.yieldBearing;
    return p.fromBigNum(
      await this.contract.estimateExitAndRedeem(
        pool.amm.address,
        pool.amm.toBigNum(lpTokens),
        t.principalShare.toBigNum(principals),
        t.yieldShare.toBigNum(yields),
        t.principalShare.decimals == 18 ? t.principalShare.toBigNum("0.00001") : t.principalShare.toBigNum("0.01"),
        toBackingToken
      )
    );
  }
}
