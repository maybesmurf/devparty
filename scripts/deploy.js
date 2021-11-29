const hre = require('hardhat')
const fs = require('fs')

async function main() {
  const Devparty = await hre.ethers.getContractFactory('Devparty')
  const devparty = await Devparty.deploy()
  await devparty.deployed()
  fs.appendFileSync('.env', `DEV_CONTRACT_ADDRESS="${devparty.address}"\n`)
  console.log('Devparty deployed to:', devparty.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
