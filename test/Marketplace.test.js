const { assert } = require('chai');

const Marketplace = artifacts.require('./Marketplace.sol');

require('chai')
    .use(require('chai-as-promised'))
    .should()

contract('Marketplace', ([deployer, seller, buyer]) => {
    let marketplace

    before(async () => {
        marketplace = await Marketplace.deployed()
    })

    describe('deployment', async () => {
        it('deploys successfully', async () => {
            const address = await marketplace.address
            assert.notEqual(address, 0x0)
            assert.notEqual(address, '')
            assert.notEqual(address, null)
            assert.notEqual(address, undefined)
        })

        it('has a name', async () => {
            const name = await marketplace.name()
            assert.equal(name, 'Steve\'s Marketplace')
        })
    })

    describe('products', async () => {
        let result, productCount

        before(async () => {
            result = await marketplace.createProduct('iPhone 13', web3.utils.toWei('1', 'Ether'), { from: seller })
            productCount = await marketplace.productCount()
        })

        describe('create', async () => {
            it('should create valid products', async () => {
                assert.equal(productCount, 1)
                // console.log(result.logs)
                const evt = result.logs[0].args
                assert.equal(evt.id.toNumber(), productCount.toNumber(), 'id is correct')
                assert.equal(evt.name, 'iPhone 13', 'name is correct')
                assert.equal(evt.price, '1000000000000000000', 'price is correct')
                assert.equal(evt.owner, seller, 'owner is correct')
                assert.equal(evt.purchased, false, 'purchased is correct')
            })
    
            it('should reject products without a name', async () => {
                await marketplace.createProduct('', web3.utils.toWei('1', 'Ether'), { from: seller }).should.be.rejected
            })
    
            it('should reject products without a valid price', async () => {
                await marketplace.createProduct('iPhone 13 Mini', 0, { from: seller }).should.be.rejected
            })
        })

        describe('fetch', async () => {
            it('should list products', async () => {
                const product = await marketplace.products(productCount)
                assert.equal(product.id.toNumber(), productCount.toNumber(), 'id is correct')
                assert.equal(product.name, 'iPhone 13', 'name is correct')
                assert.equal(product.price, '1000000000000000000', 'price is correct')
                assert.equal(product.owner, seller, 'owner is correct')
                assert.equal(product.purchased, false, 'purchased is correct')
            })
        })

        describe('sell', async () => {
            before(async () => {
                await marketplace.createProduct('iPhone 13 Plus', web3.utils.toWei('2', 'Ether'), { from: seller })
                await marketplace.createProduct('iPhone 14', web3.utils.toWei('3', 'Ether'), { from: seller })
                productCount = await marketplace.productCount()
            })

            it('should sell product', async () => {
                result = await marketplace.purchaseProduct(2, { from: buyer, value: web3.utils.toWei('2', 'Ether') })

                const evt = result.logs[0].args
                assert.equal(evt.id.toNumber(), productCount.toNumber(), 'id is correct')
                assert.equal(evt.name, 'iPhone 13 Plus', 'name is correct')
                assert.equal(evt.price, '2000000000000000000', 'price is correct')
                assert.equal(evt.owner, buyer, 'owner is correct')
                assert.equal(evt.purchased, true, 'purchased is correct')
            })

            it('should send funds to seller', async () => {
                // convert balances/price to big number
                let oldBalance = await web3.eth.getBalance(seller)
                oldBalance = new web3.utils.BN(oldBalance)

                await marketplace.purchaseProduct(3, { from: buyer, value: web3.utils.toWei('3', 'Ether') })
                
                let newBalance = await web3.eth.getBalance(seller)
                newBalance = new web3.utils.BN(newBalance)

                let price = web3.utils.toWei('3', 'Ether')
                price = new web3.utils.BN(price)

                // console.log(oldBalance, newBalance, price)

                const expectedBalance = oldBalance.add(price)
                assert.equal(newBalance.toString(), expectedBalance.toString())
            })

            it('should fail for invalid id', async () => {
                await marketplace.purchaseProduct(99, { from: buyer, value: web3.utils.toWei('1', 'Ether') }).should.be.rejected
            })

            it('should fail if not enough ether', async () => {
                await marketplace.purchaseProduct(1, { from: buyer, value: web3.utils.toWei('0.5', 'Ether') }).should.be.rejected
            })

            it('should fail if already purchased', async () => {
                await marketplace.purchaseProduct(2, { from: deployer, value: web3.utils.toWei('2', 'Ether') }).should.be.rejected
            })

            it('should fail if buyer is seller', async () => {
                await marketplace.purchaseProduct(2, { from: buyer, value: web3.utils.toWei('2', 'Ether') }).should.be.rejected
            })
        })
    })
})