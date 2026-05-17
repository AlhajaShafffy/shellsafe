# 🛡️ shellsafe

> A bash script linter and security checker that flags dangerous patterns like unquoted variables and eval usage.

[![CI](https://img.shields.io/github/actions/workflow/status/yourusername/shellsafe/ci.yml?style=for-the-badge)](https://github.com/yourusername/shellsafe/actions)
[![License](https://img.shields.io/badge/license-MIT-blue?style=for-the-badge)](./LICENSE)
[![Codespace Ready](https://img.shields.io/badge/Codespace-Ready-green?style=for-the-badge&logo=github)](https://codespaces.new/yourusername/shellsafe)

---

## 🚀 What is shellsafe?

`shellsafe` scans bash scripts for dangerous patterns, security vulnerabilities, and common mistakes. It goes beyond `shellcheck` to add security-focused rules around injection risks, privilege escalation, and insecure practices.

```bash
# Scan a single script
shellsafe scan deploy.sh

# Scan all scripts in a directory
shellsafe scan scripts/

# Scan with security focus only
shellsafe scan . --mode security

# Auto-fix safe issues
shellsafe scan . --fix
```

---

## ✨ What shellsafe Catches

| Category | Example Issues |
|----------|---------------|
| 🔒 Security | `eval` usage, `curl \| bash`, unvalidated input |
| 🐛 Bugs | Unquoted variables, missing `set -e`, `[ ]` vs `[[ ]]` |
| 💉 Injection | Command injection via `$var` in exec contexts |
| 🔑 Secrets | Hardcoded passwords, API keys in scripts |
| ⚠️ Privilege | Unnecessary `sudo`, world-writable files |
| 📦 Portability | Bashisms in `#!/bin/sh` scripts |

---

## 📋 Sample Output

```
shellsafe scan deploy.sh
────────────────────────────────────────────
❌ CRITICAL  Line 12: eval "$user_input" — command injection risk
⚠️  WARNING   Line 24: Unquoted variable $FILE in rm command
⚠️  WARNING   Line 31: curl | bash — arbitrary code execution
ℹ️  INFO      Line 5: Missing set -e at script top
ℹ️  INFO      Line 8: Use [[ ]] instead of [ ] for safety

Summary: 1 critical, 2 warnings, 2 info
```

---

## 🏆 GitHub Achievement Scripts

```bash
bash scripts/setup.sh
bash scripts/unlock-all.sh
bash scripts/quickdraw.sh
bash scripts/yolo.sh
bash scripts/publicist.sh
bash scripts/pull-shark.sh 2
bash scripts/pair-extraordinaire.sh "Name" "email@example.com"
node src/achievement-tracker.js
```

---

## 🤝 Contributing
See [CONTRIBUTING.md](./CONTRIBUTING.md)
