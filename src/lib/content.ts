/**
 * Portfolio content. Sources, in priority order:
 *   1. public/Jayanth_Ravimurugan_Resume.pdf (AI Engineer resume)
 *   2. Project READMEs in the GitHub repos linked below
 * Nothing here should be a claim that isn't backed by one of those.
 */

export type Link = { label: string; href: string };

export type Experience = {
  role: string;
  org: string;
  orgDetail?: string;
  location: string;
  period: string;
  current?: boolean;
  summary: string;
  highlights: string[];
  stack: string[];
  impact?: { value: string; label: string }[];
};

export const experience: Experience[] = [
  {
    role: "Student Research Assistant",
    org: "N+1 Institute",
    orgDetail: "University of Wisconsin–Madison",
    location: "Madison, WI",
    period: "2026 – Present",
    current: true,
    summary:
      "Building a full-stack RAG application that helps researchers in the UW Department of Surgery draft grant applications with AI assistance.",
    highlights: [
      "Document ingestion, chunking, embedding, and vector-retrieval pipelines integrated with AWS Bedrock LLM infrastructure.",
      "Tiptap-based rich-text editor (Google Docs–style) so researchers co-write grant applications with real-time AI assistance.",
      "React/TypeScript frontend and Python/FastAPI backend, deployed on AWS ECS/EC2 with CI/CD, handling HIPAA-protected data.",
    ],
    stack: ["RAG", "AWS Bedrock", "FastAPI", "React", "TypeScript", "Tiptap", "AWS ECS", "EC2", "CI/CD"],
  },
  {
    role: "Data Science Intern",
    org: "OneBanc Technologies",
    location: "Gurugram, India",
    period: "Nov 2024 – Feb 2025",
    summary:
      "Built the data and modeling foundation for financial named-entity recognition on raw SMS — from corpus to benchmarked models.",
    highlights: [
      "Collected ~500K raw SMS records and built a Python ETL pipeline that produced the annotated NER corpus used by every downstream model.",
      "Engineered a custom financial tokenizer that keeps account numbers, amounts, and merchant names intact.",
      "Benchmarked CRF, LSTM, BiLSTM, ANN, and BERT; fine-tuned BERT to 92.3% F1.",
      "Wrote Bash/PowerShell automation and YAML CI/CD pipelines, and refactored a C# codebase.",
    ],
    stack: ["Python", "BERT", "PyTorch", "NER", "ETL", "CI/CD", "C#"],
    impact: [
      { value: "92.3%", label: "F1, fine-tuned BERT" },
      { value: "~8 pp", label: "over BiLSTM baseline" },
      { value: "~30%", label: "fewer OOV tokens" },
      { value: "~40%", label: "fewer manual deploy steps" },
    ],
  },
];

export const education = [
  {
    school: "University of Wisconsin–Madison",
    degree: "Master of Science in Data Science",
    period: "2025 – 2027",
    location: "Madison, WI",
  },
  {
    school: "Amity University Haryana",
    degree: "Integrated B.Tech + M.Tech, Artificial Intelligence & Machine Learning",
    period: "2020 – 2025",
    location: "Haryana, India",
  },
];

export const publication = {
  title: "On-Device Financial Named Entity Recognition Using Deep Learning",
  venue: "ICDISS 2025 (IEEE)",
  role: "First Author",
  year: "2025",
  href: "https://ieeexplore.ieee.org/document/11320704",
  summary:
    "Benchmarked five NER architectures for resource-constrained hardware and proposed a quantization + pruning strategy: 60% smaller model with under 2 pp of F1 degradation.",
};

