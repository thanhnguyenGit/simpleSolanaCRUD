'use client'

import { getSimplesolanacrudProgram, getSimplesolanacrudProgramId } from '@project/anchor'
import { useConnection } from '@solana/wallet-adapter-react'
import { Cluster, Keypair, PublicKey } from '@solana/web3.js'
import { useMutation, useQuery } from '@tanstack/react-query'
import { useMemo } from 'react'
import toast from 'react-hot-toast'
import { useCluster } from '../cluster/cluster-data-access'
import { useAnchorProvider } from '../solana/solana-provider'
import { useTransactionToast } from '../ui/ui-layout'

export function useSimplesolanacrudProgram() {
  const { connection } = useConnection()
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const provider = useAnchorProvider()
  const programId = useMemo(() => getSimplesolanacrudProgramId(cluster.network as Cluster), [cluster])
  const program = useMemo(() => getSimplesolanacrudProgram(provider, programId), [provider, programId])

  const accounts = useQuery({
    queryKey: ['simplesolanacrud', 'all', { cluster }],
    queryFn: () => program.account.simplesolanacrud.all(),
  })

  const getProgramAccount = useQuery({
    queryKey: ['get-program-account', { cluster }],
    queryFn: () => connection.getParsedAccountInfo(programId),
  })

  const initialize = useMutation({
    mutationKey: ['simplesolanacrud', 'initialize', { cluster }],
    mutationFn: (keypair: Keypair) =>
      program.methods.initialize().accounts({ simplesolanacrud: keypair.publicKey }).signers([keypair]).rpc(),
    onSuccess: (signature) => {
      transactionToast(signature)
      return accounts.refetch()
    },
    onError: () => toast.error('Failed to initialize account'),
  })

  const createEntry = useMutation<string, Error, CreateEntryArgs>({
  mutationKey: ["journalEntry", "create", { cluster }],
  mutationFn: async ({ title, message, owner }) => {
    const [journalEntryAddress] = await PublicKey.findProgramAddress(
      [Buffer.from(title), owner.toBuffer()],
      programId,
    );
 
    return program.methods
      .createJournalEntry(title, message)
      .accounts({
        journalEntry: journalEntryAddress,
      })
      .rpc();
  },
  onSuccess: signature => {
    transactionToast(signature);
    accounts.refetch();
  },
  onError: error => {
    toast.error(`Failed to create journal entry: ${error.message}`);
  },
});

  return {
    program,
    programId,
    accounts,
    getProgramAccount,
    initialize,
  }
}

export function useSimplesolanacrudProgramAccount({ account }: { account: PublicKey }) {
  const { cluster } = useCluster()
  const transactionToast = useTransactionToast()
  const { program, accounts } = useSimplesolanacrudProgram()

  const accountQuery = useQuery({
    queryKey: ['simplesolanacrud', 'fetch', { cluster, account }],
    queryFn: () => program.account.simplesolanacrud.fetch(account),
  })

  const closeMutation = useMutation({
    mutationKey: ['simplesolanacrud', 'close', { cluster, account }],
    mutationFn: () => program.methods.close().accounts({ simplesolanacrud: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accounts.refetch()
    },
  })

  const decrementMutation = useMutation({
    mutationKey: ['simplesolanacrud', 'decrement', { cluster, account }],
    mutationFn: () => program.methods.decrement().accounts({ simplesolanacrud: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const incrementMutation = useMutation({
    mutationKey: ['simplesolanacrud', 'increment', { cluster, account }],
    mutationFn: () => program.methods.increment().accounts({ simplesolanacrud: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })

  const setMutation = useMutation({
    mutationKey: ['simplesolanacrud', 'set', { cluster, account }],
    mutationFn: (value: number) => program.methods.set(value).accounts({ simplesolanacrud: account }).rpc(),
    onSuccess: (tx) => {
      transactionToast(tx)
      return accountQuery.refetch()
    },
  })
const updateEntry = useMutation<string, Error, CreateEntryArgs>({
  mutationKey: ["journalEntry", "update", { cluster }],
  mutationFn: async ({ title, message, owner }) => {
    const [journalEntryAddress] = await PublicKey.findProgramAddress(
      [Buffer.from(title), owner.toBuffer()],
      programId,
    );
 
    return program.methods
      .updateJournalEntry(title, message)
      .accounts({
        journalEntry: journalEntryAddress,
      })
      .rpc();
  },
  onSuccess: signature => {
    transactionToast(signature);
    accounts.refetch();
  },
  onError: error => {
    toast.error(`Failed to update journal entry: ${error.message}`);
  },
});
 
const deleteEntry = useMutation({
  mutationKey: ["journal", "deleteEntry", { cluster, account }],
  mutationFn: (title: string) =>
    program.methods
      .deleteJournalEntry(title)
      .accounts({ journalEntry: account })
      .rpc(),
  onSuccess: tx => {
    transactionToast(tx);
    return accounts.refetch();
  },
});
  return {
    accountQuery,
    closeMutation,
    decrementMutation,
    incrementMutation,
    setMutation,
  }
}
