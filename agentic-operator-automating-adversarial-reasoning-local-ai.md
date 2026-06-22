# The Agentic Operator: Automating Adversarial Reasoning with Local AI

Traditional offensive security operations have long relied on human operators executing sequential tool commands, analyzing results manually, and pivoting through target environments. While automated scripting exists, it lacks the cognitive flexibility to respond to dynamic defense mechanisms or adapt payload strategies in real-time.

At the **International Conference on Emerging Trends in Cybersecurity, Software Development and Information Privacy (ICETCSDP 2026)**, hosted by MSIT, I delivered a keynote briefing detailing a major shift: **The Agentic Operator**. This research demonstrates how offensive teams can orchestrate autonomous, local AI agents to automate multi-stage adversary reasoning, vulnerability discovery, exploit compilation, and lateral movement.

For this conference, I built and showcased two distinct implementations of the agentic architecture, which are now available as interactive, live presentation decks:

*   [**OpenCode Edition**](talks/2026/ICETCSDP/agentic-operator-oc-edition.html): An implementation utilizing Anomaly Innovations' OpenCode framework, showcasing a plan-and-build dual-mode structure for structured exploit engineering.
*   [**Hermes-Agent Edition**](talks/2026/ICETCSDP/agentic-operator-ha-edition.html): An implementation using Nous Research's self-improving HermesAgent runtime, demonstrating dynamic sub-agent delegation, learning loops, and real-time feedback orchestration.

Both presentation decks are fully dynamic, live-rendered interactive HTML documents embedded with architecture visualizations and simulated attack flows.

---

## The Paradigm: Reasoning Over Scripting

The core premise of the Agentic Operator is moving beyond static automation scripts. In a standard red team engagement, a human operator operates in a loop: **Think → Act → Observe**. 

An agentic operator automates this cognitive loop by combining:
1.  **System Prompts (Instruction Set):** Enforcing operational guidelines, safety constraints, and attack strategies (similar to an `agents.md` context).
2.  **Skills (Dynamic Learning):** Persistent knowledge bases (like `skills.md`) that the agent compiles dynamically when it successfully solves a task.
3.  **Model Context Protocol (MCP) Tools:** Standardized APIs that allow local LLMs to safely interact with local filesystems, execute terminal commands (e.g., nmap, searchsploit), and query local databases.

---

## Architecture of the Local Attack Lab

A critical requirement for autonomous offensive testing is **sovereignty and privacy**. Public LLM APIs are an immediate OpSec liability, as sending corporate source code or exploit sequences to cloud models leaks sensitive vulnerabilities and client intellectual property.

The architecture demonstrated at ICETCSDP 2026 runs entirely on offline, commodity hardware:

*   **Virtualization Host (Proxmox VE):** Segmenting the infrastructure into secure zones.
*   **AI Engine (Ollama):** Hosting local, open-source model weights (e.g., Llama-3-based or Qwen-2.5-Coder weights) running on a local workstation GPU.
*   **Agent Workspaces:** Isolated LXC containers executing the agent runtimes (OpenCode or HermesAgent).
*   **Attack Platform (Kali Linux VM):** Equipped with a custom-engineered **kali-mcp** server, exposing security tools (Metasploit, Nmap, CrackMapExec) as callable JSON tools for the AI model.
*   **Target Network:** Ephemeral, isolated targets accessed via secure OpenVPN tunnels (e.g., HackTheBox dedicated networks or local active directory ranges).

---

## Key Takeaways for the Security Ecosystem

### For Red Teams:
Autonomous agent swarms do not replace human operators; they scale them. A single human operator transitions to a **strategist**, defining the target scope and verifying the agent's plan mode output before approving the build-and-execute phase. This enables rapid, parallelized threat emulation at a scale previously impossible.

### For Blue Teams:
Traditional detection mechanisms rely on identifying known tool signatures (e.g., specific Mimikatz binaries or Metasploit shells). However, when an agent dynamically refactors its source code, compiles custom implants locally, and alters its sleep structures on the fly, static signatures become obsolete. 

Defenders must pivot toward **detecting reasoning patterns** and behavioral anomalies (e.g., tracking low-level CPU performance counters to detect indirect system calls or monitoring rapid, structured lateral movement attempts).

---

## Explore the Presentations

To dive deeper into the technical execution and see step-by-step videos and interactive network diagrams, access the live presentation documents below:

*   👉 [**Access the OpenCode Edition Slides**](talks/2026/ICETCSDP/agentic-operator-oc-edition.html)
*   👉 [**Access the Hermes-Agent Edition Slides**](talks/2026/ICETCSDP/agentic-operator-ha-edition.html)

Both decks are optimized for desktop viewing and include built-in interactive terminal views and architecture simulators.
