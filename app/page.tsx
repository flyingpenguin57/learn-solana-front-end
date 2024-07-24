'use client'

import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
  Transaction,
  SystemProgram,
  sendAndConfirmTransaction,
  Keypair,
  TransactionInstruction,
} from "@solana/web3.js";
import "dotenv/config";
import bs58 from 'bs58';
import { createAssociatedTokenAccount, createMint, getAssociatedTokenAddress, getOrCreateAssociatedTokenAccount, mintTo, transfer } from "@solana/spl-token";
import {
  Metaplex,
  keypairIdentity,
  irysStorage,
  toMetaplexFile,
} from "@metaplex-foundation/js";

const solana = async () => {


  //从私钥创建一个key pair用于签名
  const secretKey = '39EhXuLKkvY47GijBeWg2ddHdWBcTdoNF2vkwhTW7ZMw8jTPxknRREA2di96NYjjcj4LpYjMo6P6c8Ru6LPzVsCB';
  const secretKeyUint8Array = bs58.decode(secretKey);
  const senderKeypair = Keypair.fromSecretKey(secretKeyUint8Array);

  //连接节点
  const connection = new Connection(clusterApiUrl("devnet"));

  //获取余额
  const address = new PublicKey("ALTegyUY8VjTDLmRXC2oKnm69tTGpWqdonAjyAkWpFhq");
  const balance = await connection.getBalance(address);
  const balanceInSol = balance / LAMPORTS_PER_SOL;
  console.log(`The balance of the account at ${address} is ${balanceInSol} SOL`);

  //转账
  const transaction = new Transaction();
  const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: new PublicKey("ALTegyUY8VjTDLmRXC2oKnm69tTGpWqdonAjyAkWpFhq"),
    toPubkey: new PublicKey("FGV3bhbCZfx6DCVLBQoLij5Uz6dw6nqrdwcYqFekvcZs"),
    lamports: LAMPORTS_PER_SOL * 0.01,
  });
  transaction.add(sendSolInstruction);
  const signature = await sendAndConfirmTransaction(connection, transaction, [
    senderKeypair,
  ]);

  //调用链上其他程序
  const instruction1 = new TransactionInstruction({
    programId: new PublicKey("ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa"),
    keys: [
      {
        pubkey: new PublicKey("Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod"),
        isSigner: false,
        isWritable: true,
      },
    ],
    //data?: Buffer;
  });
  const transaction1 = new Transaction().add(instruction1);
  const signature1 = await sendAndConfirmTransaction(
    connection,
    transaction1,
    [senderKeypair],
  );
  console.log(`✅ Success! Transaction signature is: ${signature1}`);

  console.log(`✅ Finished!`);
}

const createToken = async () => {
  //从私钥创建一个key pair用于签名
  const secretKey = '39EhXuLKkvY47GijBeWg2ddHdWBcTdoNF2vkwhTW7ZMw8jTPxknRREA2di96NYjjcj4LpYjMo6P6c8Ru6LPzVsCB';
  const secretKeyUint8Array = bs58.decode(secretKey);
  const senderKeypair = Keypair.fromSecretKey(secretKeyUint8Array);

  //连接节点
  const connection = new Connection(clusterApiUrl("devnet"));

  //创建token,实质就是创建一个数据账户,owner是token程序,并初始化数据账户的一些数据
  const tokenMint = await createMint(
    connection,
    senderKeypair,
    senderKeypair.publicKey, //
    senderKeypair.publicKey, //
    18, //精度
  );
  console.log(`✅ Success! Token account is: ${tokenMint}`);
}

const createATA = async () => {
  //从私钥创建一个key pair用于签名1
  const secretKey = '39EhXuLKkvY47GijBeWg2ddHdWBcTdoNF2vkwhTW7ZMw8jTPxknRREA2di96NYjjcj4LpYjMo6P6c8Ru6LPzVsCB';
  const secretKeyUint8Array = bs58.decode(secretKey);
  const senderKeypair = Keypair.fromSecretKey(secretKeyUint8Array);

  //连接节点
  const connection = new Connection(clusterApiUrl("devnet"));

  //创建ATA账户，用来存放我所拥有的某种token
  //first creates the account, second initializes the account as a Token Account
  const associatedTokenAccount = await createAssociatedTokenAccount(
    connection,
    senderKeypair,
    new PublicKey("42gh7hvLsQcsjak2KZAw6cFUfeCeHTARgQjzhtVojGSx"),
    senderKeypair.publicKey,
  );
  console.log(`ATA:${associatedTokenAccount}`)
}

