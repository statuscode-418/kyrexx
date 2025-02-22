
import { http, createConfig } from 'wagmi'
import { mainnet, polygonAmoy } from 'wagmi/chains'
import { injected } from 'wagmi/connectors'
export const transactionConfig = createConfig({

  chains: [mainnet, polygonAmoy],
  transports: {
    connectors: [injected()],
    [mainnet.id]: http(),
    [polygonAmoy.id]: http(),
  },
})
