const { expect } = require('@playwright/test')

describe('Devparty Contract', function () {
  it('should issue token (issueToken)', async function () {
    const Devparty = await ethers.getContractFactory('Devparty')
    const devparty = await Devparty.deploy()
    await devparty.deployed()
    const signerAddress = '3A5bd1E37b099aE3386D13947b6a90d97675e5e3'
    const token = await devparty.issueToken(
      `0x${signerAddress}`,
      69,
      'https://bafybeiewuo3rq2glwgg7f2n743svfvgw5zaiyoxuwqqc54ogy5hobmln4i.ipfs.infura-ipfs.io/'
    )

    expect(token.data.includes(signerAddress.toLowerCase())).toBe(true)
  })
})
