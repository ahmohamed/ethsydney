import "@nomicfoundation/hardhat-toolbox";
import "hardhat-tracer";
import { TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS } from "hardhat/builtin-tasks/task-names";
import { NetworkUserConfig } from "hardhat/types";
import { subtask } from "hardhat/config";

import * as dotenv from "dotenv";
import { readFileSync } from "fs";
import { resolve } from "path";
import * as toml from "toml";

// The next line is part of the sample project, you don't need it in your
// project. It imports a Hardhat task definition, that can be used for
// testing the frontend.
// require("./tasks/faucet");

dotenv.config({ path: resolve(__dirname, `./.env`) });

// Enable increased console log verbosity
export const VERBOSE: boolean = process.env.VERBOSE == `TRUE` ? true : false;

// Enable EIP-1559 gas configuration for transactions and gas reporting
export const GAS_MODE: boolean = process.env.GAS_MODE == `TRUE` ? true : false;

// Enable deployment to zkSync networks
export const ZK_EVM: boolean = process.env.ZK_EVM == `TRUE` ? true : false;

// List of supported networks
export const chainIds = {
  arbitrum: 42161,
  "arbitrum-goerli": 421613,
  avalanche: 43114,
  "avalanche-fuji": 43113,
  bsc: 56,
  goerli: 5,
  hardhat: 31337,
  mainnet: 1,
  optimism: 10,
  "optimism-goerli": 420,
  "polygon-mainnet": 137,
  "polygon-mumbai": 80001,
  "zksync-goerli": 280,
  "zksync-mainnet": 324,
};


function getChainConfig(chain: keyof typeof chainIds): NetworkUserConfig {
  let jsonRpcUrl: string;
  switch (chain) {
      case `arbitrum`:
          jsonRpcUrl = `https://arb-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
          break;
      case `arbitrum-goerli`:
          jsonRpcUrl = `https://arb-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
          break;
      case `avalanche`:
          jsonRpcUrl = `https://api.avax.network/ext/bc/C/rpc`;
          break;
      case `avalanche-fuji`:
          jsonRpcUrl = `https://api.avax-test.network/ext/bc/C/rpc`;
          break;
      case `bsc`:
          jsonRpcUrl = `https://bsc-dataseed1.binance.org`;
          break;
      case `optimism`:
          jsonRpcUrl = `https://mainnet.optimism.io`;
          break;
      case `optimism-goerli`:
          jsonRpcUrl = `https://opt-goerli.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
          break;
      case `polygon-mainnet`:
          jsonRpcUrl = `https://polygon-mainnet.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
          break;
      case `polygon-mumbai`:
          jsonRpcUrl = `https://polygon-mumbai.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`;
          break;
      case `zksync-goerli`:
          jsonRpcUrl = `https://zksync2-testnet.zksync.dev`;
          break;
      case `zksync-mainnet`:
          jsonRpcUrl = `https://zksync2-mainnet.zksync.io`;
          break;
      default:
          jsonRpcUrl = `https://eth-${chain}.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`;
  }
  return {
      accounts: {
          mnemonic: "picnic cannon emerge vague slush hover canal found actress copper jazz cinnamon depart alone jar",
          path: `m/44'/60'/0'/0`,
      },
      chainId: chainIds[chain],
      url: jsonRpcUrl,
      zksync: ZK_EVM,
  };
}

export enum UrlType {
  ADDRESS = `address`,
  TX = `tx`,
}

