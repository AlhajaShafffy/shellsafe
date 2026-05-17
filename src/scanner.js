#!/usr/bin/env node
// 🛡️ shellsafe — Bash Script Security Scanner

const fs   = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const GREEN  = '\x1b[32m'; const RED    = '\x1b[31m';
const YELLOW = '\x1b[33m'; const CYAN   = '\x1b[36m';
const BOLD   = '\x1b[1m';  const DIM    = '\x1b[2m';
const NC     = '\x1b[0m';

// Security rules
const RULES = [
  { id: 'S001', level: 'CRITICAL', pattern: /\beval\b/,                      msg: 'eval usage — command injection risk' },
  { id: 'S002', level: 'CRITICAL', pattern: /curl\s+.*\|\s*(ba)?sh/,         msg: 'curl | bash — arbitrary code execution' },
  { id: 'S003', level: 'CRITICAL', pattern: /wget\s+.*\|\s*(ba)?sh/,         msg: 'wget | bash — arbitrary code execution' },
  { id: 'S004', level: 'WARNING',  pattern: /rm\s+-rf\s+\$\w+/,              msg: 'rm -rf with unquoted variable' },
  { id: 'S005', level: 'WARNING',  pattern: /chmod\s+777/,                   msg: 'chmod 777 — world-writable permissions' },
  { id: 'S006', level: 'WARNING',  pattern: /password\s*=\s*['"][^'"]+['"]/i,msg: 'Hardcoded password detected' },
  { id: 'S007', level: 'WARNING',  pattern: /api[_-]?key\s*=\s*['"][^'"]+['"]/i, msg: 'Hardcoded API key detected' },
  { id: 'S008', level: 'INFO',     pattern: /^\[[ \t]/m,                     msg: 'Use [[ ]] instead of [ ] for safety' },
  { id: 'S009', level: 'INFO',     pattern: /^(?!.*set\s+-e)/,               msg: 'Missing set -e at script top' },
  { id: 'S010', level: 'WARNING',  pattern: /sudo\s+rm/,                     msg: 'sudo rm — high-risk deletion' },
];

function scanFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf8');
  const lines   = content.split('\n');
  const issues  = [];

  RULES.forEach(rule => {
    lines.forEach((line, i) => {
      if (rule.pattern.test(line)) {
        issues.push({ line: i + 1, ...rule, text: line.trim() });
      }
    });
  });

  return issues;
}

function levelColor(level) {
  return level === 'CRITICAL' ? RED : level === 'WARNING' ? YELLOW : DIM;
}
function levelIcon(level) {
  return level === 'CRITICAL' ? '❌' : level === 'WARNING' ? '⚠️ ' : 'ℹ️ ';
}

function scanPath(target) {
  const isDir = fs.statSync(target).isDirectory();
  const files = isDir
    ? execSync(`find "${target}" -name "*.sh" -type f`, { encoding: 'utf8' }).trim().split('\n').filter(Boolean)
    : [target];

  let totalCritical = 0, totalWarning = 0, totalInfo = 0;

  files.forEach(file => {
    if (!fs.existsSync(file)) return;
    const issues = scanFile(file);
    if (!issues.length) {
      console.log(`${GREEN}✅ ${file} — Clean${NC}`);
      return;
    }
    console.log(`\n${CYAN}${BOLD}🛡️  ${file}${NC}`);
    console.log('─'.repeat(65));
    issues.forEach(({ line, level, msg, text }) => {
      const c = levelColor(level);
      console.log(`${c}${levelIcon(level)} ${level.padEnd(8)}${NC}  Line ${String(line).padStart(3)}: ${msg}`);
      console.log(`           ${DIM}${text.slice(0, 60)}${NC}`);
      if (level === 'CRITICAL') totalCritical++;
      else if (level === 'WARNING') totalWarning++;
      else totalInfo++;
    });
  });

  console.log('\n' + '─'.repeat(65));
  console.log(`${BOLD}Summary:${NC} ${RED}${totalCritical} critical${NC}  ${YELLOW}${totalWarning} warnings${NC}  ${DIM}${totalInfo} info${NC}\n`);
  if (totalCritical > 0) process.exit(1);
}

const target = process.argv[2] || '.';
console.log(`\n${CYAN}${BOLD}🛡️  shellsafe — Security Scanner${NC}\n`);

if (!fs.existsSync(target)) {
  console.error(`❌ Path not found: ${target}`); process.exit(1);
}
scanPath(target);
