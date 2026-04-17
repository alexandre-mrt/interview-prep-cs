# Mysten Labs — Interview Prep Research

Research compiled 2026-04-17. Targets a senior/staff engineering interview. Feeds downstream
flashcard generation (~60 cards) and a dedicated topic page on the interview-prep site.

All sources cited inline as URLs. When something is not firmly verified, it is explicitly
marked "unknown — verify in interview prep session".

---

## 1. Company

### 1.1 Founders and leadership

Mysten Labs was founded in 2021 by five engineers who left Meta's Novi / Diem (formerly Libra)
project after Diem wound down. The five are:

- **Evan Cheng** — Co-founder and CEO. Longtime LLVM core contributor (started LLVM register
  allocator work at Apple), former Director of Engineering for Programming Languages and
  Runtimes at Facebook/Meta. Ran the Novi blockchain eng organization.
- **Sam Blackshear** — Co-founder and CTO. Creator of the Move programming language at
  Facebook. PhD from U. Colorado Boulder; previously at Facebook working on Infer static
  analysis and then Move.
- **Adeniyi Emmanuel Abiodun** ("Niyi") — Co-founder and CPO. Previously Head of Product at
  Novi. Public face for Sui roadmap + privacy narrative in 2026.
- **George Danezis** — Co-founder and Chief Scientist. Professor of Security and Privacy
  Engineering at University College London. Co-author of Narwhal, Bullshark, Mysticeti, Chainspace,
  Coconut, and many other distributed-systems / privacy papers.
- **Kostas "Kryptos" Chalkias** — Co-founder and Chief Cryptographer. Previously Principal
  Cryptographer at Novi. Focus on zkLogin, signature aggregation, and post-quantum work.

