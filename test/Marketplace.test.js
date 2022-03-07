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
})