export const skillGroups: { name: string; items: string[] }[] = [
  {
    name: "LLM & AI Engineering",
    items: [
      "RAG pipelines",
      "Agentic systems",
      "LangGraph",
      "LangChain",
      "Prompt engineering",
      "Fine-tuning",
      "AWS Bedrock",
      "BERT",
      "LLaMA",
      "GPT",
    ],
  },
  {
    name: "Machine Learning",
    items: ["PyTorch", "Hugging Face Transformers", "scikit-learn", "TorchScript (on-device)"],
  },
  {
    name: "Data & Retrieval",
    items: ["ChromaDB", "FAISS", "Embeddings", "Semantic search", "PostgreSQL", "Pandas", "NumPy"],
  },
  {
    name: "MLOps & Cloud",
    items: [
      "Docker",
      "FastAPI",
      "Celery",
      "Redis",
      "AWS ECS",
      "AWS EC2",
      "GitHub Actions",
      "REST APIs",
      "Weights & Biases",
    ],
  },
  {
    name: "Product & Mobile",
    items: ["React", "TypeScript", "Tiptap", "Kotlin", "Jetpack Compose", "Android"],
  },
  {
    name: "Languages",
    items: ["Python", "TypeScript", "SQL", "Kotlin", "Java", "C++", "R", "Bash"],
  },
];

/** Capability → proof. Each area points at the work that demonstrates it. */
export const focusAreas: { title: string; body: string; proof: Link }[] = [
  {
    title: "Retrieval-augmented generation",
    body: "Ingestion, chunking, embeddings, and retrieval that keep prompts small and grounded.",
    proof: { label: "Text-to-SQL · N+1 Institute", href: "/projects/text-to-sql" },
  },
  {
    title: "Agents & orchestration",
    body: "Multi-step LangGraph pipelines driven by events, running asynchronously behind queues.",
    proof: { label: "AutoReviewer", href: "/projects/autoreviewer" },
  },
  {
    title: "Model internals",
    body: "Tokenizers, attention, and training loops written from first principles in PyTorch.",
    proof: { label: "Mini LLM", href: "/projects/mini-llm" },
  },
  {
    title: "NLP & efficient inference",
    body: "Domain NER, custom tokenization, and quantization + pruning for on-device models.",
    proof: { label: "IEEE ICDISS 2025", href: "/projects/financial-ner" },
  },
  {
    title: "Shipping to production",
    body: "Docker, FastAPI, CI/CD, and deployment across AWS, Hugging Face Spaces, Railway, and Vercel.",
    proof: { label: "Experience", href: "/#experience" },
  },
];

/**
 * Work in progress. Items 2–3 come from local repos that are still early —
 * TODO(Jayanth): remove any you don't want public yet.
 */
export const nowBuilding: { title: string; body: string; href?: string }[] = [
  {
    title: "AI grant-writing assistant",
    body: "RAG over research documents on AWS Bedrock, for the UW Department of Surgery (N+1 Institute).",
  },
  {
    title: "Multi-agent research engine",
    body: "A planner that emits a validated, dependency-aware task graph for search, extraction, critique, and synthesis agents.",
  },
  {
    title: "LLM regression detection",
    body: "Versioned prompt configs and structured outputs to catch quality regressions when prompts or models change.",
    href: "https://github.com/XElJayX/Model-Regression-Detection-System",
  },
];

// ---------------------------------------------------------------------------
// Projects
// ---------------------------------------------------------------------------

export type DemoKind = "mini-llm" | "text-to-sql" | "screenshots" | "none";

export type ArchitectureStep = { label: string; detail?: string };

export type Project = {
  slug: string;
  title: string;
  kicker: string;
  oneLiner: string;
  categories: string[];
  featured?: boolean;
  demo: DemoKind;
  /** Short status shown on cards. */
  status: { label: string; tone: "live" | "idle" | "offline" | "paper" };
  metrics: { value: string; label: string }[];
  stack: string[];
  problem: string;
  whyItMatters: string;
  built: string[];
  contribution: string;
  interesting: string[];
  architecture: ArchitectureStep[];
  challenges: { title: string; body: string }[];
  results?: string[];
  limitations?: string[];
  links: { github?: string; demo?: string; docs?: string; paper?: string };
};

