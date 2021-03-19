const client = require("./client")
async function main() {
	  console.log("========== Info ==========")
	  await queryInfo(client.Info())
	  console.log("========== Platform Chain Info ==========")
	  await queryPChain(client.PChain())
	  console.log("========== Exchange Chain Info ==========")
	  await queryXChain(client.XChain())
}

async function queryInfo(info) {
	    console.log("- X:", await info.getBlockchainID("X"), await info.isBootstrapped("X"))
	    console.log("- P:", await info.getBlockchainID("P"), await info.isBootstrapped("P"))
	    console.log("- C:", await info.getBlockchainID("C"), await info.isBootstrapped("C"))
	    console.log("- Fees:", await info.getTxFee())
}

async function queryPChain(pChain) {
	console.log("Fetching validator subnets...")
	const subnets = await pChain.getSubnets()
	console.log("Found subnets:", subnets.length)
	console.log("Subnet example:", subnets[0])
	console.log("Fetching validators...")
	const { validators } = await pChain.getCurrentValidators()
	console.log("Found validators:", validators.length)
	console.log("Example validator:", validators[0])
	const validator = validators[0]
	const ownerBalance = await pChain.getBalance(validator.rewardOwner.addresses[0])
	console.log("Validator owner balance:", ownerBalance.balance)
	const height = await pChain.getHeight()
	console.log("Current height:", height.toString(10))
	const minStake = await pChain.getMinStake()
	console.log("Current min stake:", minStake.minValidatorStake.toString(10))
	const supply = await pChain.getCurrentSupply()
	console.log("Current supply:", supply.toString(10))
}

async function queryXChain(xChain) {
	const fee = await xChain.getDefaultTxFee()
	console.log("Default Fee:", fee.toString(10))
	const status = await xChain.getTxStatus("2AjbGiRg1KG7FtuJqVEtCzi48n8jpwWdLLYwnBxfFCwMozMLMg")
	console.log("Transaction status:", status)
	const balances = await xChain.getAllBalances("X-fuji1wretkav7m4073wq9qsqnrs96vx3vljds4d59u8")
	console.log("Balances:", balances)
}

main().catch((err) => {
	  console.log("We have encountered an error!")
	  console.error(err)
})
