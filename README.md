## Custom Currency Claim Conditions

Set up your claim conditions so that holders of your NFT collection can purchase in a custom token.

## Setup

To run the project, first clone this repository:

```bash
npx thirdweb@latest create --template custom-currency-claim-conditions
```

Modify the [get-addresses.mjs](./scripts/get-addresses.mjs) file with your `collectionAddress`, `tokenAddress` and `tokenAmount`.

When you're ready, run the script with the following command:

```bash
node scripts/get-addresses.mjs
```

This will generate a new file called `nfts.csv` containing your snapshot, which you can upload to the dashboard!

## How It Works

In the script we are first getting the erc 721 collection:

```js
const sdk = new ThirdwebSDK("goerli");
const collectionAddress = "0x08d4CC2968cB82153Bb70229fDb40c78fDF825e8";

const contract = await sdk.getContract(collectionAddress);
```

Then, we are getting all the nfts:

```js
const nfts = await contract?.erc721.getAll();
```

Finally, we are creating a csv file with all owners with `address`,`maxClaimable`,`price`,`currencyAddress` and filtering it:

```js
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
```

## Join our Discord!

For any questions, suggestions, join our discord at [https://discord.gg/thirdweb](https://discord.gg/thirdweb).
