# Workshop Prerequisites — Autonomous Offensive Operator

**PwC Cyber Summit · 90-minute hands-on workshop**

This is a **hands-on** session — we start with everyone already set up. Complete everything below **before you arrive**. This page is the quick checklist; the **full step-by-step is in `README.md`** (in the repo). Follow the README to actually do each item.

> ⏱️ Budget **45–60 minutes**. Don't leave it to the morning of.

> 💬 **Stuck? Reach out before the session.** Ping **`caesar7786` on Discord** with any setup problem or question — sort it out ahead of time, not in the room.

---

## What you'll walk away with

A working, self-hosted autonomous offensive operator on your own Kali VM — **OpenCode** (brain) + **HexStrike AI MCP** (150+ tools), run against live HTB/THM targets. The operator layer (**Aegis-X**) is provided and installed **live during the workshop** — you don't need it beforehand.

---

## Scope & ethics

Only run this against machines you're **authorized** to test — your own HTB/THM instances or systems with written permission. The agent autonomously executes offensive tooling. Keep it pointed at the lab.

---

## What to have ready (checklist)

**Machine**
- [ ] Virtualization enabled in BIOS/UEFI (VT-x / AMD-V) — corporate laptops often block this, check now
- [ ] **VirtualBox** installed (recommended) — or VMware
- [ ] **Kali Linux VM** created and updated — **rec. 4 vCPU / 4 GB / 60 GB**, min 2 / 2 / 40
- [ ] `git`, `python3`, `python3-venv`, `nmap` present

**Range access**
- [ ] **HTB** and/or **THM** account created, login confirmed (free tier OK)
- [ ] **OpenVPN** connects and a spawned target is reachable *(most likely to fail on corp networks — test early, have a hotspot ready)*

**Model brain (bring your own key)**
- [ ] Provider key ready — **OpenRouter** (recommended, add a little credit) / Ollama Cloud / OpenCode Zen / any paid key
- [ ] **Model must support tool calling** — without it HexStrike's tools never fire
  - ✅ **GLM-4.5** or **Qwen3.5** — safest picks
  - ⚠️ **Gemma 4** — works but test your runtime first (some parsers drop it to chat-only)
  - ❌ **DeepSeek-R1** — not for the live agent (unstable tool calls, burns tokens)

**Operator stack**
- [ ] **OpenCode** installed, provider key added (`opencode auth login`)
- [ ] **HexStrike AI** cloned + installed, server runs, `/health` OK
- [ ] HexStrike **MCP wired into OpenCode**, tools visible in a sanity prompt
- [ ] **Trimmed HexStrike to the tool categories you need** (token budget — the agent burns context fast)

---

**Every box ticked? You're ready.** Full instructions and troubleshooting are in **`README.md`**. Questions before the day → **Discord: `caesar7786`**. See you at the summit.
