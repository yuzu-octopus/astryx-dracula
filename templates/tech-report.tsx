// Copyright (c) Meta Platforms, Inc. and affiliates.
// XLE (canonical structure, validated with `bunx astryx layout check`):
//   A[cp=0 @sideNav=(SN > (SNS"Overview" > (SNI"Abstract"! + SNI"Model at a glance")) + (SNS"Architecture" > (SNI"Causal Encoder-Decoder" + SNI"Compressed Sparse Attention 2" + SNI"Single-Pass mHC" + SNI"Engram, DSpark, FP4")) + (SNS"Infrastructure" > (SNI"Training infrastructure" + SNI"Inference system" + SNI"SWA Bounded Replay")) + (SNS"Training and evaluation" > (SNI"Pre-training" + SNI"Post-training" + SNI"Conclusion")))] > L[h=auto] > (LC[p=8 !scroll] > V[g=8] > (V[g=2] > (H[g=2 a=center] > MNT + Tx[t=supporting]) + Hd"Abstract"[level=1 t=display-2] + Tx"Chapter 1 of 12"[t=supporting]) + Tx"Intro"[t=large] + AR + (V[g=8] > (V[g=3] > Hd"The bottleneck"[level=2] + Tx"Body"[t=body] + UL + Cd)*3) + D + (H[j=between] > B.secondary"Previous" + B.secondary"Next") + (Tx[t=supporting] > Lk"Checkpoints")) + (LP[!scroll] > Outline)

/**
 * Technical report — a chaptered walkthrough of the DeepSeek-V4.1-Flash
 * technical report, from the KV cache bottleneck through architecture,
 * infrastructure, training, evaluation, and limitations.
 *
 * Frame-first layout (see `npx astryx docs layout`):
 *
 *   Frame: AppShell (SideNav rail, no toggle) | Layout content + sticky Outline
 *   Content: chapter header | intro | scene | level-2 sections | prev/next
 *   Rail: four chapter groups, one item per chapter
 *
 * Responsive contract:
 *   Below 1024px the Outline column is dropped (a narrow viewport has nothing
 *   to outline against) and the same items become an "On this page" Selector
 *   under the chapter title, while the rail collapses into the AppShell
 *   drawer behind the MobileNavToggle. Section ids are derived from the
 *   chapter id and the section key, so the Outline and the headings cannot
 *   drift apart.
 *
 * Known limitation: chapters are short (1350-2200px against a 900px
 * viewport), so mid-chapter headings cannot scroll to the activation line.
 * The Outline's scroll-spy marks the last heading above that line, which
 * means a middle section can be skipped over: scrolling the Abstract to
 * "Three levers" lights "What it adds up to" instead. Long chapters
 * (csa2 at 2189px) track better than short ones (ced, mhc at 1350px).
 * Same shape on product-tour, same cause; revisit if chapters grow.
 */

import {useState, type CSSProperties} from 'react';
import {AppShell} from '@astryxdesign/core/AppShell';
import {MobileNavToggle} from '@astryxdesign/core/MobileNav';
import {
  SideNav,
  SideNavHeading,
  SideNavItem,
  SideNavSection,
} from '@astryxdesign/core/SideNav';
import {NavIcon} from '@astryxdesign/core/NavIcon';
import {
  HStack,
  Layout,
  LayoutContent,
  LayoutPanel,
  StackItem,
  VStack,
} from '@astryxdesign/core/Layout';
import {Heading, Text} from '@astryxdesign/core/Text';
import {Button} from '@astryxdesign/core/Button';
import {Icon} from '@astryxdesign/core/Icon';
import type {IconType} from '@astryxdesign/core/Icon';
import {AspectRatio} from '@astryxdesign/core/AspectRatio';
import {CodeBlock} from '@astryxdesign/core/CodeBlock';
import {Divider} from '@astryxdesign/core/Divider';
import {List, ListItem} from '@astryxdesign/core/List';
import {Link} from '@astryxdesign/core/Link';
import {Outline, type OutlineItem} from '@astryxdesign/core/Outline';
import {Selector} from '@astryxdesign/core/Selector';
import {useMediaQuery} from '@astryxdesign/core/hooks';

import {
  Boxes,
  ChevronLeft,
  ChevronRight,
  Combine,
  Cpu,
  Database,
  FileText,
  Flag,
  Grid2x2,
  Layers,
  RefreshCw,
  ScrollText,
  Server,
  Sparkles,
  Table2,
} from 'lucide-react';

const SELF_HASH = '#/templates/tech-report';

const REPORT_URL = 'https://huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash';

// Astryx has no image primitive: AspectRatio exposes no objectFit or radius
// props, so the scene fill and the corner clip live in these two styles.
const sceneFill: CSSProperties = {
  width: '100%',
  height: '100%',
  display: 'block',
};
const sceneClip: CSSProperties = {
  borderRadius: 'var(--radius-container)',
  overflow: 'clip',
};

// The outline is sticky so it tracks the chapter as the document scrolls.
const outlinePanel: CSSProperties = {
  position: 'sticky',
  top: 'var(--spacing-6)',
  alignSelf: 'start',
  paddingBlockStart: 'var(--spacing-2)',
};

// ─── Types ───────────────────────────────────────────────────────────────────

interface DocSection {
  // Unique within the chapter; the DOM id is derived from it so the outline
  // links and the headings can never drift apart.
  key: string;
  heading: string;
  body: string;
  bullets?: string[];
  code?: {language: string; title: string; source: string};
}

interface DocChapter {
  id: string;
  title: string;
  icon: IconType;
  intro: string;
  hasArt?: boolean;
  sections: DocSection[];
}

const sectionId = (chapterId: string, key: string) => `${chapterId}--${key}`;

// ─── Content ─────────────────────────────────────────────────────────────────
// Every figure below is quoted from the DeepSeek-V4.1-Flash technical report
// (DeepSeek-AI, 2026). Nothing here is estimated.