export const projects: Project[] = [
  {
    slug: "mini-llm",
    title: "Mini LLM",
    kicker: "Transformer from scratch",
    oneLiner:
      "A GPT-style decoder-only transformer — tokenizer, attention, and training loop — written from first principles in PyTorch and served live.",
    categories: ["Transformers", "NLP", "ML Deployment"],
    featured: true,
    demo: "mini-llm",
    status: { label: "Live model", tone: "live" },
    metrics: [
      { value: "273K", label: "parameters" },
      { value: "3.07", label: "best val loss" },
      { value: "0", label: "HF model libraries" },
    ],
    stack: ["PyTorch", "Custom BPE", "FastAPI", "React", "Docker", "Hugging Face Spaces", "Weights & Biases"],
    problem:
      "Most engineers use LLMs through an API and never see the machinery. I wanted to own every layer: how text becomes tokens, how attention mixes them, and how a training run is kept stable.",
    whyItMatters:
      "Debugging and optimizing real LLM systems — context limits, tokenization quirks, sampling behavior — is much easier when you've built each part yourself.",
    built: [
      "A byte-pair-encoding tokenizer: character initialization, iterative pair merging, encode/decode, JSON persistence.",
      "Token + learned positional embeddings, scaled dot-product attention with a causal mask, and 4-head multi-head attention.",
      "Pre-norm transformer blocks with residual connections and a 4× feed-forward expansion, stacked four deep.",
      "A training loop with AdamW, cosine LR annealing, gradient clipping (norm 1.0), dropout, early stopping, and W&B tracking.",
      "A FastAPI inference service and React chat UI, packaged in a single Docker image on Hugging Face Spaces.",
    ],
    contribution:
      "Designed, implemented, trained, and deployed every component. No Hugging Face model classes — just PyTorch tensors.",
    interesting: [
      "Same tokenization family as GPT models (BPE), implemented without a library.",
      "Early stopping picked the best checkpoint at epoch 7 (val loss 3.07); training halted at epoch 12.",
      "The demo on this page calls the real model on Hugging Face through a server-side proxy that validates input, rate-limits, and detects when the Space is asleep.",
    ],
    architecture: [
      { label: "Prompt", detail: "this page" },
      { label: "Vercel API route", detail: "validate · rate-limit" },
      { label: "HF Space", detail: "FastAPI in Docker" },
      { label: "BPE tokenizer", detail: "~530 tokens" },
      { label: "Transformer × 4", detail: "4 heads · d=64" },
      { label: "Sampling", detail: "temperature" },
    ],
    challenges: [
      {
        title: "Training stability on a tiny model",
        body: "With ~100 Q&A pairs, overfitting is immediate. An 80/20 split, dropout 0.2, cosine LR decay, gradient clipping, and patience-based early stopping kept the best checkpoint instead of the last one.",
      },
      {
        title: "One container, two runtimes",
        body: "The Space runs a Python API and a React UI. The Dockerfile builds the React app at image build time and FastAPI serves the static bundle, so the whole product ships as one image on port 7860.",
      },
      {
        title: "Free-tier cold starts",
        body: "Free Spaces sleep when idle. The portfolio checks the Space's runtime stage first, wakes it when needed, and tells you how long it's been waiting — instead of a spinner that never ends.",
      },
    ],
    results: [
      "273,536 parameters · 4 layers · 4 heads · 64-dim embeddings · 64-token context.",
      "Best validation loss 3.07 at epoch 7 (early stopping at epoch 12), trained on an Apple M4 with MPS.",
    ],
    limitations: [
      "Trained on roughly 100 personal Q&A pairs, so answers can be incoherent or wrong. That's expected at this size: the point is the implementation, not the output quality.",
      "No instruction tuning or RLHF, a fixed vocabulary, and a 64-token context window.",
    ],
    links: {
      github: "https://github.com/XElJayX/Mini-llm",
      demo: "https://huggingface.co/spaces/ElJayy/mini-llm",
    },
  },
  {
    slug: "text-to-sql",
    title: "Text-to-SQL with Schema-Aware RAG",
    kicker: "RAG · LLM application",
    oneLiner:
      "Ask a database a question in English. Retrieval picks the relevant tables, an LLM writes SQL, and a validator checks and self-corrects it before anything runs.",
    categories: ["RAG", "LLM Applications", "Evaluation"],
    featured: true,
    demo: "text-to-sql",
    status: { label: "Interactive demo", tone: "idle" },
    metrics: [
      { value: "100%", label: "simple-query accuracy" },
      { value: "60%", label: "medium / hard" },
      { value: "17", label: "golden test cases" },
    ],
    stack: ["ChromaDB", "fastembed", "Groq Llama 3.1", "FastAPI", "PostgreSQL", "React", "Railway", "Vercel"],
    problem:
      "Naive Text-to-SQL pastes the entire schema into the prompt. On real databases that blows the context window and drowns the model in irrelevant tables.",
    whyItMatters:
      "Letting non-engineers query data safely is one of the most practical LLM use cases — but only if it's grounded in the right schema and can't damage the database.",
    built: [
      "An offline indexer that turns each table into a rich chunk — columns, types, foreign keys, sample rows, and the business questions it answers — embedded into ChromaDB.",
      "Per-query retrieval: embed the question, run cosine similarity search, and inject only the top-4 table schemas into the prompt.",
      "A two-level validator: block destructive keywords (DROP, DELETE, UPDATE…), then dry-run the query with EXPLAIN.",
      "A self-correction loop that feeds validation errors back to the LLM as a multi-turn conversation.",
      "An evaluation harness scoring execution accuracy (order-independent result-set comparison) by query complexity.",
    ],
    contribution:
      "Built the full system: retrieval pipeline, prompt construction, validator, evaluation harness, FastAPI backend, React frontend, and deployment.",
    interesting: [
      "Retrieval is the context-window budget: a question about cancellations retrieves companies + subscriptions, not feature_usage or invoices.",
      "Designed for schemas with 50+ tables, where full-schema prompting stops being viable.",
      "Safety is enforced outside the model: generated SQL must pass keyword checks and an EXPLAIN dry-run before execution.",
    ],
    architecture: [
      { label: "Question" },
      { label: "Embed", detail: "bge-small-en-v1.5" },
      { label: "ChromaDB", detail: "top-4 tables" },
      { label: "Prompt builder" },
      { label: "Llama 3.1", detail: "Groq" },
      { label: "Validator", detail: "block · EXPLAIN · retry" },
      { label: "PostgreSQL" },
    ],
    challenges: [
      {
        title: "Retrieval misses",
        body: "When a critical table scores just below the top-k cutoff because of vocabulary mismatch, the LLM never sees it. This was the main failure mode on harder questions.",
      },
      {
        title: "Aggregates in the wrong clause",
        body: "The model sometimes put aggregate functions in WHERE instead of HAVING. EXPLAIN catches it, and the self-correction turn usually fixes it.",
      },
      {
        title: "Non-determinism",
        body: "The same question can retrieve slightly different tables across runs, which makes evaluation noisy. The golden set scores execution results, not SQL strings.",
      },
    ],
    results: [
      "17-question golden set: 100% execution accuracy on simple queries, 60% on medium/hard queries.",
    ],
    links: {
      github: "https://github.com/XElJayX/TexttoSQL",
      demo: "https://texttosql-frontend.vercel.app",
      docs: "https://texttosql-production-b579.up.railway.app/docs",
    },
  },
  {
    slug: "autoreviewer",
    title: "AutoReviewer",
    kicker: "Autonomous agent",
    oneLiner:
      "An autonomous agent that reviews GitHub pull requests: a webhook fires, a LangGraph pipeline reads the diff, and a structured review is posted back to the PR.",
    categories: ["AI Agents", "LLM Applications", "Backend Systems"],
    featured: true,
    demo: "screenshots",
    status: { label: "Real output shown", tone: "idle" },
    metrics: [
      { value: "~95%", label: "memory cut" },
      { value: "512 MB", label: "deploy budget" },
      { value: "70B", label: "LLaMA 3.3 via Groq" },
    ],
    stack: ["LangGraph", "Groq LLaMA 3.3 70B", "FastAPI", "Celery", "Redis", "GitHub API", "HMAC-SHA256", "Railway"],
    problem:
      "Code review is a bottleneck, and a first pass for security, performance, and quality issues is repetitive work that shouldn't need a human to start.",
    whyItMatters:
      "It's a realistic agent: event-driven, running unattended against a third-party API, with real latency, security, and memory constraints.",
    built: [
      "A FastAPI webhook server that verifies GitHub's HMAC-SHA256 signature and returns immediately.",
      "Redis + Celery for asynchronous job processing, so slow LLM calls never block the webhook.",
      "A three-node LangGraph agent: fetch_pr → analyze_code → post_comment.",
      "A structured review format covering summary, major issues, code quality, performance, security, suggestions, and a verdict.",
    ],
    contribution: "Designed the architecture and built the agent, webhook service, worker, and deployment.",
    interesting: [
      "Reviews span 4 dimensions — correctness, quality, performance, and security — and end with an Approve / Request Changes verdict.",
      "Signature comparison uses a constant-time check to prevent timing attacks.",
    ],
    architecture: [
      { label: "PR opened" },
      { label: "Webhook", detail: "FastAPI · HMAC" },
      { label: "Redis queue" },
      { label: "Celery worker" },
      { label: "LangGraph agent", detail: "fetch → analyze → post" },
      { label: "Review on PR" },
    ],
    challenges: [
      {
        title: "Fitting in 512 MB",
        body: "Celery's default worker spawned dozens of processes and crashed the service on a 512 MB budget. Running a single worker process cut memory use by ~95%.",
      },
      {
        title: "GitHub's 10-second webhook window",
        body: "The LLM call alone takes seconds, so the handler only verifies and enqueues, returns right away, and lets the worker run the agent.",
      },
      {
        title: "Untrusted callers",
        body: "Without signature verification, anyone could trigger the agent with fake events. Every webhook is verified with HMAC-SHA256 using the shared secret.",
      },
    ],
    links: {
      github: "https://github.com/XElJayX/PRCodeReviewer",
    },
  },
  {
    slug: "financial-ner",
    title: "On-Device Financial NER",
    kicker: "Published research · IEEE",
    oneLiner:
      "Extracting financial entities from SMS on the phone itself — benchmarking five architectures and compressing the model for resource-constrained hardware.",
    categories: ["NLP", "Research", "Efficient ML"],
    demo: "none",
    status: { label: "IEEE ICDISS 2025", tone: "paper" },
    metrics: [
      { value: "60%", label: "smaller model" },
      { value: "<2 pp", label: "F1 degradation" },
      { value: "5", label: "architectures benchmarked" },
    ],
    stack: ["PyTorch", "BERT", "BiLSTM", "CRF", "Quantization", "Pruning", "TorchScript"],
    problem:
      "Financial SMS contain account numbers, amounts, and merchants. Extracting them in the cloud means shipping sensitive text off the device.",
    whyItMatters:
      "On-device inference keeps financial data private and works offline — but only if the model is small enough for the hardware without giving up accuracy.",
    built: [
      "A benchmark of five NER architectures — CRF, LSTM, BiLSTM, ANN, and BERT — for on-device deployment.",
      "A quantization + pruning strategy for resource-constrained hardware.",
    ],
    contribution: "First author: designed the benchmark, the compression strategy, and the evaluation.",
    interesting: [
      "60% model size reduction while losing under 2 points of F1.",
      "Builds on industry work at OneBanc: a ~500K-message corpus, a domain tokenizer, and a fine-tuned BERT at 92.3% F1.",
    ],
    architecture: [
      { label: "Raw SMS" },
      { label: "ETL + annotation" },
      { label: "Domain tokenizer" },
      { label: "Benchmark × 5" },
      { label: "Quantize + prune" },
      { label: "On-device NER" },
    ],
    challenges: [
      {
        title: "Accuracy vs. footprint",
        body: "The most accurate model isn't the one that fits on a phone. The work was finding a compression strategy that kept F1 within 2 points.",
      },
      {
        title: "Domain tokens",
        body: "Standard tokenizers split account numbers and amounts into meaningless pieces. A financial tokenizer that preserves those entities cut out-of-vocabulary tokens by ~30% (OneBanc).",
      },
    ],
    links: {
      paper: "https://ieeexplore.ieee.org/document/11320704",
    },
  },
];

export function getProject(slug: string): Project | undefined {
  return projects.find((p) => p.slug === slug);
}
