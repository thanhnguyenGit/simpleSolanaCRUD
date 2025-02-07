#![allow(clippy::result_large_err)]

use anchor_lang::prelude::{Account, *};

// program id
declare_id!("qJYHz8JL6i3ftmds7hGirQqJYHz8JL6i3ftmds7hGir");

#[program]
pub mod simplesolanacrud {
    use super::*;
    pub fn create_journal_entry(
        ctx: Context<CreateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        msg!("Journal Entry Created");
        msg!("Title: {}", title);
        msg!("Message: {}", message);

        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.owner = ctx.accounts.owner.key();
        journal_entry.title = title;
        journal_entry.message = message;
        Ok(())
    }
    pub fn update_journal_entry(
        ctx: Context<UpdateEntry>,
        title: String,
        message: String,
    ) -> Result<()> {
        msg!("Update journal trigger");
        msg!("Title: {}", title);
        msg!("Message: {}", message);

        let journal_entry = &mut ctx.accounts.journal_entry;
        journal_entry.message = message;
        Ok(())
    }

    pub fn delete_journal_entry(ctx: Context<DeleteEntry>, title: String) -> Result<()> {
        msg!("Delete journal trigger");
        msg!("Tile: {}", title);
        Ok(())
    }
    pub fn read_journal_entry(ctx: Context<ReadEntry>) -> Result<()> {
        msg!("Read journal trigger");
        let owner_data = &ctx.accounts.journal_entry.owner;
        let title_data = &ctx.accounts.journal_entry.title;
        let message_data = &ctx.accounts.journal_entry.message;
        msg!(
            "This journal titled: {} belong to {}",
            title_data,
            owner_data
        );
        msg!("Content: {}", message_data);
        Ok(())
    }
}

// Instructions
#[derive(Accounts)]
#[instruction(title: String, message: String)]
pub struct CreateEntry<'info> {
    #[account(
        init_if_needed,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        payer = owner,
        space = 8 + JournalEntryState::INIT_SPACE
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String, message: String)]
pub struct UpdateEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        realloc = 8 + 32 + 1 + 4 + title.len() + 4 + message.len(),
        realloc::payer  = owner,
        realloc::zero  = true
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct DeleteEntry<'info> {
    #[account(
        mut,
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
        close = owner
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    #[account(mut)]
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

#[derive(Accounts)]
#[instruction(title: String)]
pub struct ReadEntry<'info> {
    #[account(
        seeds = [title.as_bytes(), owner.key().as_ref()],
        bump,
    )]
    pub journal_entry: Account<'info, JournalEntryState>,
    pub owner: Signer<'info>,
    pub system_program: Program<'info, System>,
}

// States (PDA)
#[account]
#[derive(InitSpace)]
pub struct JournalEntryState {
    pub owner: Pubkey,
    #[max_len(50)]
    pub title: String,
    #[max_len(1000)]
    pub message: String,
}
