# MyScribe Wallet — Privacy Policy

**Last Updated:** March 27, 2026

## Overview

MyScribe Wallet is a non-custodial Bitcoin browser extension. It runs entirely on your device. We do not operate servers that collect, store, process, or transmit your personal data.

## Data We Collect

**None.** MyScribe Wallet does not collect, transmit, or have access to:

- Your seed phrase or private keys
- Your passwords or PINs
- Your Bitcoin addresses or balances
- Your transaction history
- Your identity or personal information
- Your browsing activity

All wallet data (encrypted keyrings, preferences, cached metadata) is stored locally in your browser's extension storage and never leaves your device.

## Third-Party API Requests

To display blockchain data, MyScribe Wallet makes network requests directly from your browser to the following public APIs:

| Service | Purpose | Privacy Policy |
|---------|---------|---------------|
| **mempool.space** | Fetch UTXOs, broadcast transactions | [mempool.space/privacy-policy](https://mempool.space/privacy-policy) |
| **ordinals.com** | Fetch inscription data and previews | Public API, no account required |
| **OPNet RPC nodes** | Fetch OPNet token balances and smart contract data | [opnet.org](https://opnet.org) |

These requests are made directly from your browser — MyScribe does not proxy, log, or relay any of this traffic. Each third-party service has its own privacy practices. Your IP address may be visible to these services as part of standard HTTPS requests.

## Data Storage

All data is stored locally on your device using the browser's `chrome.storage` API:

- Encrypted wallet keyrings (protected by your password)
- User preferences (theme, experience mode)
- Cached inscription metadata (for faster loading)
- Onboarding completion state

This data is never transmitted to MyScribe or any third party.

## Data Sharing

We do not sell, transfer, or share any user data with third parties. We do not use any analytics, telemetry, or tracking services.

## Non-Custodial

MyScribe Wallet is non-custodial. You are solely responsible for safeguarding your seed phrase and passwords. If you lose your seed phrase, neither MyScribe nor anyone else can recover your wallet or funds.

## Open Source

MyScribe Wallet is open-source software. You can audit the complete source code at:
https://github.com/bitbragi/MyScribe-Wallet

## Changes to This Policy

If we update this privacy policy, the changes will be reflected in this document and the "Last Updated" date above.

## Contact

For privacy-related questions, open an issue on our GitHub repository:
https://github.com/bitbragi/MyScribe-Wallet/issues
