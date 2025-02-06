import * as anchor from '@coral-xyz/anchor'
import {Program} from '@coral-xyz/anchor'
import {Keypair} from '@solana/web3.js'
import {Simplesolanacrud} from '../target/types/simplesolanacrud'

describe('simplesolanacrud', () => {
  // Configure the client to use the local cluster.
  const provider = anchor.AnchorProvider.env()
  anchor.setProvider(provider)
  const payer = provider.wallet as anchor.Wallet

  const program = anchor.workspace.Simplesolanacrud as Program<Simplesolanacrud>

  const simplesolanacrudKeypair = Keypair.generate()

  it('Initialize Simplesolanacrud', async () => {
    await program.methods
      .initialize()
      .accounts({
        simplesolanacrud: simplesolanacrudKeypair.publicKey,
        payer: payer.publicKey,
      })
      .signers([simplesolanacrudKeypair])
      .rpc()

    const currentCount = await program.account.simplesolanacrud.fetch(simplesolanacrudKeypair.publicKey)

    expect(currentCount.count).toEqual(0)
  })

  it('Increment Simplesolanacrud', async () => {
    await program.methods.increment().accounts({ simplesolanacrud: simplesolanacrudKeypair.publicKey }).rpc()

    const currentCount = await program.account.simplesolanacrud.fetch(simplesolanacrudKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Increment Simplesolanacrud Again', async () => {
    await program.methods.increment().accounts({ simplesolanacrud: simplesolanacrudKeypair.publicKey }).rpc()

    const currentCount = await program.account.simplesolanacrud.fetch(simplesolanacrudKeypair.publicKey)

    expect(currentCount.count).toEqual(2)
  })

  it('Decrement Simplesolanacrud', async () => {
    await program.methods.decrement().accounts({ simplesolanacrud: simplesolanacrudKeypair.publicKey }).rpc()

    const currentCount = await program.account.simplesolanacrud.fetch(simplesolanacrudKeypair.publicKey)

    expect(currentCount.count).toEqual(1)
  })

  it('Set simplesolanacrud value', async () => {
    await program.methods.set(42).accounts({ simplesolanacrud: simplesolanacrudKeypair.publicKey }).rpc()

    const currentCount = await program.account.simplesolanacrud.fetch(simplesolanacrudKeypair.publicKey)

    expect(currentCount.count).toEqual(42)
  })

  it('Set close the simplesolanacrud account', async () => {
    await program.methods
      .close()
      .accounts({
        payer: payer.publicKey,
        simplesolanacrud: simplesolanacrudKeypair.publicKey,
      })
      .rpc()

    // The account should no longer exist, returning null.
    const userAccount = await program.account.simplesolanacrud.fetchNullable(simplesolanacrudKeypair.publicKey)
    expect(userAccount).toBeNull()
  })
})
