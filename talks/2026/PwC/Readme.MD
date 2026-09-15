# Autonomous Offensive Operator — Workshop Setup

**PwC Cyber Summit · 90-minute hands-on workshop**

This README takes you from a clean machine to a **working OpenCode agent wired to the HexStrike AI MCP**, connected to a live HTB/THM target over VPN. Do **all** of this **before** the session — we start with everyone already set up.

The final piece — **Aegis-X** (the agent/subagent definitions and skills that turn OpenCode into the autonomous operator) — is provided and installed **live during the workshop**. You do not need it beforehand; just finish everything below.

> ⏱️ Budget **45–60 minutes**. Don't leave it to the morning of.

> 💬 **Stuck? Reach out before the session.** Ping **`caesar7786` on Discord** with any setup problem or question — get it sorted ahead of time, not in the room.

---

## ⚠️ Scope & ethics

Only run this against machines you are **authorized** to test — your own HTB/THM instances, CTF boxes, or systems with written permission. The agent can autonomously execute offensive tooling. Keep it pointed at the lab. Never at anything you don't own or have explicit authorization for.

---

## 0. What you'll have running when done

- **OpenCode** — the agent harness ("the brain")
- **HexStrike AI MCP** — 150+ security tools exposed to the agent over MCP
- **A model provider** — your own API key (OpenRouter / Ollama Cloud / OpenCode Zen / paid)
- **VPN** — connected to HTB or THM, a target box reachable
- *(In session)* **Aegis-X** — agents, subagents, and skills fed into OpenCode

---

## 1. Host & VM requirements

You'll run everything inside a **Kali Linux VM**.

| | Recommended | Minimum |
|---|---|---|
| vCPU | 4 | 2 |
| RAM | 4 GB | 2 GB (headless — sluggish) |
| VM disk | 60 GB dynamic | 40 GB |
| Host free disk | 70 GB+ | 50 GB |

- Enable **virtualization (VT-x / AMD-V)** in BIOS/UEFI. Corporate laptops often block this — **check now.**
- Hypervisor: **VirtualBox** (recommended, free) — https://www.virtualbox.org/ — or VMware Workstation.

---

## 2. Kali Linux VM

1. Get the latest **Kali Linux** (installer ISO or prebuilt VirtualBox image) — https://www.kali.org/get-kali/
   *(The full/default Kali image ships most security tools HexStrike uses — prefer it over the light image.)*
2. Create/import the VM with the specs above and boot it.
3. Confirm internet and update:
   ```bash
   ping -c 3 kali.org
   sudo apt update && sudo apt -y full-upgrade
   ```
4. Networking: default **NAT** is fine.

---

## 3. Base tooling (Python, git, common tools)

Most security tools are already in Kali. Make sure the essentials are present:

```bash
sudo apt update
sudo apt -y install git python3 python3-venv python3-pip curl nmap
# HexStrike will use whatever else is installed and skips what isn't.
```

> HexStrike gracefully handles missing tools — it uses the subset you have installed. The full Kali image covers the vast majority out of the box.

---

## 4. Install OpenCode

```bash
curl -fsSL https://opencode.ai/install | bash
```

Then confirm and check your version (needed for the MCP config format in Step 6):

```bash
opencode --version
```

> Alternative install: `npm i -g opencode-ai`. See https://opencode.ai/docs for current options.

---

## 5. Connect your model (bring your own key)

The agent needs a model. Add a provider credential:

```bash
opencode auth login
```

Pick your provider and paste your key. Any of these work:

- **OpenRouter** — https://openrouter.ai/ — *recommended; add a few dollars of credit*
- **Ollama Cloud** — https://ollama.com/
- **OpenCode Zen / Free tier**
- **Any paid key you already hold** (Anthropic, OpenAI, etc.)

### ⚠️ Read this — free tiers will throttle

An autonomous agent fires **many** model calls in quick succession. Free models rate-limit hard and **will stall your run mid-demo**. If you want a smooth experience, use **OpenRouter with a small credit balance**.

