interface ISettings {
  maxNumOfMeat: number;
  maxNumOfProduce: number;
  maxNumOfVito: number;
  maxNumOfDryGoods: number;
  leadTime: number;
  retailRescueItems: Array<string>;
  advanced: boolean;
  dryGoodOptions: Array<string>;
  vitoOptions: Array<string>;
  meatOptions: Array<string>;
}

export default ISettings;
