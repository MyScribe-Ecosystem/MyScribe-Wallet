# MyScribe Wallet

![Bitcoin](https://img.shields.io/badge/Bitcoin-000?style=for-the-badge&logo=bitcoin&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=white)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white)
![Chrome](https://img.shields.io/badge/Chrome-4285F4?style=for-the-badge&logo=googlechrome&logoColor=white)

> A wallet built for legends.

## What is MyScribe Wallet?

MyScribe Wallet is an open-source, non-custodial Bitcoin browser extension built for consumers. It combines **OPNet smart contract** support with native **Ordinals inscription** browsing, all wrapped in a clean, distinctive UI.

MyScribe Wallet is a fork of [OP_WALLET](https://github.com/btc-vision/opwallet) with the following changes:

- **Ordinals restored & upgraded** — Inscriptions are fetched via `ordinals.com` + `mempool.space` (no Hiro dependency). Previews render inline using `ordinals.com/preview/{id}`.
- **Consumer-focused** — Advanced developer features (contract deployment) stripped for a cleaner experience.
- **MyScribe aesthetic** — Sharp 0px corner radius, gold gradient accents, visible container borders, and the MyScribe brand throughout.
- **Version nag removed** — No more OP_WALLET update prompts.

[![X](https://img.shields.io/badge/X-000000?style=for-the-badge&logo=x&logoColor=white)](https://x.com/maboroshi_btc)
[![Website](https://img.shields.io/badge/MyScribe-C49A3C?style=for-the-badge&logo=data:image/svg+xml;base64,&logoColor=white)](https://myscribe.org)

## Features

| Feature | MyScribe Wallet |
|---|---|
| **Bitcoin** | Taproot, SegWit, Legacy |
| **Networks** | Mainnet, Testnet, Signet, Regtest |
| **Ordinals** | Browse inscriptions via ordinals.com |
| **OPNet** | OP20 tokens, swaps, smart contract interaction |
| **UTXO Management** | Consolidation, visualization, RBF cancel |
| **Address Rotation** | Quantum-resistant via non-reuse |
| **Custom RPC** | Per-network endpoint configuration |
| **IPFS Gateways** | Health monitoring, failover, local node support |
| **Security** | Per-site permissions, auto-lock, risk assessment |
| **Open Source** | Apache-2.0 |

## Installation

### Manual Install

1. Download or build from source (see below)
2. Unzip

**Chrome / Brave / Edge / Opera:**

1. Go to `chrome://extensions/` (or equivalent)
2. Enable Developer Mode
3. Click Load unpacked
4. Select the `dist/chrome` folder

### Build from Source

```bash
git clone https://github.com/bitbragi/MyScribe-Wallet.git
cd MyScribe-Wallet
npm install

# Build for Chrome
npm run build:chrome

# Dev with hot reload
npm run dev:chrome
```

Requires Node.js 24+.

## Security & Upstream

MyScribe Wallet is a UI skin and feature extension of [OP_WALLET](https://github.com/btc-vision/opwallet), which was audited by [Verichains](https://verichains.io). No core wallet logic, key management, transaction signing, or OPNet smart contract code has been modified. MyScribe changes are limited to branding/aesthetics and restoring Ordinals browsing support (originally present in UniSat, removed by OP_WALLET). OPNet upstream updates are synced automatically.

### Vulnerabilities

**DO NOT** open public issues for security bugs. Report via [GitHub Security Advisories](https://github.com/bitbragi/MyScribe-Wallet/security/advisories/new).

## Contributing

1. Fork
2. Branch
3. Code
4. `npm run lint`
5. PR

## License

[Apache-2.0](LICENSE)

## Links

- [MyScribe](https://myscribe.org)
- [OPNet](https://opnet.org)
- [GitHub](https://github.com/bitbragi/MyScribe-Wallet)
