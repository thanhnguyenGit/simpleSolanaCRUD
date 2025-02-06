#![allow(clippy::result_large_err)]

use anchor_lang::prelude::*;

declare_id!("coUnmi3oBUtwtd9fjeAvSsJssXh5A5xyPbhpewyzRVF");

#[program]
pub mod simplesolanacrud {
    use super::*;

  pub fn close(_ctx: Context<CloseSimplesolanacrud>) -> Result<()> {
    Ok(())
  }

  pub fn decrement(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.simplesolanacrud.count = ctx.accounts.simplesolanacrud.count.checked_sub(1).unwrap();
    Ok(())
  }

  pub fn increment(ctx: Context<Update>) -> Result<()> {
    ctx.accounts.simplesolanacrud.count = ctx.accounts.simplesolanacrud.count.checked_add(1).unwrap();
    Ok(())
  }

  pub fn initialize(_ctx: Context<InitializeSimplesolanacrud>) -> Result<()> {
    Ok(())
  }

  pub fn set(ctx: Context<Update>, value: u8) -> Result<()> {
    ctx.accounts.simplesolanacrud.count = value.clone();
    Ok(())
  }
}

#[derive(Accounts)]
pub struct InitializeSimplesolanacrud<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  init,
  space = 8 + Simplesolanacrud::INIT_SPACE,
  payer = payer
  )]
  pub simplesolanacrud: Account<'info, Simplesolanacrud>,
  pub system_program: Program<'info, System>,
}
#[derive(Accounts)]
pub struct CloseSimplesolanacrud<'info> {
  #[account(mut)]
  pub payer: Signer<'info>,

  #[account(
  mut,
  close = payer, // close account and return lamports to payer
  )]
  pub simplesolanacrud: Account<'info, Simplesolanacrud>,
}

#[derive(Accounts)]
pub struct Update<'info> {
  #[account(mut)]
  pub simplesolanacrud: Account<'info, Simplesolanacrud>,
}

#[account]
#[derive(InitSpace)]
pub struct Simplesolanacrud {
  count: u8,
}
