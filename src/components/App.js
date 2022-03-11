import React, { Component } from 'react';
import Marketplace from '../abis/Marketplace.json'
import Web3 from 'web3';
import Navbar from './Navbar/Navbar'
import Main from './Main/Main'
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

  // NOTE: web3, call methods read data, send methods send transaction

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
        const productCount = await marketplace.methods.productCount().call()
        console.log(productCount, productCount.toString())
        this.setState({ marketplace, loading: false, productCount })
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

  createProduct = (name, price) => {
    this.setState({ loading: true })
    this.state.marketplace.methods
      .createProduct(name, price)
      .send({ from: this.state.account })
      .once('receipt', receipt => {
        this.setState({ loading: false })
      })
  }

  render() {
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 d-flex">
              {
                this.state.loading
                ? <div id="loader" className="text-center"><p className='text-center'>Loading...</p></div>
                : <Main createProduct={this.createProduct} />}
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
