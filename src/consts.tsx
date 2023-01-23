export const aaFactoryAddress = "0x1453988Df0d6c4f7b0Da650806c757bd0c3d6410";
export const abi = [
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "_aaBytecodeHash",
        type: "bytes32",
      },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [],
    name: "aaBytecodeHash",
    outputs: [
      {
        internalType: "bytes32",
        name: "",
        type: "bytes32",
      },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      {
        internalType: "bytes32",
        name: "salt",
        type: "bytes32",
      },
      {
        internalType: "address",
        name: "owner1",
        type: "address",
      },
      {
        internalType: "address",
        name: "owner2",
        type: "address",
      },
    ],
    name: "deployAccount",
    outputs: [
      {
        internalType: "address",
        name: "accountAddress",
        type: "address",
      },
    ],
    stateMutability: "nonpayable",
    type: "function",
  },
];
