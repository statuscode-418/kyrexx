

import { createConfig } from "ponder";
import { http } from "viem";
import { AppealContract } from "./abis/AppealContract";

export default createConfig({
  //  database: {
  //   kind: "postgres",
  //   connectionString: process.env.DATABASE_URL
  // },
  networks: {
    amoy: {
      chainId: 80002,
      transport: http(process.env.RPC_URL)
    }
  },
  contracts: {
    AppealContract: {
      network: "amoy",
      abi: AppealContract,
      address: "0x900730EA2C10d31f9C8311c0A661aBB9cA09214E",
      startBlock: 0,
    },
  },
});
