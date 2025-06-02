# LuminaryID: Private Identity on the Midnight Blockchain (Proof-of-Concept)

LuminaryID is a Proof-of-Concept (PoC) demonstrating a privacy-preserving Decentralized Identity (DID) Decentralized Application (DApp). It's designed conceptually for the **Midnight Blockchain**, aiming to leverage its native Zero-Knowledge Proof (ZKP) capabilities (specifically zk-SNARKs) for managing identity attributes privately and enabling selective disclosure.

This project was developed as part of a Master's Project in Cybersecurity.

## Table of Contents

- [Background](#background)
- [The LuminaryID Approach](#the-luminaryid-approach)
  - [Intended Midnight Smart Contract Design](#intended-midnight-smart-contract-design)
  - [Proof-of-Concept (PoC) Implementation](#proof-of-concept-poc-implementation)
- [Features Demonstrated (by PoC)](#features-demonstrated-by-poc)
- [Technology Stack](#technology-stack)
- [Project Status & Context](#project-status--context)
- [Getting Started: Running the PoC](#getting-started-running-the-poc)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Running the Development Server](#running-the-development-server)
- [Intended Smart Contract (`LuminaryID.compact`)](#intended-smart-contract-luminaryidcompact)
- [Limitations of the PoC](#limitations-of-the-poc)
- [Future Work](#future-work)
- [Acknowledgments](#acknowledgments)
- [License](#license)

## Background

Current digital identity systems often face a trade-off between verifiability and user privacy. Centralized systems can lead to data silos and breaches, while standard blockchain implementations for Decentralized Identity (DID) can expose user activity due to ledger transparency. LuminaryID explores a solution to this by designing a system where users can control their identity attributes, store them privately (as commitments), and prove specific claims about them without revealing the underlying data.

## The LuminaryID Approach

### Intended Midnight Smart Contract Design

The core of LuminaryID was designed as a smart contract for the Midnight blockchain, written in **Compact** (Midnight's DSL for ZK circuits). The key concepts include:

-   **Ledger State:** Storing only cryptographic **commitments** (e.g., using `persistent_commit`) to private user attributes (like Date of Birth, Country) in a public map, keyed by a user's public identifier. Raw data remains off-chain.
-   **Witness Model:** Utilizing Midnight's witness functions to allow the ZK circuits to securely access local, private user data (e.g., secret keys, attribute values, nonces) during proof generation without exposing this data on-chain.
-   **ZK Circuits:**
    -   `registerIdentity`: To privately register identity attribute commitments.
    -   `updateAttribute`: To privately update existing attribute commitments.
    -   `proveAttributeValue`: To generate a ZK proof verifying a claim about an attribute (e.g., "Country is USA") without revealing the attribute itself or other sensitive information.

### Proof-of-Concept (PoC) Implementation

Due to significant tooling challenges with the Midnight Testnet compiler and development environment (preventing reliable compilation and deployment of the Compact smart contract), this project pivoted to a **functional Proof-of-Concept (PoC)**.

The PoC consists of:
-   A **Svelte/TypeScript frontend application** that implements the user interface and user flows.
-   A **mocked backend** (within the frontend code) that simulates the intended Midnight smart contract logic, ZKP operations, wallet interactions, and ledger state changes.

## Features Demonstrated (by PoC)

The PoC application simulates and demonstrates the following:
-   Mock connection to a "Midnight Lace wallet".
-   Derivation of a mock public identifier from a user-provided mock secret key.
-   User registration of identity attributes (Date of Birth, Country).
-   Storage of simulated cryptographic commitments on a mock ledger.
-   Local management of simulated private nonces (essential for ZKPs).
-   Generation of simulated Zero-Knowledge proofs to verify attribute equality (e.g., proving "Country is USA").
-   Demonstration of both successful and failed proof scenarios, reflecting the logic of ZKP verification.

## Technology Stack

**Proof-of-Concept Frontend:**
-   **Framework:** Svelte (v4.x)
-   **Language:** TypeScript (v5.x)
-   **Build Tool:** Vite (v5.x)
-   **Styling:** Tailwind CSS (v3.x)
-   **Cryptography (Mocked):** `@noble/hashes` (for SHA256 as a placeholder for commitments)
-   **Midnight Libraries (for types/utilities):**
    -   `@midnight-ntwrk/dapp-connector-api`
    -   `@midnight-ntwrk/compact-runtime`
    -   `@midnight-ntwrk/midnight-js-utils`

**Intended Backend (Not Deployed):**
-   **Blockchain:** Midnight Network (Testnet)
-   **Smart Contract Language:** Compact

## Project Status & Context

-   **Status:** Proof-of-Concept (PoC). The intended Compact smart contract could not be reliably compiled or deployed due to Midnight Testnet tooling issues encountered during the project period (Q1-Q2 2025).
-   **Context:** This project was developed as a Master's Project in Cybersecurity. The focus shifted to thoroughly designing the intended system and simulating its core privacy mechanisms via the PoC.

## Getting Started: Running the PoC

To run the LuminaryID PoC DApp locally:

### Prerequisites
-   Node.js (v18 LTS or later recommended)
-   npm (usually comes with Node.js) or yarn

### Installation
1.  Clone the repository:
    ```bash
    git clone https://github.com/mcoronel814/luminaryID.git
    cd LuminaryID
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
    *(Note: If you encounter peer dependency issues, you might have previously needed `npm install --legacy-peer-deps` due to Vite/plugin versioning, but try a standard install first.)*

### Running the Development Server
1.  Start the Vite development server:
    ```bash
    npm run dev
    ```
2.  Open your browser and navigate to the local URL provided (usually `http://localhost:5173`).

## Intended Smart Contract (`LuminaryID.compact`)

The design for the intended Midnight smart contract can be found in the file `src/contracts/LuminaryID.compact`. This file contains the Compact code outlining the ledger state, witness functions, and ZK circuits for `registerIdentity`, `updateAttribute`, and `proveAttributeValue`.

*(Note: This contract was not deployable due to compiler issues during the project timeframe.)*

## Limitations of the PoC

-   **No Real Cryptography:** The PoC uses simple SHA256 hashing to *represent* commitments and logical checks to *simulate* ZKP verification. It **does not** provide any actual Zero-Knowledge cryptographic security or privacy guarantees.
-   **No On-Chain Interaction:** All backend logic, ledger state, and nonce storage are mocked in the browser's memory and do not interact with any actual blockchain.
-   **Performance Not Evaluated:** The PoC cannot provide insights into real-world transaction costs (gas), ZKP generation times, or network latency.
-   **Simplified Mocking:** Nonce management and secure local storage are simplified for demonstration.

## Future Work

Based on the project findings and the PoC, future work could include:
-   **Full Implementation:** Deploying the `LuminaryID.compact` smart contract on a stable Midnight mainnet or testnet once tooling matures.
-   **Enhanced ZK Proofs:** Implementing more complex proofs (e.g., range proofs for age, set membership).
-   **Formal DID Method:** Developing a `did:midnight:luminaryid` method specification.
-   **Verifiable Credentials (VC) Integration:** Integrating with the W3C VC standard.
-   **Performance & Security Analysis:** Conducting thorough testing and audits of the deployed system.

## Acknowledgments

This project benefited from the guidance of Professor Usman Rauf and the helpful discussions within the official Midnight Developer community. More detailed acknowledgments are available in the associated Master's thesis paper.

## License

*(You should choose a license. MIT is a common and permissive choice for open-source projects. If you want to use MIT, include the following, otherwise replace it.)*

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details (you'll need to create this file if you choose MIT).
