# AEGIS-X — Agents & Sub-Agents Catalog

**Source:** `aegis-x-agents.md` (master OpenCode agent config) + individual agent `.md` files in the project.
**Stack:** 11 primary agents + 12 subagents.
**Runtime:** Loaded into **OpenCode** as the agent harness. Each agent is a standalone `.md` file under `.opencode/agents/` (project) or `~/.config/opencode/agents/` (global); filename must match the agent identifier exactly.
**Interaction model:** Primary agents are the operators you interact with directly (Tab to cycle). Subagents are invoked by primaries via the Task tool, or manually via `@mention`.

> Note: the presentation decks show a simplified 6-card subagent diagram (Recon, Scan, Analysis, Exploit, OSINT, Report). The authoritative set is the **12 subagents** below.

---

## 1. Primary Agents (11)

| # | Agent | Description | Temp | Top_P | Steps |
|---|-------|-------------|------|-------|-------|
| 1 | `security-auditor` | Static security audit of codebases, configs, and infrastructure — read-only, no execution. | 0.1 | 0.85 | 30 |
| 2 | `red-operator` | Full red team operator — plans and executes adversarial attack chains against explicitly authorized targets. | 0.3 | 0.90 | 80 |
| 3 | `penetration-operator` | Structured penetration tester following defined methodology (PTES / OWASP WSTG / NIST SP 800-115). | 0.2 | 0.88 | 60 |
| 4 | `white-operator` | White-box assessor with full system knowledge — source code, architecture, and credentials provided. | 0.15 | 0.85 | 50 |
| 5 | `grey-operator` | Grey-box assessor with partial knowledge — limited credentials or architecture context. | 0.25 | 0.88 | 60 |
| 6 | `black-operator` | Black-box assessor — zero prior knowledge, fully external attacker simulation. | 0.35 | 0.92 | 70 |
| 7 | `osint-operator` | Open-source intelligence operator — passive, non-intrusive intel on people, orgs, and infrastructure. | 0.3 | 0.90 | 50 |
| 8 | `coder-operator` | Security-focused developer — builds offensive tools, automation scripts, exploit PoCs, and utilities. | 0.3 | 0.90 | 60 |
| 9 | `code-review-operator` | Security-focused code reviewer — vulnerabilities, logic flaws, insecure patterns. Read-only. | 0.1 | 0.85 | 40 |
| 10 | `threat-modeler` | Threat modeling specialist — STRIDE, PASTA, MITRE ATT&CK mapping for systems and architectures. | 0.2 | 0.87 | 35 |
| 11 | `devsecops-operator` | DevSecOps integrator — CI/CD pipeline security, IaC scanning, container hardening, SAST/DAST integration. | 0.25 | 0.88 | 45 |

**White/Grey/Red/Black tiers** = the four operator-knowledge profiles: white-box (full knowledge) → grey-box (partial) → red (full kill chain, no persistence) → black-box (zero knowledge, external). The decks render these as capability tiers (25% / 50% / 80% / 100%).

---

## 2. Sub-Agents (12)

| # | Subagent | Description | Temp | Top_P | Steps |
|---|----------|-------------|------|-------|-------|
| 1 | `scope` | Defines and validates engagement scope, ROE, and authorization boundaries. Must run before any active operation. | 0.1 | 0.85 | 10 |
| 2 | `osint` | Open-source intelligence collection on people, orgs, domains, and infrastructure. Passive only. | 0.3 | 0.90 | 35 |
| 3 | `recon` | Passive and active information gathering on targets within defined scope. | 0.2 | 0.88 | 40 |
| 4 | `scan` | Port scanning, service enumeration, vulnerability scanning, and web app scanning against authorized targets. | 0.15 | 0.85 | 50 |
| 5 | `analysis` | Deep-dive analysis of findings, code, configs, logs, and intelligence. Read-only, no execution. | 0.1 | 0.85 | 30 |
| 6 | `triage` | Rapidly assesses and prioritizes findings, alerts, or intelligence before full analysis or reporting. | 0.15 | 0.85 | 15 |
| 7 | `exploit` | Controlled exploitation of confirmed vulnerabilities within scope. Every execution requires operator approval. | 0.2 | 0.88 | 40 |
| 8 | `post-exploit` | Privilege escalation, lateral movement, persistence, and data-access simulation. Every action requires operator approval. | 0.25 | 0.90 | 35 |
| 9 | `code-review` | Security-focused review of code snippets, scripts, exploit PoCs, and security tools. Read-only. | 0.1 | 0.85 | 20 |
| 10 | `report` | Produces structured security reports (executive, technical, pentest, audit) from engagement findings. | 0.4 | 0.88 | 25 |
| 11 | `remediation` | Prioritized, actionable fix guidance for identified security findings. | 0.3 | 0.88 | 20 |
| 12 | `documentation` | Technical documentation, runbooks, playbooks, and engagement artifacts. | 0.4 | 0.90 | 20 |

---

## 3. Agent × Subagent Access Matrix

`allow` = invoke autonomously · `ask` = requires operator confirmation · `—` = denied

| Primary Agent | scope | osint | recon | scan | analysis | triage | exploit | post-exploit | code-review | report | remediation | documentation |
|---------------|-------|-------|-------|------|----------|--------|---------|--------------|-------------|--------|-------------|---------------|
| `security-auditor` | allow | — | allow | allow | allow | allow | — | — | — | allow | — | allow |
| `red-operator` | allow | allow | allow | allow | allow | allow | ask | ask | — | allow | — | allow |
| `penetration-operator` | allow | — | allow | allow | allow | allow | ask | ask | — | allow | allow | allow |
| `white-operator` | allow | — | — | allow | allow | allow | — | — | allow | allow | allow | allow |
| `grey-operator` | allow | — | allow | allow | allow | allow | ask | ask | — | allow | — | allow |
| `black-operator` | allow | allow | allow | allow | allow | allow | ask | — | — | allow | — | allow |
| `osint-operator` | allow | allow | allow | — | allow | allow | — | — | — | allow | — | allow |
| `coder-operator` | — | — | — | — | allow | — | — | — | allow | allow | — | allow |
| `code-review-operator` | — | — | — | — | allow | allow | — | — | — | allow | — | allow |
| `threat-modeler` | allow | — | — | — | allow | allow | — | — | — | allow | — | allow |
| `devsecops-operator` | — | — | — | allow | allow | allow | — | — | allow | allow | allow | allow |

---

## 4. Permission Model

- Per-agent permission blocks gate: `read`, `edit`, `glob`, `grep`, `list`, `bash`, `task` (subagent invocation), `webfetch`, `websearch`, `todowrite`, plus `external_directory`, `lsp`, `skill`, `question`, `doom_loop`.
- Values: `allow` | `ask` | `deny`.
- `bash` supports glob patterns (e.g. `"nmap *": allow`, `"*": ask`). **Last matching rule wins** — wildcard `"*"` first, specific rules after.
- Exploitation and post-exploitation are gated to `ask` (human confirmation) on every operator that has them.

---

## 5. Tool Layer (what agents call via MCP)

- **kali-mcp** — 35 tools over SSE (port 8000) + SSH MCP — original AEGIS-X build.
- **HexStrike AI MCP** — 150+ tools (Flask API :8888 + `hexstrike_mcp.py` stdio bridge) — PwC Cyber Summit workshop stack.

---

*All 11 primary agents and 12 subagents are now fully enumerated from `aegis-x-agents.md`. No gaps remain.*
