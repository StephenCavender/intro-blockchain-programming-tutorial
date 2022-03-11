import React, { Component } from 'react';
// import Web3 from 'web3';

class Main extends Component {
  // web3 = new Web3()

  render() {
    return (
      <div id="content">
        <h1>Add Product</h1>
        <form onSubmit={(event) => {
          event.preventDefault()
          const name = this.productName.value
          // const price = this.web3.utils.toWei(this.productPrice.value.toString(), 'Ether')
          const price = String(this.productPrice.value * 10 ** 18)
          this.props.createProduct(name, price)
        }}>
          <div className="form-group mr-sm-2">
            <input
              id="productName"
              type="text"
              ref={(input) => { this.productName = input }}
              className="form-control"
              placeholder="Product Name"
              required />
          </div>
          <div className="form-group mr-sm-2">
            <input
              id="productPrice"
              type="text"
              ref={(input) => { this.productPrice = input }}
              className="form-control"
              placeholder="Product Price (Ether)"
              required />
          </div>
          <button type="submit" className="btn btn-primary">Add Product</button>
        </form>
        <p> </p>
        <h2>Buy Product</h2>
        <table className="table">
          <thead>
            <tr>
              <th scope="col">#</th>
              <th scope="col">Name</th>
              <th scope="col">Price</th>
              <th scope="col">Owner</th>
              <th scope="col"></th>
            </tr>
          </thead>
          <tbody id="productList">
            { this.props.products.map((product, key) => {
              const isOwner = product.owner.toLowerCase() === this.props.account.toLowerCase()

              return(
                <tr key={key}>
                  <th scope="row">{product.id.toString()}</th>
                  <td>{product.name}</td>
                  {/* <td>{this.web3.utils.fromWei(product.price.toString(), 'Ether')} Eth</td> */}
                  <td>{product.price / (10 ** 18)} Eth</td>
                  <td>{product.owner}{isOwner && " (YOU!)"}</td>
                  <td>
                    { product.purchased || isOwner
                      ? null
                      : <button
                        className='btn btn-secondary'
                        onClick={() => this.props.purchaseProduct(product.id, product.price)}>Buy</button>
                    }
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    );
  }
}

export default Main;
