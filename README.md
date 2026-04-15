# MyScribe Wallet

![Bitcoin](https://img.shields.io/badge/Bitcoin-000?style=for-the-badge&logo=bitcoin&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Chrome](https://img.shields.io/badge/Chrome-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)

> A wallet built for legends.

**[Chrome Web Store](https://chromewebstore.google.com/detail/myscribe-wallet/fohjnnfmmfaiilnbnbokkfmdienjdfck)** &nbsp;|&nbsp; **[myscribe.org](https://myscribe.org)**

## What is MyScribe Wallet?

MyScribe Wallet is an open-source, non-custodial Bitcoin browser extension built for consumers. It combines **OPNet smart contract** support with native **Ordinals inscription** browsing and **Fractal Bitcoin** support, all wrapped in a clean, distinctive UI.

MyScribe Wallet is a community fork of [OP_WALLET](https://github.com/btc-vision/opwallet) that extends the OPNet ecosystem with:

- **Ordinals support restored** — Inscriptions fetched via `ordinals.com` + `mempool.space` APIs. Inline preview rendering via `ordinals.com/preview/{id}`. Inscription sending/receiving and PSBT-based inscribing for both Bitcoin and Fractal Bitcoin are on the roadmap.
- **Fractal Bitcoin Mainnet** — First-class network support out of the box. Send, receive, and inscribe large file types on Fractal Bitcoin's fast, low-fee chain.
- **Consumer-focused UX** — Taproot-only wallet creation, always-on UTXO protection for Ordinals, simplified onboarding. Advanced developer features (contract deployment) removed for clarity.
- **MyScribe branding** — Sharp corners, gold gradient accents, visible container borders, custom logo and iconography.
- **OPNet WalletConnect integration** — Detects as `window.myscribe` for dApp connectivity via `@btc-vision/walletconnect`. [PR #23](https://github.com/btc-vision/walletconnect/pull/23) adds MyScribe to the official wallet connect modal.

[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/maboroshi_btc)
[![Website](https://img.shields.io/badge/MyScribe-C49A3C?style=for-the-badge&logoColor=white)](https://myscribe.org)

## Features

| Feature | MyScribe Wallet |
|---|---|
| **Bitcoin** | Taproot (BIP86) |
| **Networks** | Bitcoin Mainnet, Fractal Bitcoin Mainnet, OPNet Testnet, Regtest |
| **Ordinals** | Browse inscriptions via ordinals.com |
| **OPNet** | OP20 tokens, MotoSwap, .btc domains, smart contract interaction |
| **UTXO Protection** | Always-on filtering of inscription UTXOs (< 1000 sats) |
| **UTXO Management** | Consolidation, visualization, RBF cancel |
| **Address Rotation** | Quantum-resistant via non-reuse |
| **ML-DSA Signatures** | Full quantum-resistant MLDSA support (inherited from OP_WALLET) |
| **Custom RPC** | Per-network endpoint configuration |
| **IPFS Gateways** | Health monitoring, failover, local node support |
| **Security** | Per-site permissions, auto-lock, risk assessment |
| **Open Source** | Apache-2.0 |

## Installation

### Chrome Web Store

Install directly from the [Chrome Web Store](https://chromewebstore.google.com/detail/myscribe-wallet/fohjnnfmmfaiilnbnbokkfmdienjdfck). Works on Chrome, Brave, Edge, and Opera.

### Manual Install

1. Download or build from source (see below)
2. Go to `chrome://extensions/` (or equivalent)
3. Enable Developer Mode
4. Click **Load unpacked**
5. Select the `dist/chrome` folder

### Build from Source

```bash
git clone https://github.com/MyScribe-Ecosystem/MyScribe-Wallet.git
cd MyScribe-Wallet
npm install

# Production build (all 3 stages, skips lint gate)
npm run build:chrome:fast

# Production build (with lint + circular dep checks)
npm run build:chrome

# Dev with hot reload
npm run dev:chrome
```

Requires Node.js 24+.

## dApp Integration

MyScribe Wallet injects `window.myscribe` on every page (does **not** conflict with `window.opnet` — OP_WALLET and MyScribe coexist cleanly). dApps using `@btc-vision/walletconnect` will show MyScribe in the wallet connect modal once [PR #23](https://github.com/btc-vision/walletconnect/pull/23) is merged.

For dApp developers building with the MyScribe SDK fork today:

```bash
npm install github:MyScribe-Ecosystem/myscribe-opnet-sdk
```

```tsx
import { WalletConnectProvider, useWalletConnect, SupportedWallets } from '@myscribe/walletconnect';

// MyScribe appears alongside OP_WALLET in the connect modal
<WalletConnectProvider theme="dark">
  <App />
</WalletConnectProvider>
```

## Security & Upstream

MyScribe Wallet is built on [OP_WALLET](https://github.com/btc-vision/opwallet), which was audited by [Verichains](https://verichains.io). **No core wallet logic has been modified** — key management, transaction signing, PSBT construction, OPNet smart contract interaction, and ML-DSA cryptography are all inherited directly from OP_WALLET without changes.

MyScribe-specific changes are limited to:
- UI/branding (colors, logos, corner radii, typography)
- Ordinals browsing support (new `OrdinalsAPI.ts` service + UI screens)
- Fractal Bitcoin Mainnet enabled as a default network
- Consumer UX guardrails (Taproot-only creation, always-on UTXO protection, Address Type settings removed)
- `window.myscribe` provider injection for WalletConnect SDK detection

Upstream OP_WALLET updates are tracked via the GitHub fork relationship.

### Vulnerabilities

**DO NOT** open public issues for security bugs. Report via [GitHub Security Advisories](https://github.com/MyScribe-Ecosystem/MyScribe-Wallet/security/advisories/new).

## Contributing

1. Fork
2. Branch
3. Code
4. `npm run build:chrome:fast` (verify build passes)
5. PR

**Wallet developers:** If you're building an OPNet-compatible wallet and want to add it to the WalletConnect modal, see [OPNet's wallet integration guide](https://docs.opnet.org/wallet-integration/implementing-new-wallet/introduction).

## License

[Apache-2.0](LICENSE)

## Links

- [Chrome Web Store](https://chromewebstore.google.com/detail/myscribe-wallet/fohjnnfmmfaiilnbnbokkfmdienjdfck)
- [MyScribe](https://myscribe.org)
- [OPNet](https://opnet.org)
- [OPNet Docs](https://docs.opnet.org)
- [GitHub](https://github.com/MyScribe-Ecosystem/MyScribe-Wallet)
