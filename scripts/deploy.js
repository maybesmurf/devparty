const hre = require('hardhat')

async function main() {
  const Devparty = await hre.ethers.getContractFactory('Devparty')
  const devparty = await Devparty.deploy()
  await devparty.deployed()
  console.log('Devparty deployed to:', devparty.address)
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error)
    process.exit(1)
  })