Sources:
- [Mysten Labs — Crunchbase](https://www.crunchbase.com/organization/mysten-labs)
- [Tracxn Mysten Labs profile](https://tracxn.com/d/companies/mysten-labs/__QmCLeZnclEni5P_2WOuP2fVnzblO9ZVtHPvdlmr4FhA)
- [Mysten Labs homepage](https://www.mystenlabs.com/)

### 1.2 Funding history

- **Seed**: ~$36M (Dec 2021) led by Andreessen Horowitz (a16z crypto). Participants included
  Redpoint, Lightspeed, Coinbase Ventures, Electric Capital, Standard Crypto, NFX, Slow
  Ventures, Scribble, Samsung NEXT, Hack VC.
- **Series B**: $300M (Sep 2022) at a ~$2B valuation, led by FTX Ventures (invalidated post-FTX
  collapse — FTX's stake was bought back/restructured in 2023). Other investors: a16z, Jump
  Crypto, Apollo, Binance Labs, Circle Ventures, Franklin Templeton, Lightspeed, Sino Global.
- Total disclosed: **~$336M** across two rounds from 44 investors.
- Mysten Labs bought back FTX's equity/tokens in mid-2023 at a significant discount, tightening
  the cap table.

Sources:
- [PitchBook Mysten Labs profile](https://pitchbook.com/profiles/company/484702-93)
- [Crunchbase funding history](https://www.crunchbase.com/organization/mysten-labs)

### 1.3 Headquarters and headcount

- **HQ**: San Francisco Bay Area (Palo Alto → more recently SF-adjacent). Remote-friendly.
- **Headcount (Jan 2026)**: ~203 employees per Tracxn. Reviews consistently describe the
  company as "remote work friendly" with SF hub.
- Secondary office footprint in London (Danezis / cryptography research cluster).

Sources:
- [Tracxn Mysten Labs profile](https://tracxn.com/d/companies/mysten-labs/__QmCLeZnclEni5P_2WOuP2fVnzblO9ZVtHPvdlmr4FhA)
- [Built In SF Mysten Labs page](https://www.builtinsf.com/company/mysten-labs)

### 1.4 Mission and positioning in the L1 landscape

Public framing: **"shaping the future of the internet"** by building web3 infrastructure that
is fast, safe, and accessible to mainstream users. The Sui thesis is that the account model
(Ethereum/Solana-lite) is a dead end for general consumer + gaming + financial use cases
because it prevents parallel execution, makes ownership implicit, and requires developers to
fight the data model. Sui's **object-centric model** is the opinionated answer.

Positioning vs. peers:

- **Ethereum**: Sui is an alternative L1, not an L2. Optimizes for throughput + parallelism
  + UX (zkLogin) over EVM compatibility. 2026 roadmap includes a native ETH bridge.
- **Solana**: closest "monolithic L1 optimized for performance" peer. Sui differentiates via
  object model and Move's safety vs. Solana's account model + Rust (unrestricted).
- **Aptos**: the other Move chain, also ex-Diem. Uses stock Move (not Sui Move) with
  account/resource model closer to original Diem. Consensus currently Bullshark-based.
- **Walrus + Seal + Nautilus + DeepBook**: Mysten is bundling a full-stack "Sui Stack" (S2)
  rather than being just an L1. This is the 2025–2026 narrative shift.

Sources:
- [Mysten Labs homepage](https://www.mystenlabs.com/)
- [2025 in Review: How The Sui Stack Came Together](https://blog.sui.io/2025-sui-stack-developments/)
- [UTXO vs Account vs Object — BlockEden](https://blockeden.xyz/blog/2026/02/17/utxo-vs-account-vs-object-transaction-models/)

### 1.5 Recent news (last ~6 months, Oct 2025 → Apr 2026)

**Mysticeti v2 (Nov 6, 2025)** — major consensus engine upgrade. Merges validation into
consensus, introduces a new Transaction Driver, removes redundant pre-consensus checks.
Benchmarks show latency reduction ~25–35% (largest gains in Asia), TPS bump in same range.

Sources:
- [Mysticeti v2 launch — KuCoin flash](https://www.kucoin.com/news/flash/sui-s-mysticeti-v2-upgrade-cuts-latency-boosts-tps-by-25-35)
- [Mysticeti v2 MEXC writeup](https://www.mexc.com/news/157553)

**Seal mainnet launch (Jan 2026)** — decentralized secrets management / encryption with
onchain access policies + offchain key server network. First-party product, integrates with
Walrus storage and Nautilus TEE.

Sources:
- [Seal mainnet launch blog](https://www.mystenlabs.com/blog/seal-mainnet-launch-privacy-access-control)
- [Seal homepage](https://seal.mystenlabs.com/)
- [Sui unveils Seal — Crypto Times](https://www.cryptotimes.io/2026/01/09/sui-unveils-seal-to-bring-native-encryption-to-blockchain-apps/)

**Nautilus framework** — verifiable offchain compute on Sui using AWS Nitro Enclaves (TEE).
Pairs with Seal for "compute on encrypted data with onchain verifiability."

Sources:
- [Nautilus announcement](https://blog.sui.io/nautilus-offchain-security-privacy-web3/)
- [Nautilus GitHub](https://github.com/MystenLabs/nautilus)
- [Nautilus docs](https://docs.sui.io/concepts/cryptography/nautilus)

**Private transactions roadmap (2026)** — Niyi Abiodun publicly outlined a privacy roadmap
for Sui intended to deliver "full privacy while remaining compliant" through 2026. Components
include Seal, zk primitives, and encrypted state extensions.

Sources:
- [Sui plans private transactions for 2026 — Bitcoinist](https://bitcoinist.com/sui-plans-private-transactions-for-2026/)
- [Sui outperforms BTC/ETH as Mysten promotes privacy — CoinDesk](https://www.coindesk.com/markets/2026/01/06/sui-outperforms-bitcoin-and-ether-as-mysten-labs-promotes-privacy-tech)

**Jan 14, 2026 mainnet outage (~6 hours)** — largest incident since launch. Root cause: edge
case in consensus commit processing caused validators to produce divergent checkpoint
candidates, stalling checkpoint certification. ~$1B in assets temporarily frozen; user funds
never at risk (safety preserved, liveness lost). Fixes: new deterministic checkpoint
consistency checks + fuzz-style testing for consensus edge cases + improved validator
automation. Third notable incident in Sui history (prior: Nov 2024 brief halt, Dec 2025
degraded performance).

Sources:
- [Sui blames consensus bug for Jan 14 outage — crypto.news](https://crypto.news/sui-consensus-bug-six-hour-network-outage-2025/)
- [Coinspeaker: Sui major outage](https://www.coinspeaker.com/sui-network-mainnet-outage-january-2026/)
- [Post-mortem details — CryptoRank](https://cryptorank.io/news/feed/2d2f4-sui-network-outage-post-mortem-report)
- [Sui status page](https://status.sui.io/)

**Alibaba Cloud partnership** — expansion of Sui developer infrastructure in APAC, includes
an AI-assisted Move coding tool with ChainIDE.

Sources:
- [Mysten Labs and Alibaba Cloud — Altcoin Buzz](https://www.altcoinbuzz.io/cryptocurrency-news/mysten-labs-and-alibaba-cloud-boost-sui-developer-support/)

**Gaming: EVE Frontier + Xociety** — EVE Frontier (CCP Games, the EVE Online studio) launches
on Sui as native L1. Xociety likewise. Mysten's gaming lead has been publicly vocal about 2026
as the "gaming delivery year."

Sources:
- [2026 Trends: Mysten's Anthony Palma — BlockchainGamer.biz](https://www.blockchaingamer.biz/features/interviews/41233/2026-trends-mysten-labs-anthony-palma-eve-frontier-xociety-success-sui/)

**2026 roadmap items named publicly**:
- Native ETH bridge (trust-minimized)
- **Remora** horizontal scaling / sharding-adjacent design
- Expanded SuiNS (naming service)
- zkLogin hardening
- Privacy stack (Seal + on-chain encryption primitives)

Sources:
- [2025 in Review — Sui blog](https://blog.sui.io/2025-sui-stack-developments/)
- [Sui Network 2025–2026 investment case — AInvest](https://www.ainvest.com/news/sui-network-2025-2026-investment-case-generation-layer-1-blockchain-2512/)

---

## 2. Products (deep)

### 2.1 Sui blockchain — object-centric model

In Sui, **everything is an object** with a globally unique 32-byte ID (`UID`). An object has:
- a unique ID,
- a version (monotonically increasing),
- owner metadata (address, another object, shared, or immutable),
- typed contents (a Move struct with the `key` ability whose first field is `id: UID`).

Ownership kinds:
- **Address-owned**: only a specific address can pass it as input to a transaction. Mutations
  do not require consensus — they go through Sui's broadcast / fast path (formerly known as
  Sui Lutris fast-path).
- **Shared**: anyone can read/write per the Move module's logic. Mutations must go through
  consensus (Mysticeti) because concurrent writes need ordering.
- **Immutable** (frozen): no one can mutate; no consensus needed; parallel reads only.
- **Object-owned** (dynamic fields / dynamic object fields): the parent owns child objects,
  access mirrors the parent.

**Why this matters** — in an account model (EVM/Solana), the validator cannot know ahead of
execution which accounts a transaction will touch, so global ordering is needed before
execution. In Sui's object model, every transaction *declares* its input objects by ID and
version upfront. Two transactions that do not share any owned-mutable object can execute in
parallel. Owned-object transactions can skip consensus entirely (fast path, sub-300ms
confirmation is typical).

Sources:
- [Sui object model docs](https://docs.sui.io/concepts/object-model)
- [All About Blockchain Data Models — Sui blog](https://blog.sui.io/blockchain-data-models-explained/)
- [Cointelegraph — Exploring Sui's Object-Centric Model](https://cointelegraph.com/research/sui-object-centric-model-move-programming-language)
- [All About Parallelization — Sui blog](https://blog.sui.io/parallelization-explained/)
- [Sui Lutris paper](https://docs.sui.io/paper/sui-lutris.pdf)

### 2.2 Move (Sui flavor)

Move was originally designed at Facebook/Diem by Sam Blackshear as a resource-oriented
language where digital assets are represented by linear types that cannot be copied or
silently discarded. Sui Move diverges from "core Move" (used by Aptos) in significant ways:
Sui replaced the global-storage model with **object-addressed storage** keyed by `UID`.

#### 2.2.1 Abilities

Every struct in Move declares a subset of four abilities. These govern what the type system
lets you do with values of that type.

- `copy` — value can be copied by value (implicit duplication allowed). Integers and bool
  have this. Resources (like coins) do NOT.
- `drop` — value can be silently discarded at end of scope. If a struct lacks `drop`, you
  MUST explicitly consume it (transfer, move into another struct, or destructure via
  `let Struct{} = x`) or the function will not compile.
- `key` — struct can be used as a top-level object (storable in Sui's object store). On Sui,
  requires the first field to be `id: UID`. Having `key` marks the type as an object.
- `store` — struct can be held inside another struct that has `key`, i.e., it can live in
  global storage. Often combined with `key` for object types.

Canonical combinations:
- Asset/resource: `key, store` (NO copy, NO drop) — the classic "linear asset" guarantee.
- Plain data: `copy, drop, store`
- Capability tokens: `key` only (can't be copied, can't be dropped, can't be stored inside
  another struct — must live at the top level).

Sources:
- [Sui move intro course — abilities](https://github.com/sui-foundation/sui-move-intro-course/blob/main/unit-one/lessons/3_custom_types_and_abilities.md)
- [Move book — Sui object](https://move-book.com/reference/abilities/object/)
- [Move concepts — Sui docs](https://docs.sui.io/concepts/sui-move-concepts)
- [Zellic — Move security primer 2](https://www.zellic.io/blog/move-fast-break-things-move-security-part-2/)

#### 2.2.2 Entry functions

`entry fun` is callable as the top-level function of a transaction. Constraints:
- parameters can be primitives, objects, or `vector<T>` of the same;
- must not return values (except generics); the transaction's effect must be observable as
  side effects (transfers, events, shared-object mutations).

A regular `public fun` can also be called from a PTB but via another Move function wrapping
it; `entry` was the legacy restrictor. In modern Sui, `public fun` with object inputs is the
preferred pattern, and `entry` is reserved for cases where you *don't* want the function to
be composable into other Move modules (it locks external callers to PTB-only).

Sources:
- [Sui move intro course — functions](https://intro.sui-book.com/)
- [Sui Move conventions](https://docs.sui.io/concepts/sui-move-concepts/conventions)

#### 2.2.3 Programmable Transaction Blocks (PTBs)

A PTB is a transaction made of up to **1,024 commands** executed atomically. Commands:
- `MoveCall(pkg, module, func, args)` — invoke any public Move function
- `TransferObjects(objects, recipient)`
- `SplitCoins(coin, amounts)`
- `MergeCoins(primary, [others])`
- `MakeMoveVec(type, elements)`
- `Publish`, `Upgrade` (for package publication/upgrade)

Arguments can be:
- `Input(i)` — references the i-th input (owned object, shared object, pure bytes)
- `Result(i)` — the result of the i-th command (single return)
- `NestedResult(i, j)` — the j-th tuple element of the i-th command's return

Key properties:
- **Atomic**: one command failure reverts the whole PTB.
- **Composable**: output of one call is the input of the next without an intermediate signed
  transaction → huge gas and latency win.
- **No new package needed**: you can stitch together calls across unrelated Move packages.

Worked example: swap-then-stake in a single PTB
1. `SplitCoins(gas_coin, [1000])` → `Result(0)`
2. `MoveCall(dex::swap, [Result(0), min_out])` → `Result(1)` (a new Coin<TokenB>)
3. `MoveCall(staking::stake, [Result(1)])` → done.

Sources:
- [Programmable Transaction Blocks — Sui docs](https://docs.sui.io/concepts/transactions/prog-txn-blocks)
- [Building PTBs](https://docs.sui.io/guides/developer/sui-101/building-ptb)
- [All About PTBs — Sui blog](https://blog.sui.io/programmable-transaction-blocks-explained/)

### 2.3 Consensus — Narwhal → Bullshark → Mysticeti

The consensus family used at Sui is a line of **DAG-based BFT** protocols. The invariant
across all of them is "separate data availability from ordering."

#### 2.3.1 Narwhal (2021–2022) — mempool / DAG layer

Narwhal is a **reliable broadcast mempool** structured as a round-based DAG. Each validator
runs a *primary* (which proposes block headers containing references to worker batches) and
a set of *workers* (which broadcast transaction batches and produce certificates of
availability). A round in the DAG requires 2f+1 certified predecessors from the previous
round. Narwhal won EuroSys 2022 Best Paper.

Narwhal's key insight: dissemination throughput scales with the number of workers, not the
number of consensus participants. Once data is certified available, the consensus protocol on
top only has to order the (small) headers, not the (large) transactions.

- Reported throughput: **>130k TPS** on WAN with production crypto and persistent storage.

#### 2.3.2 Tusk and Bullshark (2022) — consensus on top of Narwhal

Tusk: asynchronous consensus on a Narwhal DAG using shared randomness.
Bullshark: partially-synchronous variant, simpler (~200 LOC on top of Narwhal), lower latency
in the common case. Bullshark became the production consensus on Sui mainnet from launch
through mid-2024.

#### 2.3.3 Mysticeti (2024–present) — uncertified DAG + fast commit

Mysticeti drops the explicit certification step of Narwhal ("uncertified DAG"): each block is
broadcast but not explicitly certified before being referenced in the DAG. A novel commit
rule lets every block be a leader candidate and commit without the classical quorum-of-
certificates delay.

- **Mysticeti-C**: first Byzantine consensus to hit **~0.5s WAN commit latency** at
  **>200k TPS**. In Sui's production cutover, P50 latency dropped from ~1900 ms (Bullshark) to
  ~390 ms (Mysticeti-C) across 106 validators.
- **Mysticeti-FPC** (Fast Path Commit): extends Mysticeti-C with a fast path for asset-
  transfer transactions (owned-object only), weaving them into the DAG to skip the consensus
  path entirely. This is the mechanism behind Sui's sub-300 ms owned-object confirmation.
- **Mysticeti v2 (Nov 2025)**: merges validation into consensus, removes redundant pre-
  consensus checks, replaces the legacy Transaction Driver. ~25–35% additional latency
  reduction. This is the current production consensus.

Characteristics to mention in interview:
- DAG-based (blocks reference 2f+1 parents in prev round, not linear).
- Leader rotation — multiple leaders per round, parallel proposal.
- Decoupled dissemination and ordering — throughput bottleneck is broadcast bandwidth, not
  consensus logic.
- Tolerates f Byzantine faults out of 3f+1 stake (standard BFT quorum).
- Live under partial synchrony (Mysticeti-C).

Sources:
- [Mysticeti paper (arXiv 2310.14821)](https://arxiv.org/abs/2310.14821)
- [Mysticeti paper PDF on Sui docs](https://docs.sui.io/paper/mysticeti.pdf)
- [Mysticeti — Sui blog](https://blog.sui.io/mysticeti-consensus-reduce-latency/)
- [Sui features — Mysticeti](https://www.sui.io/mysticeti)
- [Narwhal GitHub](https://github.com/MystenLabs/narwhal)
- [Bullshark paper (arXiv 2201.05677)](https://arxiv.org/pdf/2201.05677)
- [DAG Meets BFT — Decentralized Thoughts](https://decentralizedthoughts.github.io/2022-06-28-DAG-meets-BFT/)
- [Mysticeti v2 writeup — MEXC](https://www.mexc.com/news/157762)

### 2.4 Walrus — decentralized storage

Walrus is Mysten's decentralized blob storage network. It is a **separate chain's-worth-of-
coordination** layered on top of Sui: Walrus stores blobs across storage nodes using erasure
coding, and Sui is used as the **control plane** (commitments, payments, availability
attestations, governance).

Architecture:
- **Red Stuff** — a 2D erasure code based on the Twin-code framework. A blob is encoded into
  `f+1` primary slivers (vertical dimension) and `2f+1` secondary slivers (horizontal). Each
  storage node holds one primary and one secondary sliver.
- **Replication factor ~4.5x** for Byzantine tolerance (compare 3x for naive 3-way
  replication with no Byzantine guarantee, and ~10x+ for raw Filecoin-style storage
  depending on sector size).
- **Self-healing**: if a node loses data, recovery bandwidth is proportional to the amount of
  lost data, not to the full blob. Surviving nodes contribute slivers and the dropped node's
  slivers are regenerated without central coordination.
- **Availability guarantee**: blobs retrievable if up to 2/3 of the storage network is
  offline (same threshold as BFT consensus).
- **Sui integration**: blob IDs and commitments live as Sui objects. Payments, ownership
  transfer, and expiration use Move logic. Seal ciphertexts commonly stored on Walrus.
- **Token**: `$WAL` — for storage payments and staking.

Sources:
- [Walrus paper (arXiv 2505.05370)](https://arxiv.org/html/2505.05370v2)
- [Walrus whitepaper PDF](https://docs.wal.app/walrus.pdf)
- [Red Stuff encoding explained — walrus.xyz blog](https://www.walrus.xyz/blog/how-walrus-red-stuff-encoding-works)
- [Luganodes — Walrus rethinking storage](https://www.luganodes.com/blog/walrus-decentralized-storage)
- [Backpack — What is Walrus](https://learn.backpack.exchange/articles/what-is-walrus-a-programmable-decentralized-storage-network)

### 2.5 DeepBook — onchain CLOB

DeepBook is Sui's native **Central Limit Order Book**, not an AMM. Design notes:

- Each trading pair has a **shared object `Pool<Base, Quote>`** holding the order book and
  escrow vault. Because it's shared, every order touches the same shared object and must go
  through consensus — but the matching logic is fast (nested crit-bit tree for bids and for
  asks).
- Matching engine fills taker orders synchronously within the transaction that submits them.
  Maker orders sit in the book as linked entries keyed by price, then by FIFO.
- Shared liquidity: because DeepBook is at the protocol-layer primitive level, any dApp on
  Sui can source liquidity from the same pool without wrapping / bridging / LP fragmentation.
- DeepBook v3 (2024+) added governance, flash loans, improved account abstraction, and
  tightened the matching engine.
- Typical finality ~390 ms; fees typically <$0.01 per trade.

Tradeoffs to mention: a shared-object CLOB is a worst case for Sui's parallel execution
(every order contends on one object), but because consensus latency is sub-second and matching
is O(log n), DeepBook still outperforms most EVM-based CLOBs.

Sources:
- [DeepBookV3 — Sui docs](https://docs.sui.io/standards/deepbook)
- [DeepBook homepage](https://www.deepbook.tech/)
- [DeepBook: Ultimate Liquidity Engine — Niyi Abiodun Substack](https://adeniyisui.substack.com/p/deepbook-the-ultimate-liquidity-engine)
- [DeepBook — Sui blog](https://blog.sui.io/deepbook-liquidity-launch/)

### 2.6 zkLogin

zkLogin lets a user authenticate to Sui with an existing OAuth credential (Google, Facebook,
Apple, Twitch) and transact from a Sui address without linking the onchain identity to the
Web2 identity.

Flow:
1. User signs in via OAuth and obtains a **JWT** signed by the OAuth provider.
2. Client generates an **ephemeral keypair** with a short expiry and includes its public key
   in the OAuth nonce (so the JWT commits to it).
3. Client hashes `(iss, aud, sub, salt)` to derive the Sui address. `salt` is a per-user
   value kept off the OAuth provider so the provider can't unilaterally derive the address.
4. Client generates a **Groth16 zkSNARK** over a `circom` circuit that proves:
   - JWT was signed by the known OAuth provider's public key,
   - `sub` (subject) matches the one committed to the address,
   - the ephemeral pubkey is embedded in the JWT's nonce,
   - without revealing `sub`, full JWT, or identifying info.
5. Transaction is sent with: ephemeral signature over the tx + zk proof + epoch + max-epoch.
6. Validators verify the Groth16 proof (using the known verifying key from the trusted setup
   ceremony) and accept the transaction.

Why Groth16: smallest proof size (~128 bytes) + cheapest verifier (~a few ms), which matters
because every validator verifies every transaction. ~1M R1CS constraints after circuit
optimizations (efficient JSON parse, string slicing).

**CRS ceremony**: Sui ran a multi-party trusted setup (Phase 2) with 111 contributions (82
browser + 29 Docker) to generate the Groth16 CRS. Soundness requires only one honest
contributor.

**Security model**: two-factor — you need a recent OAuth login AND the salt. If OAuth is
compromised, salt is still needed. If salt is lost, OAuth alone is insufficient.

Sources:
- [zkLogin docs](https://docs.sui.io/concepts/cryptography/zklogin)
- [zkLogin paper (arXiv 2401.11735)](https://arxiv.org/html/2401.11735v2)
- [CRS ceremony closing — Sui blog](https://blog.sui.io/crs-ceremony-zklogin/)
- [zkLogin ceremony contributions repo](https://github.com/sui-foundation/zklogin-ceremony-contributions)
- [Groth16 in Sui docs](https://docs.sui.io/guides/developer/cryptography/groth16)

### 2.7 SuiNS, Kiosk, Seal, Nautilus — ancillary primitives

**SuiNS** (Sui Name Service): onchain naming, NFT-based. `@username.sui` style. Ownership is a
transferable NFT object; resolution is a shared object. 2026 roadmap includes deeper
integration with wallets for user onboarding.

**Kiosk**: a protocol-level NFT marketplace primitive. A `Kiosk` is an object that holds
items (`place` / `take`), supports lock-and-list for sale, and enforces **transfer policies**
chosen by the creator. The creator's `TransferPolicy<T>` must be satisfied on every sale —
this is how royalty enforcement is made *actually* enforceable at the protocol level rather
than via off-chain marketplace agreement (the Ethereum failure mode).

**Seal** (mainnet Jan 2026): decentralized secrets management. A quorum of key-server nodes
hold shares of per-policy master keys; an onchain Move policy decides who can request
decryption. Apps encrypt with Seal's public keys, store ciphertext anywhere (typically
Walrus), and delegate access control to Sui Move.

**Nautilus**: verifiable offchain computation using AWS Nitro Enclaves (TEE). A Sui smart
contract can receive signed attestations from a TEE proving that a given computation was
run in an approved enclave. Paired with Seal, this lets devs do "compute over encrypted data
with onchain trust anchors" without rolling their own MPC or FHE stack.

Sources:
- [Sui Kiosk docs](https://docs.sui.io/standards/kiosk)
- [All About Kiosks — Sui blog](https://blog.sui.io/kiosks-nfts-royalties-explained/)
- [Empowering Creators with Sui Kiosk — Mysten blog](https://www.mystenlabs.com/blog/empowering-creators-with-sui-kiosk)
- [Seal homepage](https://seal.mystenlabs.com/)
- [Seal mainnet launch](https://www.mystenlabs.com/blog/seal-mainnet-launch-privacy-access-control)
- [Nautilus announcement](https://blog.sui.io/nautilus-offchain-security-privacy-web3/)
- [Nautilus docs](https://docs.sui.io/concepts/cryptography/nautilus)

---

## 3. Engineering culture and hiring

### 3.1 What Mysten engineers write publicly

- **Sui blog** (blog.sui.io) — consensus deep-dives, parallelization explainers, stack
  retrospectives. Strong in-house tradition of explaining tradeoffs in plain prose.
- **Mysten Labs blog** (mystenlabs.com/blog) — product launches and strategic narrative
  (privacy, gaming, stack).
- **GitHub** — `MystenLabs/sui` is the monorepo (Rust, ~2M+ LOC). Active PR velocity,
  public review. Also `MystenLabs/narwhal`, `MystenLabs/seal`, `MystenLabs/nautilus`,
  `MystenLabs/fastcrypto` (cryptography library), `MystenLabs/walrus`,
  `MystenLabs/move` (their Move fork).
- **Research papers** — Danezis, Chalkias, and others continue to publish at top venues
  (SOSP, CCS, NDSS, USENIX Security, EuroSys).
- **Conference talks** — Evan Cheng's Web Summit 2022 CEO talk is explicitly cited by Mysten
  recruiters as recommended pre-reading.

Sources:
- [Mysten Labs GitHub org](https://github.com/MystenLabs)
- [Sui research papers page](https://docs.sui.io/concepts/research-papers)

### 3.2 Interview process (public signal)

From the Mysten careers page + Glassdoor + candidate reports:

1. **Recruiter screen (~30 min)** — background, motivation for Mysten, comp expectations.
2. **Hiring-manager technical phone screen (~45 min)** — high-level discussion of past work,
   project deep-dive, "what do you know about Sui" check.
3. **Onsite loop — 4 × 45 min** for most eng roles. Mix of:
   - Coding (live, usually shared editor). Not LC-grind — expect systems-flavored problems.
   - Systems design (distributed systems focus; consensus / networking / storage tradeoffs).
   - Domain-specific deep dive (cryptography for crypto roles; Move / compiler for language
     roles; databases / perf for core roles).
   - Behavioral / "tell me about a time you failed / led a difficult project".
4. **Take-home possible** for SDK / dev-rel type roles. Rarer for core eng.
5. **Decision within ~1 week**, offer call, compensation discussion.

Format is "cross-functional view of breadth + depth" — they want people who can reason across
layers, not narrow specialists. Expect at least one interviewer who will poke at whether
you've actually read the consensus paper / Move language reference.

Sources:
- [Mysten careers page](https://www.mystenlabs.com/careers)
- [Ashby jobs for Mysten](https://jobs.ashbyhq.com/mystenlabs)
- [Glassdoor Mysten interviews](https://www.glassdoor.com/Interview/Mysten-Labs-Interview-Questions-E7563123.htm)
- [Blind Mysten Labs page](https://www.teamblind.com/company/Mysten-Labs)

### 3.3 Common interview themes

- **Distributed systems fundamentals**: CAP, FLP, consensus variants (Paxos/Raft/PBFT/
  HotStuff/DAG-BFT), replication, reliable broadcast, gossip, CRDTs, leader election.
- **Systems programming**: Rust ownership, async (tokio), lock-free data structures,
  serialization (BCS/bincode/proto), backpressure, flow control, zero-copy.
- **Blockchain specifics**: object vs account model, UTXO, state tries, execution semantics,
  consensus latency vs finality, MEV, gas metering, reorg semantics.
- **Move / smart contracts**: ability rules, generics, module privacy, upgrade policies,
  object graph invariants, why Move catches bugs Solidity doesn't.
- **Performance**: tail latency (P99), throughput vs latency tradeoffs, profiling (perf,
  flamegraphs, tokio-console), batching, pipelining, queueing theory (Little's law).
- **Cryptography**: ECDSA/EdDSA, BLS aggregation, Groth16 vs PLONK, hash functions,
  commitments, trusted setup, zk circuits at a block-diagram level.
- **Production eng**: incident response, observability, chaos testing, rolling upgrades,
  schema migration, safety vs liveness.

### 3.4 Coding bar expectations

From role postings:

- **Senior Software Engineer, Sui Core**: 5+ yrs systems/network in C++ or Rust. Has
  designed/operated distributed systems, consensus, storage, perf systems, or
  compilers/PL. Blockchain or crypto background "preferred" — not required, but you'll be
  expected to ramp fast.
- **Staff Software Engineer, Security**: senior + security chops (threat modeling, secure
  coding, crypto review). Can find bugs in a Move module on sight.
- **Senior SWE, TypeScript SDK**: strong TS, async patterns, API design, testing. Move
  knowledge is a plus.
- **Production Engineering / SRE**: Rust preferred (stack match), Go acceptable. Python/Bash
  scripting for debugging distributed systems. Kubernetes, Prometheus, Grafana, tracing.

Coding bar feel: "can you write production Rust under time pressure, with thoughtful error
handling and test-first thinking?" rather than "can you reverse a linked list in 5 minutes?"

Sources:
- [Senior SWE, Sui Core — Sui jobs board](https://jobs.sui.io/companies/mysten-labs/jobs/36525839-senior-software-engineer-sui-core)
- [Staff SWE, Security — EchoJobs](https://echojobs.io/job/mysten-labs-senior-software-engineer-security-owsoi)
- [Senior SWE, TS SDK — Crypto-Careers](https://www.crypto-careers.com/jobs/518721385-senior-software-engineer-typescript-sdk-at-mysten-labs)

---

## 4. Observability stack

This section is also consumed by the broader interview-prep site for a generic observability
topic page. Focus: Prometheus, Grafana, RED/USE, and Sui-specific dashboards.

### 4.1 Prometheus — metric types

Prometheus is a **pull-based** time-series database optimized for operational metrics. The
server scrapes HTTP `/metrics` endpoints (exposition format: text, one metric per line) at a
configured interval (typically 15 s or 60 s). Four primary metric types:

- **Counter** — monotonically increasing (resets only on process restart). Use for
  cumulative counts: requests served, errors, bytes sent. Never decrement. Query with
  `rate()` or `increase()`, never raw value. Example metric name: `http_requests_total`.

- **Gauge** — value can go up or down. Use for "current state": memory usage, queue length,
  connected peers, temperature. Query with raw value and `delta()` / `deriv()`. Example:
  `node_memory_MemAvailable_bytes`, `sui_validator_peers_connected`.

- **Histogram** — samples observations into pre-declared buckets. Client-side aggregation:
  each bucket is a cumulative counter of observations `<= upper_bound`. Exposes
  `_bucket` (the counters), `_sum` (sum of all observations), `_count` (total observations).
  Compute latency percentiles with `histogram_quantile(0.99, rate(x_bucket[5m]))`.
  Advantage: aggregatable across instances (you can sum buckets). Disadvantage: you must
  pick buckets in advance.

- **Summary** — client-side computed quantiles over a sliding window. Exposes pre-computed
  quantiles (e.g., 0.5, 0.9, 0.99), `_sum`, `_count`. Advantage: exact quantiles. Big
  disadvantage: **summaries do not aggregate** — you cannot average two instances' P99 to
  get the cluster P99. For anything multi-instance, prefer histograms.

Rule of thumb: default to histograms for latency and size distributions. Use summaries only
for single-instance, per-process quantiles.

Sources:
- [Prometheus metric types](https://prometheus.io/docs/concepts/metric_types/)
- [Prometheus — understanding metric types](https://prometheus.io/docs/tutorials/understanding_metric_types/)
- [VictoriaMetrics — counters, gauges, histograms, summaries](https://victoriametrics.com/blog/prometheus-monitoring-metrics-counters-gauges-histogram-summaries/)
- [Chronosphere — 4 primary Prometheus metric types](https://chronosphere.io/learn/an-introduction-to-the-four-primary-types-of-prometheus-metrics/)

### 4.2 PromQL essentials

- **Instant vector** — value per time series at a single instant: `http_requests_total`.
- **Range vector** — values per series over a window: `http_requests_total[5m]`.
- **Rate** — per-second rate of a counter over a window: `rate(http_requests_total[5m])`.
  Use `irate` for highly-variable counters (short-term rate, 2-sample), `rate` for graphs and
  alerts (smoother).
- **Aggregation** — `sum`, `avg`, `max`, `min`, `count`, `topk`, `bottomk`, optionally with
  `by (label)` or `without (label)`.
- **Percentiles** —
  `histogram_quantile(0.99, sum by (le, service) (rate(http_request_duration_seconds_bucket[5m])))`
  (remember: aggregate `rate` of `_bucket` first, then apply `histogram_quantile`).
- **Joins** — `on()`, `ignoring()`, `group_left()`, `group_right()`.
- **Subqueries** — `max_over_time(rate(x[1m])[1h:1m])`.
- **Alerting** — `ALERT` rules live in separate files, evaluated on same cadence as scraping.
  Alertmanager handles deduplication, grouping, silencing, routing.

### 4.3 Grafana

- **Dashboards** — folders, tags, permissions. Prefer version-controlled JSON (provisioning).
- **Variables** — template queries (`label_values(metric, label)`) so a single dashboard can
  filter by cluster / instance / service. Critical for reusable dashboards.
- **Data sources** — Prometheus is default; common stack also includes Loki (logs),
  Tempo (traces), OpenTelemetry.
- **Alerting** — unified alerting in modern Grafana (>=8). Rule groups, contact points,
  notification policies, silences. Can hit PagerDuty, Slack, webhooks.
- **Panels** — time series, bar gauges, stat, table, heatmap (good for histogram buckets).
- **Best practices** — alert on symptoms not causes; put user-facing SLOs in RED dashboards,
  resource health in USE dashboards; use stable panel IDs; avoid "mystery" thresholds.

Sources:
- [Grafana dashboard best practices](https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/)
- [Grafana — RED method](https://grafana.com/blog/the-red-method-how-to-instrument-your-services/)
- [Building a RED dashboard — Grafana/DeepWiki](https://deepwiki.com/grafana/intro-to-prometheus-breakouts/5.1-building-a-red-dashboard)

### 4.4 RED and USE

**RED (Tom Wilkie)** — for *services*. Three signals:
- **Rate** — requests per second.
- **Errors** — failed requests per second (or error ratio).
- **Duration** — latency distribution (P50, P95, P99 from histograms).

RED tells you how happy *users* are. This is what you alert on.

**USE (Brendan Gregg)** — for *resources* (CPU, memory, disk, network). Three signals:
- **Utilization** — % of time the resource is busy.
- **Saturation** — how much extra work is queued.
- **Errors** — resource error count (disk I/O errors, network drops).

USE tells you how happy *machines* are. This is what you dig into when RED fires.

Sources:
- [Grafana — RED method](https://grafana.com/blog/the-red-method-how-to-instrument-your-services/)
- [How we implemented RED and USE — THRON tech blog](https://medium.com/thron-tech/how-we-implemented-red-and-use-metrics-for-monitoring-9a7db29382af)
- [USE Method / Node — Grafana dashboard](https://grafana.com/grafana/dashboards/12136-use-method-node/)

### 4.5 Blockchain node observability — what to monitor

Standard blockchain-node dashboard metrics (generic):

- **Block/checkpoint height** — current height, lag vs. tip (critical for "am I caught up?").
  Alert on `tip - local > N` for more than M minutes.
- **Sync state** — bootstrapping vs. live vs. catching up.
- **Peer count** — connected peers, in/out split. Alert on < K peers.
- **Consensus round / view number** — current round, time in round. Rising without commit =
  stuck consensus.
- **Mempool size** — pending txs, bytes, oldest age. Signals for congestion or inclusion
  delay.
- **Finality latency** — time from submit to finality. Histogram, RED-style.
- **RPC latency** — per-method, P50/P99. Separate read vs. write.
- **Fork / reorg detection** — orphaned blocks, reorg depth distribution.
- **Disk I/O and state size** — RocksDB/LevelDB bloom, compaction, SST sizes. Common cause
  of silent validator degradation.
- **CPU / memory / network** — USE-style on the host.
- **Signature / crypto op rate** — can flag perf regressions (e.g., slow BLS verify).

### 4.6 Sui-specific observability

Sui node exposes Prometheus metrics on **port 9184** (`/metrics`) by default (RPC on 9000).
The `sui/nre/sui_for_node_operators.md` and `docs.sui.io/guides/operator/monitoring` pages
document the setup.

Metric families to look for (names based on public repo scan, subject to evolution):
- `sui_validator_*` — validator-specific (committee round, certificates, peers).
- `sui_fullnode_*` — fullnode sync status, checkpoint lag.
- `narwhal_*` / `consensus_*` — Mysticeti consensus metrics (round, latency, commit rate).
- `sui_network_*` — peer stats, gossip.
- `sui_execution_*` — transaction execution times, per-kind counts.
- `sui_authority_*` — authority aggregator stats.
- `rocksdb_*` — state store metrics (from the RocksDB client Prometheus hook).

Mysten ships recommended Grafana dashboards on Grafana Labs:
- SUI Fullnode Monitor Dashboard (id 18141)
- Sui Validator Dashboard 1.0 (id 18297)
- Sui Validator Metrics Container in Docker and System Monitoring (id 18512)

Mysten also pushes aggregated metrics to a central Sui metrics proxy for ecosystem-wide
observability; operators opt-in by default.

Sources:
- [Sui node monitoring docs](https://docs.sui.io/guides/operator/monitoring)
- [Grafana dashboard 18141 — SUI Fullnode](https://grafana.com/grafana/dashboards/18141-sui-fullnode-monitor/)
- [Grafana dashboard 18297 — Sui Validator](https://grafana.com/grafana/dashboards/18297-sui-validator-dashboard-1-0/)
- [Monitoring and alerts integration thread — Sui forum](https://forums.sui.io/t/monitoring-and-alerts-integration-for-your-node/15449)
- [Grafana Cloud — monitor Sui](https://grafana.com/docs/grafana-cloud/send-data/metrics/metrics-prometheus/prometheus-config-examples/mystenlabs-sui/)
- [sui_for_node_operators.md in MystenLabs/sui](https://github.com/MystenLabs/sui/blob/main/nre/sui_for_node_operators.md)

---

## 5. Likely interview questions (tailored)

For each: a category, a concise prompt, and a senior-level answer sketch with tradeoffs to
surface.

### 5.1 Systems & distributed systems

**Q1. (Distributed) Explain the CAP theorem and where Sui sits.**
- Under network partition, you pick C or A. Sui picks C (safety) over A (liveness) — see
  Jan 2026 outage: network halted rather than forking.
- Note partial synchrony assumption (Mysticeti-C is live under partial sync).
- Trade-off: permissionless L1s can't tolerate fork-and-merge because double-spend is fatal,
  so CP is the only correct choice.

**Q2. (Distributed) Walk through Mysticeti's commit rule at a block-diagram level.**
- DAG rounds, each block references 2f+1 parents from previous round.
- Every block is a potential leader; commit rule checks support in subsequent rounds.
- Uncertified (no explicit cert step) → saves 1 round-trip vs. Narwhal+Bullshark.
- FPC path bypasses consensus for owned-object txs.
- Mention: why this is lower latency than HotStuff (no pipeline stall).

**Q3. (Distributed) Narwhal vs. Bullshark vs. Mysticeti — what's the progression?**
- Narwhal: reliable broadcast mempool (DAG) — separates data from ordering. ~130k TPS.
- Bullshark: ordering on Narwhal DAG, ~200 LOC, partially synchronous.
- Mysticeti: uncertified DAG + novel commit rule → 0.5s WAN latency at 200k+ TPS.
- v2: consensus merges validation path, another ~25–35% latency win.

**Q4. (Distributed) Safety vs. liveness in a BFT protocol — give examples where each can
  break.**
- Safety: double-commit of conflicting txs (divergent checkpoints = exactly what broke in
  Jan 2026).
- Liveness: can't make progress (network partition, too many faulty leaders). Sui chooses to
  halt rather than violate safety.
- 3f+1 stake, Byzantine tolerance of f, why it's not 2f+1.

**Q5. (Systems) Design a reliable broadcast layer for 100 validators globally.**
- Point-to-point TLS gossip vs. structured overlay.
- QUIC vs. TCP (Sui uses Anemo / Tonic gRPC; tolerates jitter).
- Back-pressure, windowing, retries, dedup.
- Worker/primary split (Narwhal pattern).

**Q6. (Systems) How would you design the storage layer for a blockchain node?**
- Append-only log + merkle-style state tree + indexes.
- RocksDB is the de-facto choice (Sui uses it). Talk about bloom filters, compaction tuning,
  column families.
- State pruning vs. archive mode tradeoffs.
- Snapshot / catchup.

**Q7. (Performance) Your P99 latency doubled overnight. How do you debug?**
- RED dashboard first — is it all methods or specific? Is it all instances?
- Correlate with deploy timeline, traffic shape, resource saturation.
- Drill in with tracing (spans), flamegraphs (perf / tokio-console for Rust async).
- Common causes: GC/allocator pressure, lock contention, disk I/O stalls, hot path
  regression, upstream dependency latency.

### 5.2 Move / smart contracts

**Q8. (Move) What does it mean for a struct to lack `drop`, and why is that useful?**
- Struct must be explicitly consumed — transferred, destructured, or moved into another
  struct.
- Prevents "forgot to do something with this asset" bugs at compile time.
- Example: `Coin<T>` lacks drop → you can't leave one lying around in a function.

**Q9. (Move) Why does `key` require `id: UID` as first field in Sui Move?**
- Sui's storage is object-addressed, not account-addressed. Every top-level object needs a
  unique, immutable address. The `UID` is that address; first-field requirement lets the
  runtime pluck it out without reflection.
- Contrast with core Move (Aptos): storage is `address, type` keyed; no UID needed.

**Q10. (Move) Walk through a PTB that swaps SUI → USDC on DeepBook and stakes the USDC.**
- SplitCoins(gas, [amount]) → Coin<SUI>
- MoveCall(deepbook::pool::swap, [pool, Coin<SUI>, min_out]) → Coin<USDC>
- MoveCall(staking::stake, [Coin<USDC>, pool_id])
- Note: atomic, one transaction, fails atomically.

**Q11. (Move) What bugs does Move prevent that Solidity is vulnerable to?**
- Reentrancy (no external call-in-the-middle pattern, resources can't be held in multiple
  call frames).
- Integer overflow (Move's primitive types check by default in modern toolchains).
- Access control via phantom type parameters and explicit capability types rather than
  `msg.sender == owner` checks.
- "Missing storage update" bugs — linear types force explicit move/consume.

**Q12. (Move) Shared object vs. owned object — when to choose which?**
- Owned: parallelizable, consensus-free fast path. Use when exactly one actor mutates at a
  time.
- Shared: must go through consensus, sequential per object. Use for AMMs, books, registries.
- Hybrid: DeepBook has a shared pool but matches taker orders in one tx — shared is
  necessary for order matching.

**Q13. (Move) How do package upgrades work on Sui?**
- Packages are immutable; an "upgraded" package is a new package ID linked by an `UpgradeCap`
  owned by whoever controls upgrade.
- Policy choices: `compatible`, `additive`, `dep_only`, `immutable`. Governance often
  freezes to `immutable` after audit.
- Existing objects continue to refer to the old version; the Move type system enforces
  compatibility.

### 5.3 Cryptography

**Q14. (Crypto) Why Groth16 for zkLogin? What are the tradeoffs vs. PLONK?**
- Groth16: smallest proof (~128B), cheapest verification, most mature tooling (snarkjs /
  circom). Requires per-circuit trusted setup (Phase 1 universal + Phase 2 per-circuit).
- PLONK: universal setup (Phase 1 only), larger proofs, slightly more expensive verify, more
  flexible for circuit updates.
- zkLogin picked Groth16 because circuit is fixed (JWT parse) and verification cost is on
  every validator — optimize for verify.

**Q15. (Crypto) Explain the zkLogin address derivation.**
- `addr = H(iss || aud || sub || salt_hash)`.
- Why salt: binds address to something OAuth provider doesn't know, so provider can't derive
  addresses unilaterally.
- Why this is 2FA: need recent JWT (proves OAuth) + salt (out-of-band).

**Q16. (Crypto) Where does BLS fit in Sui?**
- Validator signatures on checkpoints + certificates use BLS12-381 for aggregation.
- 2f+1 validators sign; aggregate into a single pairing-verifiable signature → O(1) size
  checkpoint proof.
- Tradeoff: expensive signing/verify relative to Ed25519, but bandwidth + storage win
  dominates at scale.

### 5.4 Observability & production

**Q17. (Observability) Design dashboards for a Sui validator.**
- RED layer: consensus commit rate, RPC error rate, end-to-end tx latency (histogram).
- USE layer: CPU per core, RocksDB compaction queue, disk I/O util, network bytes.
- Consensus-specific: round number growth rate, leader rotations, blocks produced per epoch.
- Health: peer count, checkpoint lag vs. network tip, clock skew.
- Alerts: checkpoint lag > threshold, peer count < K, epoch boundary not advancing.

**Q18. (Observability) Why histogram over summary for latency?**
- Histograms are aggregatable across instances (sum the buckets, then apply
  `histogram_quantile`). Summaries pre-compute quantiles per-instance and cannot be
  combined.
- Histograms also cheaper client-side (just increment counters); summaries maintain a
  sliding window.

**Q19. (Incident) You're on call. Sui mainnet stops advancing checkpoints. What now?**
- Check status page / peer chat first (is it network-wide?).
- Pull consensus round metric on multiple validators: are they all stuck on same round?
- If yes: consensus issue (like Jan 2026). Coordinate with other operators; check log for
  divergence markers.
- If no: local issue — peers, disk, config.
- Communicate early, publish a status update.

### 5.5 Behavioral

**Q20. Tell me about a hard technical decision you made and the tradeoffs.**
- Senior signal: articulate options considered, why you rejected alternatives, how you
  validated, how you'd revisit. Avoid "we just picked X" with no reasoning.

**Q21. Tell me about a time you disagreed with a senior engineer. How did it resolve?**
- Use the "disagree respectfully on ideas, not people" pattern Mysten explicitly values in
  its culture materials.

**Q22. What's a bug you shipped to prod and how did you handle it?**
- Own it. Describe the blast radius, the fix, and the process change. Incident management
  experience matters a lot at Mysten given the Jan 2026 context.

**Q23. Why Mysten? Why Sui over [other L1]?**
- Must-answer. Thread the needle: genuine opinion on why object model / Move / Mysticeti are
  the right bets + humility that L1 competition is live.

**Q24. Where do you want to grow in the next 2 years?**
- Senior expectation: concrete growth areas + how Mysten uniquely enables them. Don't say
  "I want to learn Rust" if you're applying for a Rust role.

### 5.6 Bonus: open-ended systems design

**Q25. Design the Walrus storage network from scratch.**
- Erasure coding (Red Stuff), availability attestations, onchain control plane on Sui,
  storage node incentives, slashing for unavailability, recovery flow.
- Tradeoffs: replication factor vs. security, recovery bandwidth, metadata scaling.

**Q26. Design a cross-chain bridge from Sui to Ethereum.**
- Trust model: committee-attested vs. light-client-verified vs. zk-verified.
- Liveness under either chain's outage.
- Message ordering and replay protection.
- Sui's 2026 roadmap includes a native bridge; understand why a naive multisig bridge is
  unacceptable for a serious L1.

**Q27. Design a fair-ordering mempool to mitigate MEV on Sui.**
- Threshold encryption / FHE on pending txs.
- Commit-reveal sequences.
- Relation to Seal + Nautilus primitives.
- Tradeoff: latency cost of decryption round.

**Q28. How would you shard Sui?**
- Remora (announced 2026 roadmap item): horizontal scaling of execution across validators.
- Object-centric model makes this natural: partition by object ID.
- Cross-shard transactions: PTBs spanning multiple shards need atomic 2PC or equivalent.
- Tradeoff: shard boundary crossings become the new bottleneck.

**Q29. Design observability for a DAG-BFT consensus protocol.**
- Metrics: DAG depth, block propagation latency (histograms), leader commit rate, missed
  rounds, parent-set quality.
- Traces: per-block lifecycle (propose → reference → commit). OpenTelemetry spans.
- Alerts: round-advance rate drops, commit-rate drops.
- Relates directly to how you would detect the Jan 2026 bug earlier.

**Q30. How do PTBs change the threat model of smart contracts?**
- Composition is by the client, not by a smart contract at a fixed callsite → Move modules
  can't rely on "only my module calls this function."
- Reentrancy is still impossible (Move type system), but capability-handling must assume
  arbitrary composition.
- Surface for malicious PTBs stitching together unrelated functions → module authors should
  be careful about what capabilities they accept as arguments.

---

## 6. Senior signals specific to Mysten

### 6.1 Quote-ready phrases (things that land well)

- "I read the Mysticeti paper — the uncertified-DAG + novel commit rule is what gives you
  the 0.5s WAN latency, versus Narwhal+Bullshark's extra certification round-trip."
- "The object model is what makes parallel execution tractable — declaring object
  dependencies upfront is the opposite of the account model's post-hoc conflict detection."
- "PTBs are atomic by design, so I'd expect a lot of composition risk to be pushed onto
  module authors — capability objects need to be robust against arbitrary caller graphs."
- "Move's lack-of-drop semantics gives you a compile-time guarantee that mirrors a common
  pattern people hand-roll in Solidity with reentrancy guards."
- "Red Stuff's self-healing property — bandwidth proportional to lost data, not full blob —
  is what makes Walrus viable at the scale of a Sui-backed storage network."
- "zkLogin's two-factor model (OAuth + salt) is subtler than people give it credit for — the
  OAuth provider can't grind addresses because they don't have the salt."
- "Separating data availability from ordering (Narwhal's insight) is the single most
  important idea in modern DAG-BFT."
- "For production consensus, safety over liveness — the Jan 2026 outage was a correct
  failure mode, the network halted rather than forked."

### 6.2 Red flags to avoid

- Pretending to have read papers you haven't. Danezis or Chalkias will notice.
- Solana-style bashing. Mysten's culture document is explicit that "respectful criticism of
  ideas, never bashing competitors" is a value.
- Oversimplified "Sui is faster because it's parallel" — demonstrate you know *why* and
  where the costs are (shared objects, consensus path).
- Treating Move as "Solidity with Rust syntax." It's a fundamentally different type system.
- Ignoring the Jan 2026 outage. You should be able to discuss it factually and thoughtfully
  — it shows you pay attention to production reality, not just marketing.
- "I want to learn blockchain on the job." OK for new grads, not for senior/staff.
- Hand-wavy behavioral answers. Mysten explicitly asks about failures and judgment calls.

### 6.3 Proactive topics to raise

- The **Mysticeti paper** (arXiv 2310.14821) — read at least the abstract + commit rule.
- The **Sui Lutris paper** — the formal paper on combining broadcast and consensus.
- The **Walrus paper** (arXiv 2505.05370) — at minimum, understand Red Stuff at block level.
- The **zkLogin paper** (arXiv 2401.11735) — understand the 2FA model and Groth16 choice.
- A **stance on the object model vs. account model** that is opinionated but honest about
  tradeoffs (e.g., shared-object contention).
- A **concrete idea you'd prototype at Mysten** — e.g., "I'd love to look at how Nautilus
  attestations can be aggregated to reduce on-chain verification cost for MPC-style apps."
- Familiarity with the **Jan 2026 post-mortem** — not to dunk, but to show you understand
  the consensus-edge-case failure mode and the mitigations.

### 6.4 Things to pre-read before the loop (minimum viable prep)

1. **Sui docs landing page** (docs.sui.io).
2. **"How Sui Works"** + **"Life of a transaction"** pages.
3. **Mysticeti paper** — abstract + intro + commit rule section.
4. **Narwhal + Bullshark DAG-BFT blog post** (Decentralized Thoughts).
5. **Move abilities page** — memorize the 4 abilities and common combinations.
6. **PTB documentation** — be able to sketch a 3-command PTB on a whiteboard.
7. **zkLogin explainer + paper abstract**.
8. **The 2025 Stack retrospective** (blog.sui.io/2025-sui-stack-developments).
9. **Walrus intro + Red Stuff blog post**.
10. **Jan 14 2026 post-mortem** (status.sui.io → post-mortem link + crypto.news coverage).

---

## 7. Open items (verify in interview prep session)

- Exact Mysten headcount in Apr 2026 — "unknown — verify in interview prep session" (Tracxn
  figure is Jan 2026 = 203).
- Current consensus protocol name in production (Mysticeti v2 per Nov 2025) — confirm no
  further upgrade between Nov 2025 and interview date.
- Whether Remora sharding has a public paper yet — 2026 roadmap mentions it but formal
  publication unclear.
- Latest Seal mainnet key-server set size and trust model details — the Jan 2026 launch blog
  gives a high-level description; the formal threshold parameters may have evolved.
- Post-FTX cap table: Mysten is reported to have bought back FTX's stake, but the exact
  current investor composition is not fully public.

---

## 8. Source index (deduped)

Company and corporate:
- https://www.mystenlabs.com/
- https://www.mystenlabs.com/careers
- https://jobs.ashbyhq.com/mystenlabs
- https://www.crunchbase.com/organization/mysten-labs
- https://pitchbook.com/profiles/company/484702-93
- https://tracxn.com/d/companies/mysten-labs/__QmCLeZnclEni5P_2WOuP2fVnzblO9ZVtHPvdlmr4FhA
- https://www.builtinsf.com/company/mysten-labs
- https://www.glassdoor.com/Overview/Working-at-Mysten-Labs-EI_IE7563123.11,22.htm
- https://www.glassdoor.com/Interview/Mysten-Labs-Interview-Questions-E7563123.htm
- https://www.teamblind.com/company/Mysten-Labs

Consensus papers and write-ups:
- https://arxiv.org/abs/2310.14821 (Mysticeti)
- https://docs.sui.io/paper/mysticeti.pdf
- https://blog.sui.io/mysticeti-consensus-reduce-latency/
- https://www.sui.io/mysticeti
- https://arxiv.org/pdf/2201.05677 (Bullshark)
- https://github.com/MystenLabs/narwhal
- https://docs.sui.io/paper/sui-lutris.pdf
- https://decentralizedthoughts.github.io/2022-06-28-DAG-meets-BFT/
- https://blog.sui.io/narwhal-tusk-open-source/

Object model, Move, PTB:
- https://docs.sui.io/concepts/object-model
- https://docs.sui.io/concepts/sui-move-concepts
- https://docs.sui.io/concepts/sui-move-concepts/conventions
- https://github.com/sui-foundation/sui-move-intro-course/blob/main/unit-one/lessons/3_custom_types_and_abilities.md
- https://move-book.com/reference/abilities/object/
- https://docs.sui.io/concepts/transactions/prog-txn-blocks
- https://docs.sui.io/guides/developer/sui-101/building-ptb
- https://blog.sui.io/programmable-transaction-blocks-explained/
- https://blog.sui.io/parallelization-explained/
- https://blog.sui.io/blockchain-data-models-explained/
- https://www.zellic.io/blog/move-fast-break-things-move-security-part-2/

Walrus and storage:
- https://arxiv.org/html/2505.05370v2
- https://docs.wal.app/walrus.pdf
- https://www.walrus.xyz/blog/how-walrus-red-stuff-encoding-works
- https://www.luganodes.com/blog/walrus-decentralized-storage
- https://learn.backpack.exchange/articles/what-is-walrus-a-programmable-decentralized-storage-network

DeepBook:
- https://docs.sui.io/standards/deepbook
- https://blog.sui.io/deepbook-liquidity-launch/
- https://www.deepbook.tech/
- https://adeniyisui.substack.com/p/deepbook-the-ultimate-liquidity-engine

zkLogin and cryptography:
- https://docs.sui.io/concepts/cryptography/zklogin
- https://arxiv.org/html/2401.11735v2
- https://blog.sui.io/crs-ceremony-zklogin/
- https://github.com/sui-foundation/zklogin-ceremony-contributions
- https://docs.sui.io/guides/developer/cryptography/groth16

Seal and Nautilus:
- https://seal.mystenlabs.com/
- https://www.mystenlabs.com/blog/seal-mainnet-launch-privacy-access-control
- https://www.mystenlabs.com/blog/mysten-labs-launches-seal-decentralized-secrets-management-on-testnet
- https://github.com/MystenLabs/seal
- https://github.com/MystenLabs/nautilus
- https://blog.sui.io/nautilus-offchain-security-privacy-web3/
- https://docs.sui.io/concepts/cryptography/nautilus

Kiosk and SuiNS:
- https://docs.sui.io/standards/kiosk
- https://blog.sui.io/kiosks-nfts-royalties-explained/
- https://www.mystenlabs.com/blog/empowering-creators-with-sui-kiosk

2025–2026 news and outages:
- https://blog.sui.io/2025-sui-stack-developments/
- https://adeniyisui.substack.com/p/2025-the-year-we-completed-the-sui
- https://www.kucoin.com/news/flash/sui-s-mysticeti-v2-upgrade-cuts-latency-boosts-tps-by-25-35
- https://www.mexc.com/news/157762
- https://www.mexc.com/news/157553
- https://www.cointrust.com/market-news/mysten-labs-boosts-sui-blockchain-with-mysticeti-v2-upgrade
- https://crypto.news/sui-consensus-bug-six-hour-network-outage-2025/
- https://www.coinspeaker.com/sui-network-mainnet-outage-january-2026/
- https://cryptorank.io/news/feed/2d2f4-sui-network-outage-post-mortem-report
- https://status.sui.io/
- https://www.coindesk.com/markets/2026/01/06/sui-outperforms-bitcoin-and-ether-as-mysten-labs-promotes-privacy-tech
- https://bitcoinist.com/sui-plans-private-transactions-for-2026/
- https://www.altcoinbuzz.io/cryptocurrency-news/mysten-labs-and-alibaba-cloud-boost-sui-developer-support/
- https://www.blockchaingamer.biz/features/interviews/41233/2026-trends-mysten-labs-anthony-palma-eve-frontier-xociety-success-sui/

Observability (Prometheus, Grafana, Sui-specific):
- https://prometheus.io/docs/concepts/metric_types/
- https://prometheus.io/docs/tutorials/understanding_metric_types/
- https://victoriametrics.com/blog/prometheus-monitoring-metrics-counters-gauges-histogram-summaries/
- https://chronosphere.io/learn/an-introduction-to-the-four-primary-types-of-prometheus-metrics/
- https://grafana.com/docs/grafana/latest/visualizations/dashboards/build-dashboards/best-practices/
- https://grafana.com/blog/the-red-method-how-to-instrument-your-services/
- https://medium.com/thron-tech/how-we-implemented-red-and-use-metrics-for-monitoring-9a7db29382af
- https://grafana.com/grafana/dashboards/12136-use-method-node/
- https://docs.sui.io/guides/operator/monitoring
- https://grafana.com/grafana/dashboards/18141-sui-fullnode-monitor/
- https://grafana.com/grafana/dashboards/18297-sui-validator-dashboard-1-0/
- https://grafana.com/grafana/dashboards/18512-container-in-docker-and-system-monitoring/
- https://forums.sui.io/t/monitoring-and-alerts-integration-for-your-node/15449
- https://forums.sui.io/t/key-metrics-for-fullnode/17333
- https://github.com/MystenLabs/sui/blob/main/nre/sui_for_node_operators.md

---

End of report.
