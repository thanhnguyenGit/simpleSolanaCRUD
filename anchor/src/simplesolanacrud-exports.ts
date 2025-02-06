// Here we export some useful types and functions for interacting with the Anchor program.
import { AnchorProvider, Program } from '@coral-xyz/anchor'
import { Cluster, PublicKey } from '@solana/web3.js'
import SimplesolanacrudIDL from '../target/idl/simplesolanacrud.json'
import type { Simplesolanacrud } from '../target/types/simplesolanacrud'

// Re-export the generated IDL and type
export { Simplesolanacrud, SimplesolanacrudIDL }

// The programId is imported from the program IDL.
export const SIMPLESOLANACRUD_PROGRAM_ID = new PublicKey(SimplesolanacrudIDL.address)

// This is a helper function to get the Simplesolanacrud Anchor program.
export function getSimplesolanacrudProgram(provider: AnchorProvider, address?: PublicKey) {
  return new Program({ ...SimplesolanacrudIDL, address: address ? address.toBase58() : SimplesolanacrudIDL.address } as Simplesolanacrud, provider)
}

// This is a helper function to get the program ID for the Simplesolanacrud program depending on the cluster.
export function getSimplesolanacrudProgramId(cluster: Cluster) {
  switch (cluster) {
    case 'devnet':
    case 'testnet':
      // This is the program ID for the Simplesolanacrud program on devnet and testnet.
      return new PublicKey('coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF')
    case 'mainnet-beta':
    default:
      return SIMPLESOLANACRUD_PROGRAM_ID
  }
}
