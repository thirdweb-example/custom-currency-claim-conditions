import { ThirdwebSDK } from "@thirdweb-dev/sdk";
import fs from "fs";
import path from "path";

(async () => {
  const sdk = new ThirdwebSDK("goerli");
  // replace the addresses and amount with your own
  const collectionAddress = "0x08d4CC2968cB82153Bb70229fDb40c78fDF825e8";
  const tokenAddress = "0x2D2DeDba9D45DDaCd938B9DA5b3ED6F7aA18b5C4";
  const tokenAmount = 1200;

  const contract = await sdk.getContract(collectionAddress);

  if (!contract) {
    return console.log("Contract not found");
  }

  // getting all the NFTs of the collection
  const nfts = await contract.erc721.getAll();

  if (!nfts) {
    return console.log("No NFTs found");
  }

  // creating a new array of addresses
  const csv = nfts.reduce((acc, nft) => {
    const address = nft.owner;
    const quantity = acc[address] ? acc[address] + 1 : 1;
    return { ...acc, [address]: quantity };
  }, {});

  // filtering the addressees
  const filteredCsv = Object.keys(csv).reduce((acc, key) => {
    if (key !== "0x0000000000000000000000000000000000000000") {
      return {
        ...acc,
        [key]: csv[key],
      };
    }
    return acc;
  }, {});

  // writing the addresses to a csv file
  const csvString =
    "address,maxClaimable,price,currencyAddress\r" +
    Object.entries(filteredCsv)
      .map(
        ([address, quantity]) =>
          `${address},${quantity},${tokenAmount},${tokenAddress}`
      )
      .join("\r");

  fs.writeFileSync(path.join(path.dirname("."), "snapshot.csv"), csvString);
  console.log("Generated snapshot.csv");
})();