**Recommended models** — the agent is useless if the model can't call tools well. Ordered best-fit first:

- **GLM-4.5** — built for agentic tool use. Safest pick.
- **Qwen3.5** — reliable tool caller. Strong pick.
- **Gemma 4** — has native tool calling, but uses a custom tool-call protocol; some runtimes (notably older Ollama) parse it wrong and silently drop to chat-only. **Test your exact setup before the day.**
- **DeepSeek-R1** — reasoning model. Tool calling is unstable, and its `<think>` traces break MCP parsers and burn the token budget. **Not for the live agent** — offline reasoning only.

> **Whatever you bring must support function/tool calling.** Without it, HexStrike's tools never fire and the agent just chats. Confirm with the Step 8 sanity prompt before you rely on it.

---

## 6. Install & run HexStrike AI (the tool layer)

**Clone and set up (Python venv):**

```bash
git clone https://github.com/0x4m4/hexstrike-ai.git
cd hexstrike-ai
python3 -m venv hexstrike-env
source hexstrike-env/bin/activate
pip3 install -r requirements.txt
```

**Start the server** (Flask API on port 8888) — keep this terminal open:

```bash
python3 hexstrike_server.py
```

**Verify it's up** (new terminal):

```bash
curl http://localhost:8888/health
```

You should get a healthy response listing available tools. Note the full path to `hexstrike_mcp.py` — you need it next:

```bash
readlink -f hexstrike_mcp.py
```

---

## 7. Wire HexStrike into OpenCode (MCP)

OpenCode reads MCP config from `~/.config/opencode/opencode.json` (global) or an `opencode.json` in your project directory.

> **Config format depends on your OpenCode version (check `opencode --version`).** Use the matching block below. Replace `/full/path/to/` with the path from Step 6.

**V1 (current stable) format:**
```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "hexstrike": {
      "type": "local",
      "command": [
        "python3",
        "/full/path/to/hexstrike-ai/hexstrike_mcp.py",
        "--server",
        "http://localhost:8888"
      ],
      "enabled": true
    }
  }
}
```

**V2 format** *(servers nested under `mcp.servers`, uses `disabled` not `enabled`):*
```json
{
  "$schema": "https://opencode.ai/config.json",
  "mcp": {
    "servers": {
      "hexstrike": {
        "type": "local",
        "command": [
          "python3",
          "/full/path/to/hexstrike-ai/hexstrike_mcp.py",
          "--server",
          "http://localhost:8888"
        ]
      }
    }
  }
}
```

> For this workshop we run HexStrike **without API-key auth on localhost** — simplest and avoids a known OpenCode quirk where MCP `environment` vars aren't always passed to the spawned process. Leave `HEXSTRIKE_REQUIRE_API_KEY` unset.

---

## 8. Verify OpenCode ↔ HexStrike

With `hexstrike_server.py` running, start OpenCode:

```bash
opencode
```

Confirm the HexStrike tools are loaded (they appear alongside built-in tools). A quick sanity prompt:

> *"Using the hexstrike tools, run a health check / list the available security tools."*

If tools show up and respond, the brain and tool layer are connected. ✅

---

## 9. HTB / THM accounts

Create and confirm login on **at least one** (both is safer):

- **Hack The Box** — https://www.hackthebox.com/ *(free tier OK)*
- **TryHackMe** — https://tryhackme.com/ *(free tier OK)*

---

## 10. VPN (test this early — most likely to fail on corp networks)

Both platforms connect over **OpenVPN**.

```bash
sudo apt -y install openvpn
# Download your personal .ovpn from your HTB/THM dashboard, then:
sudo openvpn --config your-file.ovpn
```

In another terminal, spawn a free machine on the platform, then confirm reachability:

```bash
ping -c 3 <TARGET_IP>
```

If the VPN won't connect from your work network, use a **personal hotspot** — and plan to use it during the workshop.

---

## 11. Suggested rooms / challenges

Pick beginner→intermediate targets that show a clean recon → enumerate → exploit arc (ideal for an autonomous operator). Confirm free-tier availability on your account.

