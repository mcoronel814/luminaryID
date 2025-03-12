# LuminaryID

A privacy-focused identity management DApp built on the Midnight blockchain.

## About

LuminaryID allows users to securely manage their identity credentials on the Midnight blockchain. The application leverages Midnight's unique privacy features including confidential smart contracts and zero-knowledge proofs to ensure that users maintain control over their personal data while still being able to prove claims about their identity.

## Features

- **Secure Wallet Connection**: Connect to Midnight Lace wallet
- **Credential Management**: Store and retrieve encrypted identity credentials
- **Attribute Verification**: Generate zero-knowledge proofs to verify specific attributes without revealing sensitive information

## Technology Stack

- **Frontend**: Svelte + TypeScript + Vite
- **Styling**: TailwindCSS
- **Blockchain**: Midnight Network
- **Libraries**:
  - `@midnight-ntwrk/dapp-connector-api`: For wallet connection and transaction signing
  - `@midnight-ntwrk/midnight-js-contracts`: For interaction with confidential smart contracts

## Getting Started

1. Clone the repository
2. Install dependencies:


## Architecture

LuminaryID is built as a client-side DApp that interacts directly with the Midnight blockchain through the user's wallet. The application flow follows:

1. **Connect**: User connects their Midnight Lace wallet
2. **Identity**: User can store or retrieve their encrypted credentials
3. **Verify**: User can generate zero-knowledge proofs for selective disclosure of attributes

## Future Enhancements

- Support for multiple credential types
- Integration with third-party verifiers
- Improved UI/UX with additional user feedback
- Mobile-responsive design
- Multi-language support

## License

[MIT License](LICENSE)