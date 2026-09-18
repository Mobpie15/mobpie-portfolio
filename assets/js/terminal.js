/**
 * Mobpie Interactive Developer Terminal
 * Provides interactive command line simulations with quick chips and typed outputs.
 */

(function() {
  const terminalOutput = document.getElementById('term-output');
  const terminalInput = document.getElementById('term-input');
  const terminalForm = document.getElementById('term-form');
  const chips = document.querySelectorAll('.term-chip');

  if (!terminalOutput || !terminalInput) return;

  const COMMANDS = {
    'help': `AVAILABLE COMMANDS:
  services     - View the 4 core web engineering deliverables
  audit        - See real speed comparison data (Slow vs Mobpie)
  stack        - Inspect technical tools & edge infrastructure
  about        - Who is Mobpie & why solo dev > agencies
  contact      - Get direct WhatsApp, Instagram, and email links
  clear        - Clear the terminal screen`,

    'services': `CORE DELIVERABLES:
  [01] CUSTOM WEBSITES FROM ZERO -> Next.js + Tailwind + Headless Shopify. Zero generic templates.
  [02] SPEED UP SLOW WEBSITES    -> Stripping app bloat, optimizing assets, sub-0.5s page loads.
  [03] 3D & INTERACTIVE WEBGL    -> Three.js kinetic logos & 3D product viewports.
  [04] 1-TAP MOBILE CHECKOUT     -> Instant slideout cart drawers with frictionless UPI.`,

    'audit': `PERFORMANCE AUDIT RESULTS:
  - Slow Off-The-Shelf Template: 5.4s Mobile FCP | 28 Heavy Scripts | 42% Visitor Drop-off.
  - Mobpie Custom Edge Build:    0.32s Mobile FCP | 0 Bloat Scripts | 99/100 Google Score.
  CONCLUSION: Sub-second load speed retains up to 40% more paying customers.`,

    'stack': `PRODUCTION ENGINE:
  Frontend:   Next.js 14, React, Tailwind CSS, Three.js (WebGL)
  Backend:    Node.js, Python/FastAPI, PostgreSQL, Supabase, REST/GraphQL APIs
  Animation:  Framer Motion, Web Audio API, Canvas 2D
  Deploy:     Global Edge CDN (Sub-20ms TTFB worldwide)`,

    'about': `MOBPIE // SOLO STOREFRONT ARCHITECT
  - Location: India (Engineering Worldwide)
  - Model:    1-on-1 Direct Collaboration (No Account Managers, No Interns)
  - Speed:    10 - 14 Day Delivery Sprints
  - Mission:  Making brand websites that load instantly and look world-class.`,

    'contact': `DIRECT CHANNELS:
  - WhatsApp:  +91 89574 20306 (Click the WhatsApp button on top to chat)
  - Instagram: @mobpie_dev
  - Email:     mobpiexd@gmail.com
  STATUS: Accepting sprints for this month.`
  };

  function printLine(text, isCommand = false) {
    const line = document.createElement('div');
    line.className = isCommand ? 'term-line term-cmd-line' : 'term-line term-response-line';
    line.textContent = text;
    terminalOutput.appendChild(line);
    terminalOutput.scrollTop = terminalOutput.scrollHeight;
  }

  function handleCommand(cmd) {
    const trimmed = cmd.trim().toLowerCase();
    printLine(`mobpie@edge:~$ ${cmd}`, true);

    if (trimmed === 'clear') {
      terminalOutput.innerHTML = '';
      return;
    }

    if (COMMANDS[trimmed]) {
      const output = COMMANDS[trimmed];
      printLine(output, false);
    } else if (trimmed === '') {
      // Empty enter
    } else {
      printLine(`Command not recognized: '${trimmed}'. Type 'help' for available commands.`, false);
    }
  }

  if (terminalForm) {
    terminalForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = terminalInput.value;
      if (val) {
        handleCommand(val);
        terminalInput.value = '';
      }
    });
  }

  chips.forEach(chip => {
    chip.addEventListener('click', () => {
      const cmd = chip.getAttribute('data-cmd');
      if (cmd) {
        handleCommand(cmd);
      }
    });
  });

  // Initial welcome message
  printLine("System initialized. Mobpie Edge Kernel v2.6 active.");
  printLine("Type a command below or click a chip above (try 'services' or 'audit'):");
})();
