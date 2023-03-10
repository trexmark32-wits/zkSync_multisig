import { useState } from "react";
import reactLogo from "./assets/react.svg";
import { ethers } from "ethers";
import { abi, aaFactoryAddress } from "./consts";
import { utils, Wallet, Provider, EIP712Signer, types } from "zksync-web3";
import "./App.css";

function App() {
  const [privateKey, setPrivateKey] = useState("");
  const [userAddress1, setUserAddress1] = useState("");
  const [userAddress2, setUserAddress2] = useState("");
  const [multisigAddress, setMultiSigWalletAddress] = useState(null);
  const [connectedWalletAddress, setconnectedWalletAddress] = useState(null);
  const [secondWalletAddress, setSecondWalletAddress] = useState(null);
  const [signature1, setSignatureOne] = useState(null);
  const [signedTxHash, setSignedTxHash] = useState(null);
  const [aaTx, setaaTx] = useState(null);

  let provider = new ethers.providers.Web3Provider(window.ethereum);
  console.log("provider", provider);
  const signer = provider.getSigner();
  const aaFactory = new ethers.Contract(aaFactoryAddress, abi, signer);

  // let aaTx = await aaFactory.populateTransaction.deployAccount(
  //   salt,
  //   userAddress1,
  //   userAddress2
  // );
  const privateKeyHandle = (e) => setPrivateKey(e.target.value);
  const userAdd1Handle = (e) => setUserAddress1(e.target.value);
  const userAdd2Handle = (e) => setUserAddress2(e.target.value);

  // For the simplicity of the tutorial, we will use zero hash as salt
  const salt = ethers.constants.HashZero;

  // const salt =
  //   "0x0000000000000000000000000000000000000000000000000000000000000012";

  // instead of creating and using new owners we are using EOAs and signers for the txn

  function handleSubmit(e) {
    e.preventDefault();
    console.log("You clicked submit.");
    console.log("privateKey: ", privateKey);
    console.log("ow1: ", userAddress1);
    console.log("ow2: ", userAddress2);
    createMultiSig();
  }

  // const factoryArtifact = await hre.artifacts.readArtifact("AAFactory");

  // The two owners of the multisig
  // const owner1 = Wallet.createRandom();
  // const owner2 = Wallet.createRandom();

  async function topUpWallet(multisigAddress) {
    const message = "Topping up your multisig wallet with 0.03 ETH";
    const messageHex = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(message));
    console.log("multisigAddress", multisigAddress);
    await (
      await signer.sendTransaction({
        to: multisigAddress,
        // You can increase the amount of ETH sent to the multisig
        value: ethers.utils.parseEther("0.003"),
        // data: messageHex,
      })
    ).wait();
  }

  // creates plain vannila transaction
  async function simpleSignOne() {
    // const provider1 = new Provider("https://zksync2-testnet.zksync.dev");
    const ABI = [
      { inputs: [], stateMutability: "nonpayable", type: "constructor" },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "owner",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "spender",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Approval",
        type: "event",
      },
      {
        anonymous: false,
        inputs: [
          {
            indexed: true,
            internalType: "address",
            name: "from",
            type: "address",
          },
          {
            indexed: true,
            internalType: "address",
            name: "to",
            type: "address",
          },
          {
            indexed: false,
            internalType: "uint256",
            name: "value",
            type: "uint256",
          },
        ],
        name: "Transfer",
        type: "event",
      },
      {
        inputs: [
          { internalType: "address", name: "owner", type: "address" },
          { internalType: "address", name: "spender", type: "address" },
        ],
        name: "allowance",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "approve",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [{ internalType: "address", name: "account", type: "address" }],
        name: "balanceOf",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "decimals",
        outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "subtractedValue", type: "uint256" },
        ],
        name: "decreaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "spender", type: "address" },
          { internalType: "uint256", name: "addedValue", type: "uint256" },
        ],
        name: "increaseAllowance",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [],
        name: "mint",
        outputs: [],
        stateMutability: "payable",
        type: "function",
      },
      {
        inputs: [],
        name: "name",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "symbol",
        outputs: [{ internalType: "string", name: "", type: "string" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [],
        name: "totalSupply",
        outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
        stateMutability: "view",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transfer",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
      {
        inputs: [
          { internalType: "address", name: "from", type: "address" },
          { internalType: "address", name: "to", type: "address" },
          { internalType: "uint256", name: "amount", type: "uint256" },
        ],
        name: "transferFrom",
        outputs: [{ internalType: "bool", name: "", type: "bool" }],
        stateMutability: "nonpayable",
        type: "function",
      },
    ];
    const contAddress = "0x6634726fB7832Cff9Ed0630B77adAF875898b070";

    const contract = new ethers.Contract(contAddress, ABI, signer);
    // const transactionData = contract.interface.encodeFunctionData("mint");

    let aaTx = await contract.populateTransaction.mint();
    const gasLimit = await provider.estimateGas(aaTx);
    const gasPrice = await provider.getGasPrice();

    aaTx = {
      ...aaTx,
      from: multisigAddress,
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      chainId: (await provider.getNetwork()).chainId,
      nonce: await provider.getTransactionCount(multisigAddress),
      type: 113,
      customData: {
        // Note, that we are using the `DEFAULT_ERGS_PER_PUBDATA_LIMIT`
        ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
      } as types.Eip712Meta,
      value: ethers.utils.parseEther("0.001"),
    };

    setaaTx(aaTx);

    const signedTxHash = EIP712Signer.getSignedDigest(aaTx);

    console.log("connectedWalletAddress", connectedWalletAddress);
    const signature1 = await ethereum.request({
      method: "eth_sign",
      params: [connectedWalletAddress, signedTxHash],
    });

    setSignedTxHash(signedTxHash);
    setSignatureOne(signature1);
    console.log("signature1", signature1);
  }
  async function simpleSignTwo() {
    const provider = new Provider("https://zksync2-testnet.zksync.dev");
    console.log("connectedWalletAddress", connectedWalletAddress);

    const signature2 = await ethereum.request({
      method: "eth_sign",
      params: [connectedWalletAddress, signedTxHash],
    });

    const signature = ethers.utils.concat([signature1, signature2]);
    let aatx = aaTx;
    console.log("aaTx, aatx", aaTx, aatx);
    aatx.customData = {
      ...aatx.customData,
      customSignature: signature,
    };

    const sentTx = await provider.sendTransaction(utils.serialize(aatx));
    await sentTx.wait();
    console.log("sentTx", sentTx);

    // const tx = await provider1.sendTransaction({
    //   to: contAddress,
    //   value: ethers.utils.parseEther("0.0001"),
    //   data: transactionData,
    // });
    // console.log(tx);
  }

  // async function handleDisconnect() {
  //   await window.ethereum.request({
  //     method: "eth_requestAccounts",
  //     params: [
  //       {
  //         eth_accounts: {},
  //       },
  //     ],
  //   });
  // }

  // creates a new transaction by entering account which will be used for signing
  async function handleTxn_NewAcc() {
    const provider = new Provider("https://zksync2-testnet.zksync.dev");

    let aaTx = await aaFactory.populateTransaction.deployAccount(
      salt,
      userAddress1,
      userAddress2
    );

    const gasLimit = await provider.estimateGas(aaTx);
    const gasPrice = await provider.getGasPrice();

    aaTx = {
      ...aaTx,
      from: multisigAddress,
      gasLimit: gasLimit,
      gasPrice: gasPrice,
      chainId: (await provider.getNetwork()).chainId,
      nonce: await provider.getTransactionCount(multisigAddress),
      type: 113,
      customData: {
        ergsPerPubdata: utils.DEFAULT_ERGS_PER_PUBDATA_LIMIT,
      } as types.Eip712Meta,
      value: ethers.BigNumber.from(0),
    };

    // const wallet = ethers.Wallet.fromAddress(connectedWalletAddress);
    setaaTx(aaTx);

    const signedTxHash = EIP712Signer.getSignedDigest(aaTx);

    console.log("connectedWalletAddress", connectedWalletAddress);
    const signature1 = await ethereum.request({
      method: "eth_sign",
      params: [connectedWalletAddress, signedTxHash],
    });

    setSignedTxHash(signedTxHash);
    setSignatureOne(signature1);
    console.log("signature1", signature1);
    // const accounts = await ethereum.request({
    //   method: "eth_requestAccounts",
    // });
    // console.log("accounts", accounts);
    // const secondWalletAddress = accounts[1];

    // console.log("secondWalletAddress", secondWalletAddress);
    // const signature2 = await ethereum.request({
    //   method: "eth_sign",
    //   params: [secondWalletAddress, signedTxHash],
    // });

    // const signature1 = ethers.utils.joinSignature(
    //   walletXyz._signingKey().signDigest(signedTxHash)
    // );
    // const signature2 = ethers.utils.joinSignature(
    //   walletZxy._signingKey().signDigest(signedTxHash)
    // );

    // const signature = ethers.utils.concat([
    //   // Note, that `signMessage` wouldn't work here, since we don't want
    //   // the signed hash to be prefixed with `\x19Ethereum Signed Message:\n`
    //   // ethers.utils.joinSignature(
    //   //   walletXyz._signingKey().signDigest(signedTxHash)
    //   // ),
    //   // ethers.utils.joinSignature(
    //   //   walletZxy._signingKey().signDigest(signedTxHash)
    //   // ),
    //   signature1,
    //   signature2,
    // ]);

    // console.log("signature1", signature1);
    // console.log("signature2", signature2);

    // aaTx.customData = {
    //   ...aaTx.customData,
    //   customSignature: signature,
    // };
    // console.log("aaTx", aaTx);
    // console.log(
    //   `The multisig's nonce before the first tx is ${await provider.getTransactionCount(
    //     multisigAddress
    //   )}`
    // );
    // const sentTx = await provider.sendTransaction(utils.serialize(aaTx));
    // await sentTx.wait();

    // // Checking that the nonce for the account has increased
    // console.log(
    //   `The multisig's nonce after the first tx is ${await provider.getTransactionCount(
    //     multisigAddress
    //   )}`
    // );
  }
  async function signTwo() {
    const provider = new Provider("https://zksync2-testnet.zksync.dev");
    console.log("connectedWalletAddress", connectedWalletAddress);

    const signature2 = await ethereum.request({
      method: "eth_sign",
      params: [connectedWalletAddress, signedTxHash],
    });

    const signature = ethers.utils.concat([signature1, signature2]);
    let aatx = aaTx;
    console.log("aaTx, aatx", aaTx, aatx);
    aatx.customData = {
      ...aatx.customData,
      customSignature: signature,
    };
    // console.log("aaTx", aatx);
    console.log(
      `The multisig's nonce before the first tx is ${await provider.getTransactionCount(
        multisigAddress
      )}`
    );
    const sentTx = await provider.sendTransaction(utils.serialize(aatx));
    await sentTx.wait();
    console.log("sentTx", sentTx);
    // Checking that the nonce for the account has increased
    console.log(
      `The multisig's nonce after the first tx is ${await provider.getTransactionCount(
        multisigAddress
      )}`
    );
  }
  // async function signOne() {
  //   console.log("signedTxHash", signedTxHash);
  //   console.log("connectedWalletAddress", connectedWalletAddress);
  //   const signature1 = await ethereum.request({
  //     method: "eth_sign",
  //     params: [connectedWalletAddress, signedTxHash],
  //   });

  //   // return signature1;
  // }

  async function createMultiSig() {
    console.log("signer", signer);
    // const provider = new Provider("https://zksync2-testnet.zksync.dev");
    // const wallet = new Wallet(privateKey).connect(provider);
    console.log("aaFactory", aaFactory);

    const tx = await aaFactory.deployAccount(salt, userAddress1, userAddress2);
    await tx.wait();
    console.log("tx", tx);

    // Getting the address of the deployed contract
    const abiCoder = new ethers.utils.AbiCoder();
    const multisigAddress = utils.create2Address(
      aaFactoryAddress,
      await aaFactory.aaBytecodeHash(),
      salt,
      abiCoder.encode(["address", "address"], [userAddress1, userAddress2])
    );
    setMultiSigWalletAddress(multisigAddress);
    console.log(`Multisig deployed at address ${multisigAddress}`);

    // topping up the wallet with eth
    await topUpWallet(multisigAddress);
  }

  async function connect() {
    provider = window.ethereum;
    if (typeof provider !== "undefined") {
      console.log("MetaMask is installed!");
      const chainId = await provider.request({ method: "eth_chainId" });
      console.log("chainId", chainId);
      if (chainId === "0x118") {
        console.log("Bravo!, you are on the correct network");
        const account = await ethereum.request({
          method: "eth_requestAccounts",
        });
        console.log("account[0]", account[0]);
        setconnectedWalletAddress(account[0]);
        console.log("account[1]", account[1]);
        setSecondWalletAddress(account[1]);
      } else {
        try {
          await provider.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId: "0x118" }],
          });
          console.log(
            "You have succefully switched to zkSync goerli Test network"
          );
          const account = await ethereum.request({
            method: "eth_requestAccounts",
          });
          console.log("account[0]", account[0]);
          setconnectedWalletAddress(account[0]);
          console.log("account[1]", account[1]);
          setSecondWalletAddress(account[1]);
        } catch (switchError) {
          // This error code indicates that the chain has not been added to MetaMask.
          if (switchError.code === 4902) {
            console.log("Adding a new network in your metamask");
            try {
              await provider.request({
                method: "wallet_addEthereumChain",
                params: [
                  {
                    chainId: "0x118",
                    chainName: "zkSync alpha testnet",
                    rpcUrls: ["https://zksync2-testnet.zksync.dev"],
                    blockExplorerUrls: ["https://zksync2-testnet.zkscan.io/"],
                    nativeCurrency: {
                      symbol: "ETH",
                      decimals: 18,
                    },
                  },
                ],
              });
            } catch (addError) {
              console.log(addError);
            }
          }
          // console.log("Failed to switch to the network");
        }
      }
    } else {
      console.log("MetaMask is not installed!");
    }
  }

  return (
    <div className="App">
      <nav className="navbar">
        <div className="container-fluid px-4">
          <span className="navbar-brand mb-0 h1 text-white">
            zkSync AA wallet
          </span>
          <div className="text-white">
            {" "}
            {connectedWalletAddress == null
              ? ""
              : `Wallet Connected: ${connectedWalletAddress}`}
          </div>
          <button className="btn custom text-white" onClick={connect}>
            Connect Wallet
          </button>
          {/* <button className="btn custom text-white" onClick={handleTxn}>
            Plain ERC20 mint
          </button> */}
          {/* <button className="btn custom text-white" onClick={handleTxn_NewAcc}>
            Exec txn and 1st sign
          </button>
          <button className="btn custom text-white" onClick={signTwo}>
            Exec 2nd Sign
          </button> */}
          {/* <button className="btn custom text-white" onClick={handleDisconnect}>
            - Disconnect -
          </button> */}
        </div>
      </nav>
      <div className="col">
        <div className="d-flex justify-content-center h3 p-5">
          Create Multisig Wallet
        </div>
        <div className="row d-flex justify-content-center">
          <form className="w-50" onSubmit={handleSubmit}>
            <div className="row mb-3">
              <label htmlFor="input1" className="col-sm-2 col-form-label">
                Owner 1
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  id="input1"
                  placeholder="Enter 1st Owner Address"
                  onChange={userAdd1Handle}
                />
              </div>
            </div>
            <div className="row d-flex justify-content-between mb-3">
              <label htmlFor="input2" className="col-sm-2 col-form-label">
                Owner 2
              </label>
              <div className="col-sm-10">
                <input
                  type="text"
                  className="form-control"
                  id="input2"
                  placeholder="Enter 2nd Owner Address"
                  onChange={userAdd2Handle}
                />
              </div>
            </div>
            <div>
              {" "}
              {multisigAddress == null
                ? ""
                : `Your multisig deployed at address: ${multisigAddress}`}
            </div>

            <button type="submit" className="btn custom text-white mt-4 mx-3">
              Create Wallet
            </button>
          </form>
          <div className="card text-start w-75 my-5">
            <div className="card-body">
              <h5 className="card-title">
                Executing a transection by deploying a new account
              </h5>
              <p className="card-text">
                The above provided addresses are used as signatories.
              </p>
              <div className="d-flex justify-content-around mt-4">
                {/* <button
                  className="btn custom text-white col-sm-2"
                  onClick={handleTxn_NewAcc}
                >
                  Execute Txn
                </button> */}
                <button
                  type="submit"
                  className="btn custom text-white col-sm-2"
                  onClick={handleTxn_NewAcc}
                >
                  Sign 1
                </button>
                <button
                  type="submit"
                  className="btn custom text-white col-sm-2"
                  onClick={signTwo}
                >
                  Sign 2
                </button>
              </div>
            </div>
          </div>
          <div className="card text-start w-75 my-5">
            <div className="card-body">
              <h5 className="card-title">Simple ERC20 mint.</h5>
              <p className="card-text">
                The above provided addresses are used as signatories.
              </p>
              <div className="d-flex justify-content-around mt-4">
                {/* <button
                  className="btn custom text-white col-sm-2"
                  onClick={handleTxn_NewAcc}
                >
                  Execute Txn
                </button> */}
                <button
                  type="submit"
                  className="btn custom text-white col-sm-2"
                  onClick={simpleSignOne}
                >
                  Sign 1
                </button>
                <button
                  type="submit"
                  className="btn custom text-white col-sm-2"
                  onClick={simpleSignTwo}
                >
                  Sign 2
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
