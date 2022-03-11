require('babel-register');
require('babel-polyfill');
const HDWalletProvider = require("@truffle/hdwallet-provider");

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*" // Match any network id
    },
    kovan: {
      provider: function() {
        return new HDWalletProvider(
          //private keys array
          ['63edd67ce560d4f3e2d87b6f0406dc43edd96fa81d719c41a4e953707cee99e5'],
          //url to ethereum node
          'https://kovan.infura.io/v3/5b4410729fdb4e9bb45392faa47b77bc'
        )
      },
      gas: 5000000,
      gasPrice: 25000000000,
      network_id: 42
    },
  },
  contracts_directory: './src/contracts/',
  contracts_build_directory: './src/abis/',
  compilers: {
    solc: {
      optimizer: {
        enabled: true,
        runs: 200
      }
    }
  }
}
