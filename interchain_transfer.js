const fs = require("fs")
const avalanche = require("avalanche")
const client = require("./client")
const ethUtil = require("ethereumjs-util")
const binTools = avalanche.BinTools.getInstance()
const credentialsPath = "./credentials"

async function main() {
	    const xChain = client.XChain()
	    const xKeychain = xChain.keyChain()
	    const cChain = client.CChain()
	    const cKeychain = cChain.keyChain()
	    const data = JSON.parse(fs.readFileSync(`${credentialsPath}/keypair.json`))
	    xKeychain.importKey(data.privkey)
	    cKeychain.importKey(data.privkey)
	    const keyBuff = binTools.cb58Decode(data.privkey.split('-')[1])
	    const ethAddr = ethUtil.Address.fromPrivateKey(Buffer.from(keyBuff, "hex")).toString("hex")
	    console.log("Derived Eth address:", ethAddr)
	    await createExport(client, xChain, xKeychain, cKeychain)
	    setTimeout(async function() {
		          await createImport(client, cChain, cKeychain, ethAddr)
		          console.log("----------------------------------------------------------------")
		          console.log(`Visit https://cchain.explorer.avax-test.network/address/${ethAddr} for balance details`)
		          console.log("----------------------------------------------------------------")
		        }, 3000)
}

async function createExport(client, xChain, xKeychain, cKeychain) {
	    const amount = "50000000" 
	    const asset = "AVAX" 
	    const addresses = xKeychain.getAddressStrings()
	    const utxos = (await xChain.getUTXOs(addresses)).utxos
	    const assetInfo = await xChain.getAssetDescription(asset)
	    const assetID = avalanche.BinTools.getInstance().cb58Encode(assetInfo.assetID)
	    let balance = await xChain.getBalance(addresses[0], assetID)
	    console.log("Current X-Chain balance:", balance)
	    const destinationChain = await client.Info().getBlockchainID("C")
	    const exportTx = await xChain.buildExportTx(
		          utxos,
		          new avalanche.BN(amount), 
		          destinationChain, 
		          cKeychain.getAddressStrings(), 
		          xKeychain.getAddressStrings(), 
		          xKeychain.getAddressStrings(), 
		        )
	      const exportTxID = await xChain.issueTx(exportTx.sign(xKeychain))
	      console.log("X-Chain export TX:", exportTxID)
	      console.log(` - https://explorer.avax-test.network/tx/${exportTxID}`)
}
async function createImport(client, cChain, cKeychain, address) {
	    const sourceChain = await client.Info().getBlockchainID("X")
	    const { utxos } = await cChain.getUTXOs(cKeychain.getAddressStrings(), sourceChain)
	    const importTx = await cChain.buildImportTx(
		          utxos,
		          address,
		          cKeychain.getAddressStrings(),
		          sourceChain,
		          cKeychain.getAddressStrings()
		        )
	    const importTX = await cChain.issueTx(importTx.sign(cKeychain))
	    console.log("C-Chain import TX:", importTX)
	    console.log(` - https://explorer.avax-test.network/tx/${importTX}`)
}

main().catch((err) => {
	  console.log("We have encountered an error!")
	  console.error(err)
})