const CHAPTER_GROUPS: Array<{title: string; chapters: DocChapter[]}> = [
  {
    title: 'Overview',
    chapters: [
      {
        id: 'abstract',
        title: 'Abstract',
        icon: FileText,
        hasArt: true,
        intro:
          'DeepSeek-V4.1-Flash is a multimodal Mixture-of-Experts model built for input-heavy agentic workloads: 552B backbone parameters, contexts of up to one million tokens, and a KV cache small enough to change what long-context serving costs.',
        sections: [
          {
            key: 'bottleneck',
            heading: 'The bottleneck moved to storage',
            body: 'Sparse attention already cut the compute cost of long-sequence processing, which pushed the binding constraint onto keeping, moving, and reloading KV caches. DeepSeek-V4 pairs a global attention branch spanning the full context with local sliding-window attention; for a fixed window size the SWA footprint is bounded independently of sequence length, so on long sequences the global branch dominates the runtime KV that HBM has to hold.',
            bullets: [
              'Runtime KV lives in HBM and bounds serving throughput at a given batch size.',
              'Persistent KV is held for prefix reuse on SSD or in host memory, where capacity and I/O bandwidth both bind.',
              'Interconnect bandwidth limits how fast either cache can be migrated or loaded back.',
            ],
          },
          {
            key: 'three-levers',
            heading: 'Three levers, pulled together',
            body: 'The compression comes from model architecture, cache precision, and deployment strategy at once, and each lever multiplies the others.',
            bullets: [
              'Architecture: Compressed Sparse Attention 2 shares main KV and indexer K across layers and lets layers reuse Top-K indices, decoupling cache sharing from index reuse. V4.1-Flash uses pure CSA2, dropping the CSA and HCA hybrid of DeepSeek-V4.',
              'Precision: the main KV cache is trained and stored in FP4, which nearly halves its footprint in HBM and on SSD.',
              'Deployment: SWA Bounded Replay reconstructs missing sliding-window state from the most recent n_win tokens instead of replaying a full layer stack.',
              'Depth: the Causal Encoder-Decoder projects decoder global KV from the last encoder hidden state, so prefill activates 8B parameters per token while decode activates 16B.',
            ],
          },
          {
            key: 'headline-numbers',
            heading: 'What it adds up to',
            body: 'At equal sequence length, the global KV cache of DeepSeek-V4.1-Flash is roughly 1/4 of that of DeepSeek-V4-Flash and the persistent KV cache is roughly 1/8, at better end-to-end quality.',
            bullets: [
              'Global KV cache: 890 bytes per token, an approximately 4-fold reduction against DeepSeek-V4-Flash and a 437-fold reduction against DeepSeek-V1.',
              'Persistent KV cache: about 1/8 of DeepSeek-V4-Flash, because SWA KV is no longer persisted and the global KV that remains is 1/4 of its former size.',
              'Activated parameters: 8B per token during prefill, 16B during decode.',
              'Decode FLOPs: extending the context 256-fold, from 4K to 1M, raises single-token decode FLOPs by only 1/4.',
              'Training: 45T tokens of multimodal data, with native multimodality and million-token context after pre-training.',
            ],
          },
        ],
      },
      {
        id: 'at-a-glance',
        title: 'Model at a glance',
        icon: Table2,
        hasArt: true,
        intro:
          'Forty layers split into a 20-layer causal encoder and a 20-layer decoder. Every block is a DeepSeekMoE, every attention path is either a sliding window or CSA2, and the modes are assigned statically per layer.',
        sections: [
          {
            key: 'backbone',
            heading: 'Backbone',
            body: 'The language backbone is 40 causal Transformer layers at a hidden dimension of 5120. The first two layers use sliding-window attention only; every later layer combines a global branch with SWA. Images enter through a vision encoder and an MLP projector and are processed jointly with text from the start of language-model pre-training.',
            bullets: [
              'Attention: 64 query heads of dimension 512, a query compression dimension of 1280, and 8 output projection groups of intermediate dimension 1024.',
              'Sparse attention selects the top 512 KV entries per query, scored by an indexer with 32 query heads of dimension 128.',
              'Sliding window: n_win is 128 tokens on both the SWA branch and the DSpark drafter.',
              'Mixture-of-Experts: 1 shared expert and 384 routed experts per block, each with an intermediate dimension of 2304, 6 activated per token, SwiGLU with clamping at a threshold of 10.',
              'Vision: a 32-layer DeepSeek-ViT with hidden dimension 1024, 16 heads, and patch size 14, feeding a 2-layer projector of hidden dimension 5120. A 3x3 pixel unshuffle cuts visual tokens by a factor of nine, supporting inputs up to roughly 1344x1344.',
            ],
          },
          {
            key: 'layer-plan',
            heading: 'How the modes are assigned',
            body: 'Each CSA2 layer is statically assigned one of three modes and one compression ratio. Encoder layers compress at m = 2 in three identical groups of six, where the first layer of the group computes the cache and the other five reuse it. The decoder compresses at m = 1 in five groups of four, and only its first group opens with a Full layer; the other four open with Reindex, which keeps the cache shared but refreshes the selection.',
            code: {
              language: 'plaintext',
              title: 'layer plan',
              source: `# CSA2(ratio, mode) across the 40-layer backbone
encoder[0:2]    SWA only
encoder[2:20]   (Full, Reuse x5) x 3        # m = 2
decoder[0:4]    (Full, Reuse x3)            # m = 1
decoder[4:20]   (Reindex, Reuse x3) x 4     # m = 1`,
            },
          },
          {
            key: 'parameters',
            heading: 'Parameters and activation',
            body: 'The backbone carries 552B parameters; Engram adds another 196B, split evenly across two modules placed at layers 1 and 14 to balance memory across training pipeline stages. Activation is where the model pays for itself: 8B parameters per token during prefill and 16B during decode, against 284B and 13B for DeepSeek-V4-Flash and 1.6T and 49B for DeepSeek-V4-Pro.',
            bullets: [
              'Routing balances image and text tokens separately, with modality-specific correction biases, so neither modality hides an imbalance in the other.',
              'Engram tables hold roughly 16M entries per hash head in FP8, which keeps conditional memory out of the dense parameter path.',
              'Checkpoints for the release are at huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash.',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Architecture',
    chapters: [
      {
        id: 'ced',
        title: 'Causal Encoder-Decoder',
        icon: Layers,
        intro:
          'Decoder global KV is not computed by the decoder. It is projected from the hidden state of the last encoder layer, which nearly halves prefill computation for the tool-call-heavy shapes that agentic workloads actually produce.',
        sections: [
          {
            key: 'projection',
            heading: 'One hidden state feeds the decoder',
            body: 'For global attention, the bottom L/2 layers act as a causal encoder. For every decoder layer above L/2, the KV entries are not derived from that layer. They are projected directly from H[L/2], the hidden state of the final encoder layer, using layer-dependent projection weights, so prefill computes only the first half of the layers and the decoder receives its global KV at minimal cost.',
            code: {
              language: 'plaintext',
              title: 'ced projections',
              source: `# global attention, for every decoder layer l > L / 2
C_l = H[L/2] @ W_lKV    # global KV entries
Z_l = H[L/2] @ W_lZ     # compression weights

# sliding window attention stays layer-local, for every layer l
K_l, V_l = H_l @ W_lK, H_l @ W_lV`,
            },
          },
          {
            key: 'local-depth',
            heading: 'Local KV keeps its depth',
            body: 'Sharing global KV would be cheap but shallow, so CED leaves the sliding-window path alone: at any layer, local keys and values come from that layer own hidden state, which preserves the computational depth of local KV generation. The cost is that decoder SWA state cannot be inferred from the encoder, and rebuilding it is what SWA Bounded Replay exists to bound.',
            bullets: [
              'CED is inspired by YoCo, which lets the upper half of the layers share the lower half KV cache.',
              'CED adds layer-dependent projections so the shared state can be read at every decoder depth.',
              'The shared global KV cache is what makes decoder global KV free to reconstruct on a cache miss, since it is already on disk.',
            ],
          },
          {
            key: 'prefill-complexity',
            heading: 'Prefill complexity halves',
            body: 'For a sequence length N much larger than n_win, CED reduces prefill complexity from O(N x L) to O(N x L/2 + n_win x L/2), which is O(N x L/2) in practice. On 1M-token prompts with frequent cache misses, that is the difference between paying for forty layers and paying for twenty.',
            code: {
              language: 'plaintext',
              title: 'prefill cost',
              source: `full prefill:   O(N * L)
CED prefill:    O(N * L/2 + n_win * L/2)  ~  O(N * L/2)

# L = 40, n_win = 128, N up to 1,000,000`,
            },
          },
        ],
      },
      {
        id: 'csa2',
        title: 'Compressed Sparse Attention 2',
        icon: Grid2x2,
        hasArt: true,
        intro:
          'KV cache storage and attention compute can be cut along three multiplicative dimensions: entry size, sequence length, and layer count. CSA2 attacks all three at once, and it decouples sharing the cache from reusing the selection.',
        sections: [
          {
            key: 'modes',
            heading: 'Full, Reindex, and Reuse',
            body: 'Every CSA2 layer computes its own main query and its own SWA KV, and every layer uses the selected main KV entries to produce its attention output. The three modes differ only in where main KV, indexer K, and Top-K indices come from, and each layer is assigned one mode for the whole run.',
            code: {
              language: 'plaintext',
              title: 'csa2 modes',
              source: `mode      main KV    indexer K    Top-K indices
Full      compute    compute      compute fresh
Reindex   reuse      reuse        rescore the candidate pool
Reuse     reuse      reuse        reuse the latest selection`,
            },
            bullets: [
              'Full Mode runs the complete CSA2 path: it builds main KV, projects indexer K from it, and produces fresh Top-K indices.',
              'Reindex Mode keeps the shared cache but lets the selection change, rescoring the reused keys with its own indexer query.',
              'Reuse Mode performs sparse attention with no indexer evaluation at all, which is why those layers execute with only 15 kernels during prefill and 11 during decode.',
            ],
          },
          {
            key: 'sparse-attention',
            heading: 'The indexer selects, SWA covers the rest',
            body: 'A lightweight indexer scores main KV entries with indexer query and indexer key and selects the top 512 entries for each query; the query then attends to those entries together with the layer-local sliding-window KV. Uncompressed main KV remains a special case, available at a compression ratio of 1.',
            bullets: [
              'Cache sharing and index reuse are separate knobs: a Reindex layer shares storage while still choosing its own entries.',
              'When CSA2 meets CED, the decoder layer assigned to Full Mode builds its global KV from the last encoder hidden state; Reindex and Reuse are unchanged.',
            ],
          },
          {
            key: 'compressor',
            heading: 'A simpler compressor',
            body: 'In CSA, each main KV entry was compressed from two original entries whose sources overlapped with the adjacent entry, and absolute positional embedding encoded those two positions. CSA2 removes both. It also derives indexer K by projecting main KV entries rather than compressing a separate path out of the hidden states, which simplifies the implementation and speeds up training.',
          },
          {
            key: 'hierarchical',
            heading: 'The Hierarchical Sparse Indexer',
            body: 'Cross-layer index reuse removes indexer evaluations but leaves the survivors scoring the whole causally visible context, which is still the bottleneck at extreme lengths. The decoder answer is to let shallow indexers restrict what deeper indexers are allowed to consider, with no extra state: the first Full Mode layer of the group builds a candidate pool, later Reindex layers score only inside it, and Reuse layers do no indexing at all.',
            code: {
              language: 'plaintext',
              title: 'candidate pool',
              source: `# decoder, per query, built by the first Full Mode layer
scores  = indexer(main KV)               # all causally visible positions
topk    = top 512 positions              # this layer's own selection
blocks  = 2,048 blocks of 8 positions    # block score = max of its positions
pool    = 16,384 candidate positions     # later indexers search only here`,
            },
            bullets: [
              'For a fixed pool size, the per-query cost of every deeper indexer is bounded independently of context length.',
              'The restriction is training-aware: the same candidate restriction is applied in training and inference, so deeper indexers are optimized under the search domain they meet in production.',
              'The first Full Mode layer still pays for a full-range scan, so hierarchical indexing shrinks the tail of the cost rather than the whole of it.',
            ],
          },
        ],
      },
      {
        id: 'mhc',
        title: 'Single-Pass mHC',
        icon: Combine,
        intro:
          'mHC keeps n residual streams between adjacent blocks. The original implementation read those streams twice per block because input mixing had to wait on a reduction. Shifting the coefficients by one block removes that dependency and halves the activation traffic.',
        sections: [
          {
            key: 'multi-pass',
            heading: 'Why the residual was read twice',
            body: 'The ideal residual map reads and writes (n + 1)d values, a lower bound of (2n + 2)d. DeepSeek-V4 ran the update as three kernels that could not overlap, because each depends on the one before it, and paid (4n + 4)d: twice the lower bound. Two of the three stages can share a traversal of the residual, since the residual update needs no reduction over the hidden dimension, but input mixing cannot join them while it depends on coefficients that are only available once every hidden tile has been reduced.',
            code: {
              language: 'plaintext',
              title: 'mhc kernels',
              source: `# three dependent kernels, (4n + 4)d activation traffic
X_l     = B[l-1] @ X[l-1] + C[l-1] @ Y[l-1]   # residual update
A,B,C   = H(X_l)                              # coefficient prediction
X_hat_l = A[l] @ X_l                          # input mixing`,
            },
          },
          {
            key: 'one-block-shift',
            heading: 'Shift the coefficients by one block',
            body: 'Single-Pass mHC lets each block consume the mixing coefficients produced by the previous one. Input mixing now reads A[l-1] instead of A[l], so it no longer depends on a reduction over X_l, and every tile can be used immediately for both input mixing and coefficient prediction. Empirically the shift costs negligible quality, which makes it a free read against a bounded ideal.',
            code: {
              language: 'plaintext',
              title: 'single-pass mhc',
              source: `X[l+1] = B[l] @ X_l + C[l] @ F_l(A[l-1] @ X_l)
A,B,C  = H(X_l)      # no dependency on this block's own coefficients`,
            },
          },
          {
            key: 'mega-mhc',
            heading: 'Mega-mHC',
            body: 'For deployment, residual update, input mixing, and coefficient prediction collapse into one kernel that processes X_l in tiles along the hidden dimension, each tile immediately feeding both the mixed input and the accumulators for the next block coefficients, with input pre-norm and FP8 conversion folded in. The residual is read once and written once, which halves the activation memory traffic of the original four-kernel implementation.',
            bullets: [
              'Mega-mHC implements mHC at (3n + 2)d and Single-Pass mHC at (2n + 2)d, the ideal map.',
              'Pre-training keeps the multi-kernel path, since the shift only changes which mixing coefficients a block applies.',
              'The mHC expansion factor is 4, with 20 Sinkhorn-Knopp iterations.',
            ],
          },
        ],
      },
      {
        id: 'auxiliary',
        title: 'Engram, DSpark, FP4',
        icon: Boxes,
        intro:
          'Three additions carry the rest of the compression budget: a sparsely accessed conditional memory, a speculative drafter trained after pre-training, and a four-bit main KV cache.',
        sections: [
          {
            key: 'engram',
            heading: 'Engram',
            body: 'Engram adds 196B parameters of conditional memory, split evenly across two modules at layers 1 and 14, to decouple memorization from computation. It follows the earlier design (tokenizer compression, multi-head hashing, context-aware gating, multi-branch integration) with two changes: the short causal convolution is dropped because its gains do not justify the inference complexity, and the embedding update moves to momentum plus Sinkhorn balancing.',
            bullets: [
              'Each module uses N-gram orders 2, 3, and 4, with 8 hash heads and a total embedding dimension of 2048 per order.',
              'Each head indexes a table of roughly 16M entries, with table sizes chosen to be distinct primes.',
              'Embedding tables and key and value projections run in FP8.',
              'Deterministic addressing lets embeddings prefetch from host memory over background RDMA, with the first module overlapping the first Transformer block.',
            ],
          },
          {
            key: 'dspark',
            heading: 'DSpark',
            body: 'DSpark is a speculative decoding module combining semi-autoregressive drafting with confidence-scheduled verification. Three Transformer blocks with a 128-token sliding window produce base logits for five draft positions in one forward pass, a lightweight Markov head models the dependencies between those drafts, and a confidence head predicts per-position acceptance probabilities that feed a scheduler choosing the verification length per request.',
            bullets: [
              'The scheduler combines predicted prefix survival with profiled engine throughput curves to maximize expected system-wide token throughput at the current load.',
              'Unlike the MTP module of DeepSeek-V3, DSpark is trained after pre-training with the backbone frozen, then alongside the backbone in post-training without gradients flowing back into it.',
              'That keeps DSpark aligned with the evolving policy, so it accelerates both online serving and rollout generation for RL and on-policy distillation.',
            ],
          },
          {
            key: 'fp4',
            heading: 'FP4 main KV cache',
            body: 'DeepSeek-V4 already used quantization-aware training for FP4 indexer queries and keys. V4.1-Flash extends QAT to the main KV cache, where the point is storage rather than matrix multiplication throughput, and dequantizes cached values before attention so accuracy does not depend on native FP4 matmul support. The format is the OCP-standard MXFP4, chosen to cover as many hardware platforms as possible.',
            code: {
              language: 'plaintext',
              title: 'fp4 layout',
              source: `element    FP4 E2M1
scale      one E4M3 per 16 channels, no second-level global scale
quantize   after RoPE, QAT during post-training
range      448 * 6 = 2688, far above the observed cache magnitude
SWA KV     FP8, retained for its sensitivity to quantization`,
            },
            bullets: [
              'Dropping the second-level global scale costs nothing measurable: the largest trained RMSNorm weight magnitude is about 1, the rotated 512-channel KV latent stays near sqrt(512) at about 22.6, and the largest magnitude observed in training is around 10.',
              'Quantizing after RoPE rather than before is a deliberate trade: quantizing earlier helps accuracy marginally and would add decode overhead.',
              'Against the FP8 main KV cache of DeepSeek-V4, this nearly halves storage in HBM and when the cache is offloaded to SSD.',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Infrastructure',
    chapters: [
      {
        id: 'training-infra',
        title: 'Training infrastructure',
        icon: Server,
        intro:
          'The compression only pays off if the training system can feed it: one-million-token multimodal sequences, attention state shared across pipeline stages, and embedding tables that sit far from the compute that reads them.',
        sections: [
          {
            key: 'multimodal',
            heading: 'Multimodal training',
            body: 'The vision encoder is first optimized against a contrastive objective, where the loss over a full batch forces both modalities to be all-gathered across data-parallel ranks. Because the text gradient depends only on the gathered visual features and the visual gradient only on the gathered text features, each all-gather hides behind useful computation instead of stalling the pipeline.',
            code: {
              language: 'plaintext',
              title: 'contrastive overlap',
              source: `Forward(V) -> Forward(T) || AllGather(V) -> grad_Text
           -> Backward(T) || AllGather(T) -> grad_Vision -> Backward(V)

# A || C means computation A overlapped with communication C`,
            },
            bullets: [
              'End-to-end parallelism replicates the vision encoder outside the LLM parameter tree and splits each step into vision forward, LLM forward and backward, and vision backward, so the LLM phase keeps the parallel strategy of text-only training.',
              'Balanced image sharding spreads the images of one ultra-long sequence across context-parallel ranks with each image loaded exactly once; the load-hiding criterion reduces to per-token quantities and is therefore independent of sequence length and cluster size.',
              'During RL rollout, images transfer to the inference engine incrementally and the engine CPU-side decoding and preprocessing outputs are cached on a distributed file system for reuse across rollouts and later training.',
            ],
          },
          {
            key: 'attention-sharing',
            heading: 'Attention sharing across stages',
            body: 'Layers that share attention components can land on different pipeline stages, which makes direct module reuse incompatible with stage-local execution. Three mechanisms keep CSA2 trainable under an ordinary pipeline schedule.',
            bullets: [
              'Shadow indexers place a lightweight executable replica on each participating stage while a single logical owner keeps the shared parameters, handles optimization and checkpointing, and keeps replicas consistent through parameter synchronization and gradient aggregation.',
              'Pipeline payload extensions carry the intermediate representations and sparse routing information that downstream consumers need across a pipeline boundary, partitioned consistently with context parallelism.',
              'Micro-batch-level shared-state management tracks the states of concurrently active micro-batches across forward execution, activation recomputation, and backward propagation, keeping each state alive until its final consumer finishes and releasing it promptly after.',
            ],
          },
          {
            key: 'engram-training',
            heading: 'Engram at scale',
            body: 'Engram tables are partitioned by row across dedicated process groups whose size trades per-device memory against the communication scope of each lookup, with optimizer states sharded across replicas of every partition. Because lookup indices depend only on the input token sequence, prefetch for the whole local batch starts before each pipeline stage touches its microbatches; embedding gradients are buffered during backward and returned to their owning ranks after the backbone backward pass.',
            bullets: [
              'Prefetch and gradient transfers are scheduled to overlap the vision encoder forward and backward passes.',
              'Embeddings are stored and fetched in FP8, with retrieved values and scaling factors handed straight to the following GEMM.',
              'Sinkhorn normalization keeps row and column scaling vectors across iterations so the full normalized matrix is never rewritten, and row normalization plus partial column statistics are fused into one kernel.',
              'During RL rollouts the tables stay resident in GPU memory, which reduces host memory pressure and the fragmentation that causes host out-of-memory failures.',
            ],
          },
        ],
      },
      {
        id: 'inference',
        title: 'Inference system',
        icon: Cpu,
        hasArt: true,
        intro:
          'The architecture is conceptually complex and the kernel flow is deliberately not. Most layers run a short fixed list of fused kernels, and Encoder-Prefill-Decode disaggregation lets the three stages scale and overlap on their own terms.',
        sections: [
          {
            key: 'kernels',
            heading: 'A short kernel flow',
            body: 'Fusion encapsulates the intricate operations and keeps hardware pipelined inside a handful of kernels: the fused RoPE-attention-RoPE-cast kernel in FlashMLA, the Mega-Gate, Mega-mHC, and Mega-MoE kernels in DeepGEMM, the TileKernels set, and the TopK kernel in DeepSelect. The result is that the Reuse Mode layers, which are the vast majority of the stack, execute with only 15 kernels during prefill and 11 during decode.',
            code: {
              language: 'plaintext',
              title: 'reuse mode layer',
              source: `prefill   15 kernels
decode    11 kernels`,
            },
          },
          {
            key: 'epd',
            heading: 'Encoder, prefill, decode',
            body: 'Deployment adopts Encoder-Prefill-Decode disaggregation, so vision encoding, prefill, and decoding scale independently and overlap in execution. That separation is what makes the two replay paths of SWA Bounded Replay practical: the encoder side and the decoder side can be reconstructed in different processes, against the same cached global KV.',
          },
          {
            key: 'persistent-kv',
            heading: 'Persistent KV cache management',
            body: 'Under identical workloads the persistent KV cache of V4.1-Flash is about 1/8 of DeepSeek-V4, and two multiplicative factors explain it: the persistent cache no longer stores SWA KV, which almost halves it, and the global KV it does retain is compressed to 1/4 through architecture and precision. In DeepSeek-V4, SWA KV was nearly half the persistent capacity, cached only at the end of the prompt and the end of the output, under an LRU policy shared with global KV.',
            bullets: [
              'SWA KV moves out of the persistent cache into a distributed memory pool provisioned from 10% of host DRAM per machine, where a lifetime of minutes lets expired entries recycle immediately for new sessions.',
              'Global KV stays in the persistent cache with a guaranteed lifetime of at least 72 hours, matching its long-tail reuse pattern.',
              'The misses that eviction causes are affordable because of Encoder SWA Bounded Replay, which turns a catastrophic miss into a graceful, inexpensive degradation.',
            ],
          },
        ],
      },
      {
        id: 'swa-replay',
        title: 'SWA Bounded Replay',
        icon: RefreshCw,
        hasArt: true,
        intro:
          'Exact SWA reconstruction needs L x n_win tokens of replay. Bounded replay does the work with n_win and accepts approximate state, which is the trade that lets SWA KV leave the persistent cache entirely.',
        sections: [
          {
            key: 'the-trade',
            heading: 'Replay only the window',
            body: 'SWA dependencies accumulate across layers, so exactly reconstructing the SWA KV of L layers would mean replaying L x n_win tokens. Bounded replay replays only the most recent n_win tokens and truncates SWA to that replay segment: for a replay starting at position s, a query at position i attends to SWA keys between max(s, i - W + 1) and i. The state is approximate by construction, and the measurements say the approximation is cheap.',
            code: {
              language: 'plaintext',
              title: 'replay rule',
              source: `# for a replay starting at position s
attend(i): SWA keys in [max(s, i - W + 1), i]`,
            },
          },
          {
            key: 'encoder-path',
            heading: 'Encoder SWA Bounded Replay',
            body: 'When encoder SWA KV is missing, the last n_win tokens of the cached prefix are replayed together with the uncached suffix. The replayed tokens regenerate only SWA KV, reusing the cached global KV without recomputing or overwriting it, while the uncached suffix generates both. This is what lets prefix caching depend on global KV alone, and therefore what lets SWA KV be removed from the persistent cache.',
            bullets: [
              'The replayed prefix state is approximate, so global KV and SWA KV for the uncached suffix depend on the cache-hit position and are not mathematically identical across positions.',
              'Experiments across diverse boundary conditions show the bounded replay barely compromises response quality.',
              'The alternative, DeepSeek-V4 Zero SWA Caching, needed a full forward pass over L x n_win tokens, whose cost proved prohibitive in production.',
            ],
          },
          {
            key: 'decoder-path',
            heading: 'Decoder SWA Bounded Replay',
            body: 'Under CED, decoder global KV comes from the encoder, so the only obstacle to ending prefill at the encoder is decoder SWA KV, which comes from each decoder layer own hidden states and is needed by the first decode steps. Exact reconstruction would run the decoder layers over the last L/2 x n_win prompt tokens, which is expensive when a short uncached suffix follows a long cached prefix. Bounded replay instead replays the last n_win tokens of the prompt at every prefill, feeds their encoder outputs through the decoder under the same SWA truncation, and uses the resulting SWA KV for decoding only, never for prefix caching.',
            bullets: [
              'The reconstructed decoder SWA KV is not mathematically equivalent to a full decoder forward pass, with negligible measured impact on response quality.',
              'The same replay is simulated during post-training, so the model is trained under the approximation it will meet in production.',
              'Decoder bounded replay bounds the decoder forward pass to n_win tokens and nearly halves total prefill computation.',
            ],
          },
        ],
      },
    ],
  },
  {
    title: 'Training and evaluation',
    chapters: [
      {
        id: 'pre-training',
        title: 'Pre-training',
        icon: Database,
        intro:
          'Forty-five trillion tokens of multimodal data, sparse attention trained from scratch at 64K with no dense warmup, and a sequence length extended to one million tokens at 34T.',
        sections: [
          {
            key: 'data',
            heading: 'Data construction',
            body: 'Text curation targets the interactions between corpora rather than sample-level quality, and it filters out model-generated content with limited information gain, including outputs from weaker models and low-quality machine translation, treating it as implicit duplication that becomes detrimental over long training horizons. The corpus adds recent code from newly released repositories, commits, libraries, and frameworks to reflect contemporary software engineering.',
            bullets: [
              'Multimodal data comes from image-text pairs, interleaved image-text data, and domain-specific sets, cleaned in native form rather than synthesized at scale.',
              'Interleaved construction runs in progressively more expensive stages, ending with strict quality scoring by SmolVLM; documents filtered out are partly recycled into additional image-text pairs.',
              'Domain-specific data covers fine-grained visual perception, OCR, long-tail knowledge, and image-code pairs with computer-use trajectories.',
              'The final corpus is a 7:1 token ratio of text-only to multimodal data, with ultra-long documents pre-split before mixing and a best-fit packing padding rate of at most 10^-4.',
            ],
          },
          {
            key: 'setups',
            heading: 'Training setups',
            body: 'The model trains on 45T tokens of multimodal data with no instability, keeping the batch size fixed at 100.6M tokens throughout. Sparse attention is trained from scratch at a 64K sequence length with no dense attention warmup, and the sequence length extends to 1M at 34T tokens.',
            code: {
              language: 'plaintext',
              title: 'pre-training setup',
              source: `tokens            45T multimodal
batch size        100.6M tokens, fixed
learning rate     warmup 2000 steps, 2.6e-4 to 28T,
                  cosine decay to 2.6e-5 by 40T, held to 45T
sequence length   64K from scratch, 1M from 34T
Muon              momentum 0.95, weight decay 0.1, RMS rescaled to 0.18
AdamW             beta1 0.9, beta2 0.95, eps 1e-20, weight decay 0.1
Sinkhorn update   K = 11, tau = 1e-3, eps = 1e-20
Engram            learning rate scaled by 5x`,
            },
            bullets: [
              'Muon covers the weight matrices of linear transformations, the Engram projection layers, and the vision-language projector.',
              'Head-wise Muon splits query and key weights by head before the update, giving each head its own preconditioner, which outperforms vanilla Muon.',
              'Sinkhorn-balanced updates replace Newton-Schulz orthogonalization for the Engram tables, token embedding, and prediction head, needing only a momentum buffer while outperforming Adam there.',
              'Auxiliary-loss-free load balancing uses a bias update speed of 0.001 for image and text tokens, with a small sequence-level balance loss at weight 0.0001.',
            ],
          },
          {
            key: 'vision-encoder',
            heading: 'Training the vision encoder',
            body: 'DeepSeek-ViT is built from scratch on the Vision Transformer with three changes for this stack: 2D-RoPE replaces absolute positional embeddings so arbitrary resolutions work, the patch embedding convolution becomes a linear projection for Muon compatibility, and RMSNorm with SwiGLU handles normalization and activation. Its own training runs in two stages.',
            bullets: [
              'Contrastive pre-training optimizes a sigmoid contrastive loss on approximately 47B image-text pairs at a maximum resolution of 224x224, preserving aspect ratio.',
              'Autoregressive fine-tuning attaches the encoder to a 4B MoE LLM and trains on 236B tokens of captions, alt text, charts, and OCR, constraining resolution between 544x544 and 1344x1344.',
              'The LLM is discarded afterwards, keeping only the encoder and the same input-resolution policy for the main pre-training pipeline.',
            ],
          },
          {
            key: 'base-eval',
            heading: 'Base model evaluation',
            body: 'DeepSeek-V4.1-Flash-Base is evaluated against DeepSeek-V4-Flash-Base and DeepSeek-V4-Pro-Base across world knowledge, language understanding and reasoning, coding and mathematics, long context, and multimodal ability. It reaches world knowledge, reasoning, and coding ability comparable to DeepSeek-V4-Pro-Base and delivers 5% to 10% improvements on held-out evaluations, using only 1/3 total parameters and 1/4 activated parameters.',
            bullets: [
              'Multimodal scores with no counterpart in the earlier base models: MMMU-Pro 56.5, CVBench 77.9, DocVQA 95.6, and RefCOCO average 86.0.',
              'LongBench-V2 lands at 45.2 against 44.7 for DeepSeek-V4-Flash-Base and 51.5 for DeepSeek-V4-Pro-Base.',
              'On held-out internal corpora covering documentation, proprietary code, and academic material, the base model reports the lowest bits-per-byte of the three, which is the strongest signal of the data pipeline rather than of routing or architecture.',
            ],
          },
        ],
      },
      {
        id: 'post-training',
        title: 'Post-training',
        icon: Sparkles,
        intro:
          'The recipe introduces no new algorithm: supervised fine-tuning, reinforcement learning, and on-policy distillation follow the standard practice used for DeepSeek-V4. All the work went into what the model is trained on rather than how it is optimized.',
        sections: [
          {
            key: 'task-synthesis',
            heading: 'Synthesizing tasks and environments',
            body: 'Each task is a triplet of problem, environment, and verification system, scored on difficulty and correctness, and those two scores double as reward signals for iteratively training the model to construct better tasks of its own. Every reuse of a task in a new RL run feeds fresh trajectory evidence back into quality re-audit.',
            bullets: [
              'General agents get mocked tools that reproduce real interfaces, schemas, and behavioral constraints, built from voluntarily returned interaction data, plus failure cases replayed as single-turn and multi-turn environments.',
              'Coding agents draw on internal sessions filtered for complexity and deduplicated by trajectory, and on public GitHub repositories above a star threshold.',
              'Construction is collaborative: one agent judges whether a project builds and can be verified in a container, several agents attempt the task, an inspection agent checks for environment faults and hackability, and a repair agent fixes what it finds before re-verification.',
            ],
          },
          {
            key: 'rl-scale',
            heading: 'RL at scale, with a controllable effort dial',
            body: 'Reinforcement learning scales in two directions, training compute and the number of scaffolds, and performance keeps improving with cumulative RL steps within one scaffold, across variants of the same scaffold, and across heterogeneous scaffolds. Checkpoints from runs along different optimization paths are merged to reinitialize successive runs, which aggregates parallel RL compute and improves both task performance and token efficiency.',
            code: {
              language: 'plaintext',
              title: 'effort prompt',
              source: `Reasoning Effort: {effort} (range 1-100; higher values request more
thorough reasoning)`,
            },
            bullets: [
              'Responses sampled at the same prompt and effort form a group, and rewards are mean-centered inside the group, so effort levels are never compared against each other directly.',
              'A length penalty whose coefficient decays exponentially with effort makes lower effort levels press harder for brevity while higher levels permit more computation.',
              'Public API tiers map onto the scalar directly: max is 100, high is 75, and low is 50, on the same weights and decoding configuration.',
              'Raising effort from 25 to 100 lifts average Pass@1 on eight reasoning benchmarks from 67.1% to 76.3%, DeepSWE v1.1 from 66.0% to 74.2%, and Terminal-Bench 2.1 from 82.4% to 90.6%, for roughly 2.5x more output tokens.',
            ],
          },
          {
            key: 'async-infra',
            heading: 'Asynchronous post-training',
            body: 'Rollout and training are colocated on the same devices and time-share execution, removing manual resource tuning between the two phases. Dispatch granularity took three attempts to settle: batch-level dispatch made training metrics oscillate, prompt-level dispatch stalled on long-tail samples inside a group, and sample-level dispatch, which releases a new prompt once enough samples complete to fill its GRPO group, holds rollout concurrency steady.',
            bullets: [
              'Length bias is handled by per-dataset concurrency limits and by discarding early-returned short samples, which smooths the transition into the steady-state length distribution.',
              'Off-policy drift is bounded by dispatch and waiting logic and by a loss mask that drops tokens whose staleness exceeds the bound.',
              'Token-level interruption stops generation at any token boundary, and rollout state is persisted at token granularity so an interrupted sample resumes where it left off without re-prefilling.',
              'The final on-policy distillation stage distills from over 40 teacher models across all domains, supporting architecturally heterogeneous teachers and switching between them at negligible cost.',
            ],
          },
          {
            key: 'dsec',
            heading: 'Running agents at massive scale',
            body: 'DSec is the production sandbox platform behind this training, initially built to address heterogeneous execution environments, image distribution, isolation backends, density, trajectory logging, and safe resumption. V4.1 training pushed demand to millions of concurrent sandbox instances spanning harnesses, platforms, repositories, dependencies, and task-specific services, which moved the bottlenecks to datacenter scalability, isolation, per-node density, and the containment of misbehaving agents.',
            bullets: [
              'Compute scales by sharding machines into scale units, with a custom placement engine trading strong global consistency for scalability: unsynchronized replicas make good-enough placements from recent measurements, and each node enforces a hard admission constraint on the decisions it receives.',
              'Sub-NUMA partitioning binds each worker VM to its own NUMA domain, raising supported density from roughly 1,000 to more than 2,500 concurrent live containers per physical node before measurable end-to-end degradation.',
              'A latency-sensitive execution class applies SCHED_IDLE to non-sensitive tasks and core scheduling to keep only same-priority tasks on sibling hyperthreads, so background load cannot distort time-sensitive evaluations.',
              'Agents that attempt reward hacking are contained by per-sandbox AppArmor profiles and fine-grained eBPF network policies, and a crash is treated as a failed trajectory with a repercussion signal reported to the RL framework.',
            ],
          },
        ],
      },
      {
        id: 'conclusion',
        title: 'Conclusion',
        icon: Flag,
        intro:
          'DeepSeek-V4.1-Flash matches or beats frontier models on the vast majority of benchmarks, at a fraction of the activation footprint, and the report is explicit about where the evidence stops.',
        sections: [
          {
            key: 'results',
            heading: 'What the compression bought',
            body: 'The performance gains over DeepSeek-V4-Flash are concentrated in agentic work. DeepSWE v1.1 reaches 74.2% resolved, up from 54.4% and above Opus-5 at 74.0% and GPT-5.6 Sol at 73.0%; Terminal-Bench 2.1 reaches 90.6% against 89.1% for Opus-5 and 88.2% for GLM-5.3; Automation-Bench reaches 54.8% and Agents Last Exam 31.8%.',
            bullets: [
              'Reasoning: a Codeforces rating of 3471, above DeepSeek-V4-Pro at 3348 and DeepSeek-V4-Flash at 3289, and a MathArena Apex Pass@1 of 65.6%, matching Kimi-K3 and above DeepSeek-V4-Pro at 65.3%.',
              'Cyber security: CyberGym 88.1% and SEC-Bench Pro 62.8%, a new open-source state of the art for dual-use capability that the report asks the community to apply responsibly.',
              'Multimodal: strong results on visual reasoning and professional chart interpretation, with a measurable gap remaining against leading closed-source systems.',
              'Effort economics: the 60 to 80 band recovers most of the accuracy of the maximum setting at less than half its token budget, while the final step to 100 lengthens trajectories by 1.6x to 1.8x for marginal gains.',
            ],
          },
          {
            key: 'scaffolds',
            heading: 'Scaffolds and multi-agent',
            body: 'Agentic ability transfers across harnesses rather than depending on one. At maximum effort, eight configurations from six scaffold families land between 65.5% (OpenCode) and 74.2% (mini-SWE) on DeepSWE v1.1, and between 84.1% (Codex) and 90.6% (DeepSeek Harness in Minimal mode) on Terminal-Bench v2.1, which is consistent with the diversity of environments and tool schemas in the synthesized training data.',
            bullets: [
              'Multi-agent Agent Team mode outperforms single-agent at every deadline on both benchmarks tested.',
              'On ProgramBench, Almost@1 rises from 13.59% at one hour to a peak of 30.04% at eight hours, against 12.79% and 20.39% for the single-agent configuration.',
              'On FrontierSWE v2, Mean@5 rises from 13.50% at one hour to 32.90% at twenty hours, against 10.50% to 28.20% for a single agent.',
              'Training Agent Team mode rewards task performance and delegation while penalizing derived latency, computed as the critical path of a dependency DAG over execution events.',
            ],
          },
          {
            key: 'limitations',
            heading: 'Limitations',
            body: 'The architectural simplifications create robustness boundaries that are not yet fully characterized. Internal evaluation covers a diverse range of cases without systematic degradation, but no finite suite covers every extreme input: potential selection errors in CSA2 and approximate state reconstruction in SWA Bounded Replay may still degrade capability in untested boundary cases.',
            bullets: [
              'Stress testing will focus on sparse retrieval over long contexts and on SWA state reconstruction at cache-resumption boundaries.',
              'Benchmarks are saturating, and benchmark parity does not imply matching frontier capability on the hardest reasoning and edge cases.',
              'Evaluation hygiene is an active problem: internet access is restricted and git histories are stripped, yet exploit-seeking behavior still appeared, including decompiling core Ubuntu packages during CyberGym.',
            ],
          },
          {
            key: 'availability',
            heading: 'Availability',
            body: 'DeepSeek-V4.1-Flash is released by DeepSeek-AI with checkpoints published on Hugging Face. The report credits the whole team and lists authors alphabetically by first name.',
            bullets: [
              'Checkpoints: huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash',
              'Contact: research@deepseek.com',
            ],
          },
        ],
      },
    ],
  },
];

const CHAPTERS: DocChapter[] = CHAPTER_GROUPS.flatMap(group => group.chapters);

// Derived once at module scope so the Outline receives a stable array identity
// and does not re-register its scroll spy on every render.
const OUTLINE_BY_CHAPTER: Record<string, OutlineItem[]> = Object.fromEntries(
  CHAPTERS.map(chapter => [
    chapter.id,
    chapter.sections.map(section => ({
      id: sectionId(chapter.id, section.key),
      label: section.heading,
      level: 2,
    })),
  ]),
);

const DEFAULT_CHAPTER = 'abstract';

// ─── Scene: the KV cache by generation ───────────────────────────────────────
// Drawn, not loaded. Inline SVG keeps a template dependency-free and paints in
// theme tokens instead of a fixed palette, so every scene follows the brand.

// Bars sit on a log scale, because the range from 890 bytes to 437 times that
// does not fit a linear axis. Heights are the log of each generation footprint
// relative to V4.1-Flash; the smallest keeps a visible floor rather than
// collapsing to zero, and the labels carry the real ratios.
const FOOTPRINT_BARS = [
  {
    x: 74,
    height: 120,
    name: 'DeepSeek-V1',
    value: '437x',
    fill: 'var(--dracula-comment)',
    opacity: 0.5,
  },
  {
    x: 176,
    height: 27,
    name: 'V4-Flash',
    value: '4x',
    fill: 'var(--dracula-comment)',
    opacity: 0.75,
  },
  {
    x: 278,
    height: 5,
    name: 'V4.1-Flash',
    value: '890 B',
    fill: 'var(--dracula-cyan)',
    opacity: 1,
  },
];

const FOOTPRINT_BASELINE = 176;

function FootprintScene({alt}: {alt: string}) {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={sceneFill}
      role="img"
      aria-label={alt}>
      <rect width="400" height="225" fill="var(--dracula-bg-dark)" />
      <path
        d={`M40 ${FOOTPRINT_BASELINE} H360`}
        stroke="var(--dracula-comment)"
        strokeOpacity={0.4}
      />
      {FOOTPRINT_BARS.map(bar => (
        <g key={bar.name}>
          <rect
            x={bar.x}
            y={FOOTPRINT_BASELINE - bar.height}
            width="44"
            height={bar.height}
            rx="2"
            fill={bar.fill}
            fillOpacity={bar.opacity}
          />
          <text
            x={bar.x + 22}
            y={FOOTPRINT_BASELINE - bar.height - 9}
            fontFamily="var(--font-family-mono)"
            fontSize="11"
            textAnchor="middle"
            fill={bar.fill}
            fillOpacity={0.95}>
            {bar.value}
          </text>
        </g>
      ))}
      <g
        fontFamily="var(--font-family-mono)"
        fontSize="10"
        fill="var(--dracula-comment)"
        textAnchor="middle">
        {FOOTPRINT_BARS.map(bar => (
          <text key={bar.name} x={bar.x + 22} y={FOOTPRINT_BASELINE + 16}>
            {bar.name}
          </text>
        ))}
      </g>
      <g fontFamily="var(--font-family-mono)" fontSize="10" fill="var(--dracula-comment)">
        <text x="40" y="30" fillOpacity={0.85}>
          Global KV cache per token, log scale
        </text>
        <text x="40" y="208" fillOpacity={0.6}>
          about 4x below V4-Flash, 437x below V1
        </text>
      </g>
    </svg>
  );
}

// ─── Scene: the causal encoder-decoder ───────────────────────────────────────

// One tick per layer, left to right: encoder then decoder. Cyan marks the two
// sliding-window-only layers, green the encoder CSA2 layers that compute the
// global KV, yellow the decoder layers that read it. Within a group only the
// first layer is Full or Reindex, so those ticks carry full opacity.
const LAYER_TICKS = Array.from({length: 40}, (_, index) => ({
  x: 42 + index * 8,
  isSwaOnly: index < 2,
  // encoder groups of six from layer 2; decoder groups of four from layer 20
  isGroupHead: index < 20 ? index >= 2 && (index - 2) % 6 === 0 : (index - 20) % 4 === 0,
  fill: index < 2 ? 'var(--dracula-cyan)' : index < 20 ? 'var(--dracula-green)' : 'var(--dracula-yellow)',
}));

function ArchitectureScene({alt}: {alt: string}) {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={sceneFill}
      role="img"
      aria-label={alt}>
      <rect width="400" height="225" fill="var(--dracula-bg-dark)" />

      {/* Global KV crosses the encoder boundary instead of being rebuilt in
          every decoder layer, which is the whole point of the diagram. */}
      <path
        d="M120 56 C120 34 280 34 280 52"
        fill="none"
        stroke="var(--dracula-green)"
        strokeOpacity={0.7}
        strokeDasharray="3 3"
      />
      <path d="M280 58 L276 49 L284 49 Z" fill="var(--dracula-green)" fillOpacity={0.7} />
      <text
        x="200"
        y="28"
        fontFamily="var(--font-family-mono)"
        fontSize="10"
        textAnchor="middle"
        fill="var(--dracula-comment)">
        global KV projected from H[L/2]
      </text>

      {LAYER_TICKS.map(tick => (
        <rect
          key={tick.x}
          x={tick.x}
          y="62"
          width="5"
          height="88"
          rx="1"
          fill={tick.fill}
          fillOpacity={tick.isGroupHead ? 1 : 0.34}
        />
      ))}

      {/* Block brackets: the encoder and the decoder are 20 layers each. */}
      <g stroke="var(--dracula-comment)" strokeOpacity={0.5}>
        <path d="M42 158 H197 M42 158 V163 M197 158 V163" />
        <path d="M202 158 H359 M202 158 V163 M359 158 V163" />
      </g>
      <g
        fontFamily="var(--font-family-mono)"
        fontSize="10"
        fill="var(--dracula-comment)"
        textAnchor="middle">
        <text x="119" y="178">
          encoder, 20 layers
        </text>
        <text x="280" y="178">
          decoder, 20 layers
        </text>
      </g>

      <g fontFamily="var(--font-family-mono)" fontSize="10" fill="var(--dracula-comment)">
        <rect x="42" y="193" width="8" height="8" rx="1" fill="var(--dracula-cyan)" />
        <text x="56" y="201">SWA only</text>
        <rect x="132" y="193" width="8" height="8" rx="1" fill="var(--dracula-green)" />
        <text x="146" y="201">computes global KV</text>
        <rect x="266" y="193" width="8" height="8" rx="1" fill="var(--dracula-yellow)" />
        <text x="280" y="201">reuses global KV</text>
      </g>
    </svg>
  );
}

// ─── Scene: the hierarchical sparse indexer ──────────────────────────────────

// Eleven block rows of eight positions each, a stand-in for the 2,048 blocks
// of the real pool. Rows marked as selected carry the cyan slab; the green
// cells inside them are the positions that survive to Top-K.
const INDEXER_ROWS: ReadonlyArray<{y: number; picks: number[]}> = [
  {y: 48, picks: []},
  {y: 60, picks: [1, 5]},
  {y: 72, picks: []},
  {y: 84, picks: []},
  {y: 96, picks: [3]},
  {y: 108, picks: [0, 6]},
  {y: 120, picks: []},
  {y: 132, picks: [4]},
  {y: 144, picks: []},
  {y: 156, picks: []},
  {y: 168, picks: [2, 7]},
];

const INDEXER_CELLS = [0, 1, 2, 3, 4, 5, 6, 7];

function IndexerScene({alt}: {alt: string}) {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={sceneFill}
      role="img"
      aria-label={alt}>
      <rect width="400" height="225" fill="var(--dracula-bg-dark)" />

      {INDEXER_ROWS.map(row =>
        row.picks.length > 0 ? (
          <rect
            key={row.y}
            x="62"
            y={row.y - 2}
            width="276"
            height="13"
            rx="2"
            fill="var(--dracula-cyan)"
            fillOpacity={0.12}
            stroke="var(--dracula-cyan)"
            strokeOpacity={0.45}
          />
        ) : null,
      )}

      {INDEXER_ROWS.map(row =>
        INDEXER_CELLS.map(cell => (
          <rect
            key={`${row.y}-${cell}`}
            x={66 + cell * 34}
            y={row.y}
            width="30"
            height="9"
            rx="1"
            fill={row.picks.includes(cell) ? 'var(--dracula-green)' : 'var(--dracula-comment)'}
            fillOpacity={row.picks.includes(cell) ? 1 : 0.3}
          />
        )),
      )}

      <g fontFamily="var(--font-family-mono)" fontSize="10" fill="var(--dracula-comment)">
        <text x="40" y="28" fillOpacity={0.85}>
          2,048 blocks of 8 positions, 16,384 candidates
        </text>
        <rect x="40" y="196" width="8" height="8" rx="1" fill="var(--dracula-cyan)" fillOpacity={0.45} />
        <text x="54" y="204">block kept by its top score</text>
        <rect x="230" y="196" width="8" height="8" rx="1" fill="var(--dracula-green)" />
        <text x="244" y="204">position in Top-512</text>
      </g>
    </svg>
  );
}

// ─── Scene: decode FLOPs against context length ──────────────────────────────

const CONTEXT_TICKS = ['4K', '16K', '64K', '256K', '1M'];

function FlopsScene({alt}: {alt: string}) {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={sceneFill}
      role="img"
      aria-label={alt}>
      <rect width="400" height="225" fill="var(--dracula-bg-dark)" />

      {/* Five ticks for a 256-fold range: equal spacing is the log scale. */}
      <g stroke="var(--dracula-comment)" strokeOpacity={0.18}>
        {CONTEXT_TICKS.map((tick, index) => (
          <path key={tick} d={`M${56 + index * 81} 40 V172`} />
        ))}
      </g>
      <text
        x="56"
        y="26"
        fontFamily="var(--font-family-mono)"
        fontSize="10"
        fill="var(--dracula-comment)"
        fillOpacity={0.85}>
        Single-token decode FLOPs against context length
      </text>
      <path d="M56 172 H380" stroke="var(--dracula-comment)" strokeOpacity={0.45} />
      <path d="M56 40 V172" stroke="var(--dracula-comment)" strokeOpacity={0.45} />

      {/* The baseline the compressed model holds almost flat. */}
      <path
        d="M56 156 H380"
        stroke="var(--dracula-comment)"
        strokeOpacity={0.25}
        strokeDasharray="3 4"
      />
      <path
        d="M56 156 C170 155 270 148 380 132"
        fill="none"
        stroke="var(--dracula-cyan)"
        strokeWidth="2"
      />
      <path
        d="M56 148 C170 143 250 110 312 78 C342 62 364 52 380 46"
        fill="none"
        stroke="var(--dracula-orange)"
        strokeWidth="2"
      />

      <g fontFamily="var(--font-family-mono)" fontSize="10">
        <text x="378" y="42" textAnchor="end" fill="var(--dracula-orange)">
          DeepSeek-V4-Flash
        </text>
        <text x="378" y="142" textAnchor="end" fill="var(--dracula-cyan)">
          DeepSeek-V4.1-Flash
        </text>
        <text x="56" y="60" fill="var(--dracula-comment)">
          4K to 1M, 256x context:
        </text>
        <text x="56" y="74" fill="var(--dracula-comment)">
          +1/4 decode FLOPs
        </text>
        {CONTEXT_TICKS.map((tick, index) => (
          <text
            key={tick}
            x={56 + index * 81}
            y="188"
            textAnchor={index === 0 ? 'start' : index === CONTEXT_TICKS.length - 1 ? 'end' : 'middle'}
            fill="var(--dracula-comment)">
            {tick}
          </text>
        ))}
        <text x="56" y="206" fill="var(--dracula-comment)" fillOpacity={0.7}>
          BF16, FP8, and FP4 ops weighted 1, 0.5, and 0.25
        </text>
      </g>
    </svg>
  );
}

// ─── Scene: SWA bounded replay ───────────────────────────────────────────────

// The prompt strip on top shows what is cached against what has to be
// recomputed; the two bars below show why the bounded path is worth the
// approximation. Both bars are one window wide, so only the layer count
// separates them. The stack is drawn as one hairline per replayed layer, so
// it reads as a count rather than as a fill.
const REPLAY_LAYER_LINES = Array.from({length: 20}, (_, index) => 98 + index * 2);

function ReplayScene({alt}: {alt: string}) {
  return (
    <svg
      viewBox="0 0 400 225"
      preserveAspectRatio="xMidYMid slice"
      style={sceneFill}
      role="img"
      aria-label={alt}>
      <rect width="400" height="225" fill="var(--dracula-bg-dark)" />

      <g fontFamily="var(--font-family-mono)" fontSize="10" textAnchor="middle">
        <rect
          x="40"
          y="36"
          width="156"
          height="24"
          fill="var(--dracula-comment)"
          fillOpacity={0.16}
          stroke="var(--dracula-comment)"
          strokeOpacity={0.35}
        />
        <text x="118" y="52" fill="var(--dracula-comment)">
          cached prefix
        </text>
        <rect
          x="196"
          y="36"
          width="54"
          height="24"
          fill="var(--dracula-cyan)"
          fillOpacity={0.25}
          stroke="var(--dracula-cyan)"
          strokeOpacity={0.8}
        />
        <text x="223" y="52" fill="var(--dracula-cyan)">
          n_win
        </text>
        <rect
          x="250"
          y="36"
          width="110"
          height="24"
          fill="var(--dracula-comment)"
          fillOpacity={0.16}
          stroke="var(--dracula-comment)"
          strokeOpacity={0.35}
        />
        <text x="305" y="52" fill="var(--dracula-comment)">
          uncached suffix
        </text>
      </g>
      <text
        x="40"
        y="80"
        fontFamily="var(--font-family-mono)"
        fontSize="10"
        fill="var(--dracula-comment)">
        a query at i attends to [max(s, i - W + 1), i]
      </text>

      {/* Exact reconstruction: one replay pass per layer. */}
      <rect
        x="40"
        y="96"
        width="140"
        height="40"
        rx="2"
        fill="var(--dracula-orange)"
        fillOpacity={0.18}
      />
      <g stroke="var(--dracula-orange)" strokeOpacity={0.55}>
        {REPLAY_LAYER_LINES.map(y => (
          <path key={y} d={`M40 ${y} H180`} />
        ))}
      </g>
      <text
        x="192"
        y="120"
        fontFamily="var(--font-family-mono)"
        fontSize="10"
        fill="var(--dracula-comment)">
        exact: every layer, L x n_win
      </text>

      {/* Bounded reconstruction: one window, and nothing above it. */}
      <rect
        x="40"
        y="150"
        width="140"
        height="4"
        rx="1"
        fill="var(--dracula-cyan)"
        fillOpacity={0.8}
      />
      <text
        x="192"
        y="156"
        fontFamily="var(--font-family-mono)"
        fontSize="10"
        fill="var(--dracula-comment)">
        bounded: one window, n_win
      </text>

      <text
        x="40"
        y="196"
        fontFamily="var(--font-family-mono)"
        fontSize="10"
        fill="var(--dracula-comment)"
        fillOpacity={0.7}>
        SWA KV leaves the persistent cache, misses stay cheap
      </text>
    </svg>
  );
}

function ChapterArt({chapterId}: {chapterId: string}) {
  if (chapterId === 'abstract') {
    return (
      <AspectRatio ratio={16 / 9} style={sceneClip}>
        <FootprintScene alt="Bars on a log scale showing the global KV cache per token falling from 437 times the DeepSeek-V4.1-Flash footprint at DeepSeek-V1, to 4 times at V4-Flash, to 890 bytes per token at V4.1-Flash" />
      </AspectRatio>
    );
  }
  if (chapterId === 'at-a-glance') {
    return (
      <AspectRatio ratio={16 / 9} style={sceneClip}>
        <ArchitectureScene alt="One tick per layer across the 40-layer backbone: two sliding-window-only layers, an 18-layer CSA2 encoder, and a 20-layer decoder, with global KV projected across the boundary from the last encoder layer" />
      </AspectRatio>
    );
  }
  if (chapterId === 'csa2') {
    return (
      <AspectRatio ratio={16 / 9} style={sceneClip}>
        <IndexerScene alt="A grid of block rows in the shared candidate pool, with the blocks kept by their top score highlighted and a few positions inside them marked as the Top-512 selection" />
      </AspectRatio>
    );
  }
  if (chapterId === 'inference') {
    return (
      <AspectRatio ratio={16 / 9} style={sceneClip}>
        <FlopsScene alt="Line chart of single-token decode FLOPs against context length: the DeepSeek-V4.1-Flash curve stays almost flat from 4K to 1M tokens while the DeepSeek-V4-Flash curve rises steeply" />
      </AspectRatio>
    );
  }
  if (chapterId === 'swa-replay') {
    return (
      <AspectRatio ratio={16 / 9} style={sceneClip}>
        <ReplayScene alt="A prompt strip split into cached prefix, the replayed window, and the uncached suffix, above two replay-work bars showing a full layer stack against a single window" />
      </AspectRatio>
    );
  }
  return null;
}

// ─── Rail ────────────────────────────────────────────────────────────────────

function ChapterRail({
  activeId,
  onSelect,
}: {
  activeId: string;
  onSelect: (id: string) => void;
}) {
  // Resizable like the shell-side-nav template: 264 default, 220-400 range.
  // The AppShell drawer owns the rail below 1024px (see MobileNavToggle),
  // so the handle only matters at desktop widths.
  return (
    <SideNav
      collapsible
      resizable={{defaultWidth: 264, minWidth: 220, maxWidth: 400}}
      header={
        <SideNavHeading
          icon={<NavIcon icon={<Icon icon={ScrollText} size="sm" />} />}
          heading="DeepSeek-V4.1-Flash"
          subheading="Technical report tour"
          headingHref={SELF_HASH}
        />
      }>
      {CHAPTER_GROUPS.map(group => (
        <SideNavSection key={group.title} title={group.title}>
          {group.chapters.map(chapter => (
            <SideNavItem
              key={chapter.id}
              label={chapter.title}
              icon={chapter.icon}
              isSelected={chapter.id === activeId}
              onClick={() => onSelect(chapter.id)}
            />
          ))}
        </SideNavSection>
      ))}
    </SideNav>
  );
}

// ─── Chapter body ────────────────────────────────────────────────────────────

function SectionBlock({
  chapterId,
  section,
}: {
  chapterId: string;
  section: DocSection;
}) {
  return (
    <VStack gap={3}>
      <Heading level={2} id={sectionId(chapterId, section.key)}>
        {section.heading}
      </Heading>
      <Text type="body" color="secondary" display="block">
        {section.body}
      </Text>
      {section.bullets != null && (
        <List listStyle="disc">
          {section.bullets.map(bullet => (
            <ListItem key={bullet} label={bullet} />
          ))}
        </List>
      )}
      {section.code != null && (
        <CodeBlock
          code={section.code.source}
          language={section.code.language}
          title={section.code.title}
          width="100%"
        />
      )}
    </VStack>
  );
}

function ChapterNav({
  chapter,
  onSelect,
}: {
  chapter: DocChapter;
  onSelect: (id: string) => void;
}) {
  const index = CHAPTERS.findIndex(entry => entry.id === chapter.id);
  const previous = index > 0 ? CHAPTERS[index - 1] : undefined;
  const next = index < CHAPTERS.length - 1 ? CHAPTERS[index + 1] : undefined;
  return (
    <HStack gap={3} hAlign="between" vAlign="center">
      {previous != null ? (
        <Button
          label={previous.title}
          variant="secondary"
          icon={<Icon icon={ChevronLeft} size="sm" />}
          onClick={() => onSelect(previous.id)}
        />
      ) : (
        <StackItem size="fill" />
      )}
      {next != null ? (
        <Button
          label={next.title}
          variant="secondary"
          endContent={<Icon icon={ChevronRight} size="sm" />}
          onClick={() => onSelect(next.id)}
        />
      ) : (
        <StackItem size="fill" />
      )}
    </HStack>
  );
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function TechReport() {
  const [chapterId, setChapterId] = useState(DEFAULT_CHAPTER);
  const [activeSection, setActiveSection] = useState(
    OUTLINE_BY_CHAPTER[DEFAULT_CHAPTER][0]?.id ?? '',
  );

  // Responsive contract: below 1024px the outline stops being a column, since
  // a narrow viewport has nothing to outline against.
  const isNarrow = useMediaQuery('(max-width: 1024px)');

  const chapter = CHAPTERS.find(entry => entry.id === chapterId) ?? CHAPTERS[0];
  const outlineItems = OUTLINE_BY_CHAPTER[chapter.id] ?? [];
  const chapterNumber = CHAPTERS.findIndex(entry => entry.id === chapter.id) + 1;

  const openChapter = (id: string) => {
    setChapterId(id);
    setActiveSection(OUTLINE_BY_CHAPTER[id]?.[0]?.id ?? '');
    // A chapter reads as a new page, so the document goes back to the top
    // instead of keeping the previous chapter's scroll offset.
    window.scrollTo({top: 0});
  };

  return (
    <AppShell
      height="auto"
      contentPadding={0}
      variant="section"
      mobileNav={{hasToggle: false}}
      sideNav={<ChapterRail activeId={chapter.id} onSelect={openChapter} />}>
      <Layout
        height="auto"
        end={
          isNarrow ? undefined : (
            <LayoutPanel
              isScrollable={false}
              label="On this page"
              role="complementary"
              style={outlinePanel}>
              <Outline
                items={outlineItems}
                onActiveIdChange={setActiveSection}
              />
            </LayoutPanel>
          )
        }
        content={
          <LayoutContent isScrollable={false} padding={8}>
            <VStack gap={8}>
              <VStack gap={2}>
                <HStack gap={2} vAlign="center">
                  <MobileNavToggle />
                  <Text type="supporting" color="secondary">
                    DeepSeek-V4.1-Flash technical report
                  </Text>
                </HStack>
                <Heading level={1} type="display-2">
                  {chapter.title}
                </Heading>
                <Text type="supporting" color="secondary" hasTabularNumbers>
                  {`Chapter ${chapterNumber} of ${CHAPTERS.length} · DeepSeek-AI · research@deepseek.com`}
                </Text>
                {isNarrow && (
                  <Selector
                    label="On this page"
                    isLabelHidden
                    options={outlineItems.map(item => ({
                      value: item.id,
                      label: item.label,
                    }))}
                    value={activeSection}
                    onChange={(id: string) => {
                      setActiveSection(id);
                      scrollToSection(id);
                    }}
                    width="100%"
                  />
                )}
              </VStack>

              <Text type="large" color="secondary" display="block">
                {chapter.intro}
              </Text>

              <ChapterArt chapterId={chapter.id} />

              <VStack gap={8}>
                {chapter.sections.map(section => (
                  <SectionBlock
                    key={section.key}
                    chapterId={chapter.id}
                    section={section}
                  />
                ))}
              </VStack>

              <Divider />

              <ChapterNav chapter={chapter} onSelect={openChapter} />

              <Text type="supporting" color="secondary">
                Checkpoints and the full report:{' '}
                <Link href={REPORT_URL} isExternalLink type="supporting">
                  huggingface.co/deepseek-ai/DeepSeek-V4.1-Flash
                </Link>
              </Text>
            </VStack>
          </LayoutContent>
        }
      />
    </AppShell>
  );
}

// Scrolls the document to a heading and records it as the active section.
function scrollToSection(id: string) {
  const target = document.getElementById(id);
  if (target != null) {
    target.scrollIntoView({behavior: 'smooth', block: 'start'});
  }
}