const mint = async () => {
  //从私钥创建一个key pair用于签名1
  const secretKey = '39EhXuLKkvY47GijBeWg2ddHdWBcTdoNF2vkwhTW7ZMw8jTPxknRREA2di96NYjjcj4LpYjMo6P6c8Ru6LPzVsCB';
  const secretKeyUint8Array = bs58.decode(secretKey);
  const senderKeypair = Keypair.fromSecretKey(secretKeyUint8Array);

  //连接节点
  const connection = new Connection(clusterApiUrl("devnet"));

  //获取ata
  const associatedTokenAddress = await getAssociatedTokenAddress(
    new PublicKey("42gh7hvLsQcsjak2KZAw6cFUfeCeHTARgQjzhtVojGSx"),
    senderKeypair.publicKey,
  );
  console.log(`ata:${associatedTokenAddress}`)
  const transactionSignature = await mintTo(
    connection,
    senderKeypair,
    new PublicKey("42gh7hvLsQcsjak2KZAw6cFUfeCeHTARgQjzhtVojGSx"),
    associatedTokenAddress,
    senderKeypair.publicKey,
    100000,
  );
  console.log(`mint tx signature: ${transactionSignature}`)
}

const _transfer = async () => {
  //从私钥创建一个key pair用于签名1
  const secretKey = '39EhXuLKkvY47GijBeWg2ddHdWBcTdoNF2vkwhTW7ZMw8jTPxknRREA2di96NYjjcj4LpYjMo6P6c8Ru6LPzVsCB';
  const secretKeyUint8Array = bs58.decode(secretKey);
  const senderKeypair = Keypair.fromSecretKey(secretKeyUint8Array);

  //连接节点
  const connection = new Connection(clusterApiUrl("devnet"));

  const associatedTokenAddress = await getAssociatedTokenAddress(
    new PublicKey("42gh7hvLsQcsjak2KZAw6cFUfeCeHTARgQjzhtVojGSx"),
    senderKeypair.publicKey,
  );
  const to = await getOrCreateAssociatedTokenAccount(
    connection,
    senderKeypair,
    new PublicKey("42gh7hvLsQcsjak2KZAw6cFUfeCeHTARgQjzhtVojGSx"),
    new PublicKey("FGV3bhbCZfx6DCVLBQoLij5Uz6dw6nqrdwcYqFekvcZs")
  )
  console.log(`to:${to.address}`)
  const transactionSignature = await transfer(
    connection,
    senderKeypair,
    associatedTokenAddress,
    to.address,
    senderKeypair.publicKey,
    100,
  );
  console.log(`transfer signature: ${transactionSignature}`)
}

const createCollection = () => {
  //从私钥创建一个key pair用于签名1
  const secretKey = '39EhXuLKkvY47GijBeWg2ddHdWBcTdoNF2vkwhTW7ZMw8jTPxknRREA2di96NYjjcj4LpYjMo6P6c8Ru6LPzVsCB';
  const secretKeyUint8Array = bs58.decode(secretKey);
  const senderKeypair = Keypair.fromSecretKey(secretKeyUint8Array);

  //连接节点
  const connection = new Connection(clusterApiUrl("devnet"));

  //metadata program js客户端
  const metaplex = Metaplex.make(connection)
    .use(keypairIdentity(senderKeypair)) //交易签名者
    .use( //链下存储
      irysStorage({
        address: "https://devnet.irys.xyz",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      }),
    );
}

export default async function Home() {
  return (
    <div>
      <div>******</div>
      <h2>erc20</h2>
      <button onClick={solana}>solana</button><br></br>
      <button onClick={createToken}>create token</button><br></br>
      <button onClick={createATA}>create ATA</button><br></br>
      <button onClick={mint}>mint</button><br></br>
      <button onClick={_transfer}>transfer</button>
      <br></br>
      <div>******</div>
      <h1>erc721</h1>
    </div>
  );
}