export function explorerUrl(chainId: number | undefined, type: UrlType, param: string): string {
  switch (chainId) {
      case chainIds.arbitrum:
          return `https://arbiscan.io/${type}/${param}`;
      case chainIds[`arbitrum-goerli`]:
          return `https://goerli.arbiscan.io/${type}/${param}`;
      case chainIds.avalanche:
          return `https://snowtrace.io/${type}/${param}`;
      case chainIds[`avalanche-fuji`]:
          return `https://testnet.snowtrace.io/${type}/${param}`;
      case chainIds.bsc:
          return `https://bscscan.com/${type}/${param}`;
      case chainIds.goerli:
          return `https://goerli.etherscan.io/${type}/${param}`;
      case chainIds.mainnet:
          return `https://etherscan.io/${type}/${param}`;
      case chainIds.optimism:
          return `https://optimistic.etherscan.io/${type}/${param}`;
      case chainIds[`optimism-goerli`]:
          return `https://goerli-optimism.etherscan.io/${type}/${param}`;
      case chainIds[`polygon-mainnet`]:
          return `https://polygonscan.com/${type}/${param}`;
      case chainIds[`polygon-mumbai`]:
          return `https://mumbai.polygonscan.com/${type}/${param}`;
      case chainIds[`zksync-goerli`]:
          return `https://goerli.explorer.zksync.io/${type}/${param}`;
      case chainIds[`zksync-mainnet`]:
          return `https://explorer.zksync.io/${type}/${param}`;
      default:
          return `https://etherscan.io/${type}/${param}`;
  }
}


const SOLC_DEFAULT: string = `0.8.20`;
// Try to use the Foundry config as a source of truth
let foundry;


try {
    foundry = toml.parse(readFileSync(`./foundry.toml`).toString());
    foundry.default.solc = foundry.default[`solc-version`]
        ? foundry.default[`solc-version`]
        : SOLC_DEFAULT;
} catch (error) {
    foundry = {
        default: {
            solc: SOLC_DEFAULT,
        },
    };
}

// Prune Forge style tests from hardhat paths
subtask(TASK_COMPILE_SOLIDITY_GET_SOURCE_PATHS).setAction(async (_, __, runSuper) => {
  const paths = await runSuper();
  return paths.filter((p: string) => !p.endsWith(`.t.sol`));
});


/** @type import('hardhat/config').HardhatUserConfig */
module.exports = {
  paths: {
    artifacts: `./artifacts`,
    cache: `./cache`,
    sources: `./contracts`,
    tests: `./integration`,
  },
  defaultNetwork: `hardhat`,
  solidity: {
    version: foundry.default?.solc || SOLC_DEFAULT,
    settings: {
        optimizer: {
            // Disable the optimizer when debugging
            // https://hardhat.org/hardhat-network/#solidity-optimizer-support
            enabled: foundry.default?.optimizer || true,
            runs: foundry.default?.optimizer_runs || 200,
            details: {
                yul: foundry.default?.optimizer_details?.yul || true,
            },
        },
        // If stack-too-deep error occurs, flip this on
        // otherwise leave off for faster builds
        viaIR: foundry.default?.via_ir || false,
    },
  },
  networks: {
    hardhat: {
        accounts: {
            mnemonic: "picnic cannon emerge vague slush hover canal found actress copper jazz cinnamon depart alone jar",
        },
        allowUnlimitedContractSize: true,
        chainId: chainIds.hardhat,
        zksync: ZK_EVM,
    },
    // arbitrum: getChainConfig(`arbitrum`),
    // "arbitrum-goerli": getChainConfig(`arbitrum-goerli`),
    // avalanche: getChainConfig(`avalanche`),
    // "avalanche-fuji": getChainConfig(`avalanche-fuji`),
    // bsc: getChainConfig(`bsc`),
    // goerli: getChainConfig(`goerli`),
    // mainnet: getChainConfig(`mainnet`),
    // optimism: getChainConfig(`optimism`),
    // "optimism-goerli": getChainConfig(`optimism-goerli`),
    // "polygon-mainnet": getChainConfig(`polygon-mainnet`),
    // "polygon-mumbai": getChainConfig(`polygon-mumbai`),
    // "zksync-goerli": getChainConfig(`zksync-goerli`),
    // "zksync-mainnet": getChainConfig(`zksync-mainnet`),
  },
};