**TryHackMe (free-friendly):**
- **Blue** — SMB / EternalBlue; great nmap → exploit autonomous story
- **Vulnversity** — recon → web enum → exploit, classic beginner path
- **Basic Pentesting** — mixed enumeration
- **Pickle Rick** — quick, visual web challenge
- **OWASP Top 10** — web-vuln focused

**Hack The Box (Starting Point — free tier):**
- **Meow / Fawn / Dancing / Redeemer** — Tier 0, warm-up
- **Appointment** — SQL injection (good web demo)
- **Crocodile / Sequel** — web / db enumeration

> Retired HTB machines need VIP. For guaranteed-free targets, lean on **THM rooms** and **HTB Starting Point**.

---

## 12. In session — Aegis-X (provided on the day)

During the workshop you'll add **Aegis-X** on top of this base: the agent/subagent definitions, permissions, and skills that OpenCode loads to become the autonomous operator. It plugs into the OpenCode + HexStrike setup you've just built — no extra prerequisites. Just arrive with everything above **verified**.

---

## Running efficiently — token budget

This operator burns tokens fast: 150+ tools sit in context and autonomous runs go many turns. Keep it lean.

- **Trim the MCP tool surface.** Every loaded HexStrike tool eats context on every call. Enable only the categories the demo needs (e.g. network + web recon) rather than the full arsenal.
- **Leave context headroom.** Don't let the window fill. Keep spare room so compaction kicks in cleanly and the agent stays stable — lean on OpenCode's auto-compaction (it summarizes older turns) instead of dragging full history.
- **Caveman prompting.** Talk to the agent in terse, keyword prompts — drop articles and filler. `scan target, enumerate web, report findings` beats a full paragraph. Same intent, fewer input tokens.
- **Tier your models.** Cheaper/smaller model for routine steps; save the strong model for reasoning-heavy exploitation. Switch mid-session if your provider allows.
- **Let subagents isolate context.** Aegis-X subagents carry their own context, so heavy enumeration output stays out of the main thread and the primary window stays small.

---

## ✅ Pre-workshop checklist

- [ ] Virtualization enabled in BIOS/UEFI
- [ ] VirtualBox / VMware installed
- [ ] Kali VM created, updated, has internet
- [ ] `git`, `python3`, `python3-venv`, `nmap` present
- [ ] OpenCode installed (`opencode --version` works)
- [ ] Provider key added (`opencode auth login`) — OpenRouter credit added if using it
- [ ] HexStrike cloned, deps installed, `hexstrike_server.py` runs, `/health` OK
- [ ] HexStrike MCP added to `opencode.json` (correct V1/V2 format, real path)
- [ ] OpenCode sees the HexStrike tools (Step 8 sanity prompt works)
- [ ] HTB and/or THM account created, login confirmed
- [ ] OpenVPN connects and a spawned target is reachable
- [ ] Trimmed HexStrike to the tool categories you need (token budget)

**All ticked? You're ready. See you at the summit.**

---

## Troubleshooting

**MCP tools don't appear in OpenCode**
- Is `hexstrike_server.py` still running? Check: `netstat -tlnp | grep 8888`
- Is the path to `hexstrike_mcp.py` absolute and correct in `opencode.json`?
- Wrong config format for your version — recheck V1 vs V2 (Step 7).

**`/health` fails / server won't start**
- Re-activate the venv: `source hexstrike-env/bin/activate`
- Reinstall deps: `pip3 install -r requirements.txt`
- Port busy: start on another port `python3 hexstrike_server.py --port 8888` and match it in the MCP `--server` arg.

**A tool errors as "not found"**
- That tool isn't installed in Kali; install it or let the agent use alternatives. HexStrike skips unavailable tools.

**Agent stalls / rate-limit errors**
- You're on a throttled free model. Switch to OpenRouter with credit (Step 5).

**VPN connects but target unreachable**
- Make sure the machine is **spawned/active** on the platform first, then ping.
- Corp network blocking OpenVPN → personal hotspot.
