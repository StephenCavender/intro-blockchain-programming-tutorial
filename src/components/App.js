import React, { Component } from 'react';
import logo from '../logo.png';
import Marketplace from '../abis/Marketplace.json'
import Web3 from 'web3';
import Navbar from './Navbar/Navbar'
import './App.css';

class App extends Component {

  async componentDidMount() {
    // await this.loadWeb3()
    // console.log(window.web3)
    await this.loadBlockchainData()
  }

  // Old way of loading web3
  // async loadWeb3() {
  //   if (window.ethereum) {
  //     await window.ethereum.request({ method: 'eth_requestAccounts'})
  //     window.web3 = new Web3(window.ethereum)
  //   }
  // }

  async loadBlockchainData() {
    if (window.ethereum) {
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts'})
      this.setState({ account: accounts[0] })

      const web3 = new Web3(window.ethereum)
      const networkId = await web3.eth.net.getId()
      // console.log(networkId)

      const networkData = Marketplace.networks[networkId]
      if (networkData) {
        // console.log(Marketplace.abi, Marketplace.networks[5777].address);
        // const address = Marketplace.networks[networkId].address
        const marketplace = web3.eth.Contract(Marketplace.abi, networkData.address)
        // console.log(marketplace)
      } else {
        alert("Marketplace contract not deployed to the detected network")
      }

      
    }
    // Old way of loading account data
    // const web3 = window.web3
    // const accounts = await web3.eth.getAccounts()
    // // console.log(accounts)
    // this.setState({ account: accounts[0] })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '',
      productCount: 0,
      products: [],
      loading: true
    }
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex text-center">
              <div className="content mr-auto ml-auto">
                <a
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <img src={logo} className="App-logo" alt="logo" />
                </a>
                <h1>Dapp University Starter Kit</h1>
                <p>
                  Edit <code>src/components/App.js</code> and save to reload.
                </p>
                <a
                  className="App-link"
                  href="http://www.dappuniversity.com/bootcamp"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LEARN BLOCKCHAIN <u><b>NOW! </b></u>
                </a>
              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
