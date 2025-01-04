// import { Wallets } from 'fabric-network';
// import * as fs from 'fs';
// import path from 'path';

// export async function addIdentityToWallet(wallet: unknown, p0: string, identity: { mspId: string; credentials: { certificate: string; privateKey: string; }; }) {
//   const walletPath = path.resolve(__dirname, '../../wallet');
//   const wallet = await Wallets.newFileSystemWallet(walletPath);

//   const cert = fs.readFileSync(path.resolve(__dirname, '../../wallet/user1-cert.pem')).toString();
//   const privateKey = fs.readFileSync(path.resolve(__dirname, '../../wallet/user1-key.pem')).toString();

 
//   const identity = {
//     credentials: {
//       certificate: cert,
//       privateKey: privateKey
//     },
//     mspId: 'Org1MSP', 
//     type: 'X.509'    
//   };

//   await wallet.put('user1', identity);
//   console.log('Identity added to wallet.');
// }
