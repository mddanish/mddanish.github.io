/* =====================================================
   MOHAMMED DANISH AMBER — Cybersecurity Portfolio
   Interactive App Logic: Canvas, Terminal Simulator, Counters
   ===================================================== */

(function () {
  'use strict';

  /* -------------------------------------------------------
     1. CYBER PARTICLE CANVAS BACKDROP
  ------------------------------------------------------- */
  const canvas = document.getElementById('cyber-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let W, H, nodes = [], mouse = { x: -9999, y: -9999 };

    const NODE_COUNT = 70;
    const MAX_DIST    = 130;
    const NODE_SPEED  = 0.3;
    const NODE_RADIUS = 1.6;
    const LINE_COLOR  = '255, 31, 31';
    const NODE_COLOR  = '255, 60, 60';

    function resize() {
      W = canvas.width  = window.innerWidth;
      H = canvas.height = window.innerHeight;
    }

    function createNode() {
      return {
        x: Math.random() * W,
        y: Math.random() * H,
        vx: (Math.random() - 0.5) * NODE_SPEED,
        vy: (Math.random() - 0.5) * NODE_SPEED,
        r: Math.random() * NODE_RADIUS + 0.6,
      };
    }

    function initNodes() {
      nodes = [];
      for (let i = 0; i < NODE_COUNT; i++) nodes.push(createNode());
    }

    function drawFrame() {
      ctx.clearRect(0, 0, W, H);

      // Update positions & draw connections
      nodes.forEach(n => {
        n.x += n.vx;
        n.y += n.vy;
        if (n.x < 0 || n.x > W) n.vx *= -1;
        if (n.y < 0 || n.y > H) n.vy *= -1;

        // Mouse repulsion
        const dx = n.x - mouse.x;
        const dy = n.y - mouse.y;
        const d  = Math.sqrt(dx * dx + dy * dy);
        if (d < 110) {
          n.vx += (dx / d) * 0.3;
          n.vy += (dy / d) * 0.3;
        }

        // Speed limit
        const speed = Math.sqrt(n.vx * n.vx + n.vy * n.vy);
        if (speed > NODE_SPEED * 2.5) {
          n.vx = (n.vx / speed) * NODE_SPEED * 2.5;
          n.vy = (n.vy / speed) * NODE_SPEED * 2.5;
        }
      });

      // Draw lines
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.25;
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = `rgba(${LINE_COLOR}, ${alpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      // Draw nodes
      nodes.forEach(n => {
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${NODE_COLOR}, 0.65)`;
        ctx.fill();
      });

      requestAnimationFrame(drawFrame);
    }

    window.addEventListener('resize', () => { resize(); initNodes(); });
    window.addEventListener('mousemove', e => { mouse.x = e.clientX; mouse.y = e.clientY; });
    window.addEventListener('touchmove', e => {
      mouse.x = e.touches[0].clientX;
      mouse.y = e.touches[0].clientY;
    }, { passive: true });

    resize();
    initNodes();
    drawFrame();
  }

  /* -------------------------------------------------------
     2. NAVIGATION — SCROLL STATE + ACTIVE LINKS + MOBILE MENU
  ------------------------------------------------------- */
  const nav = document.querySelector('.nav');
  const hamburger = document.querySelector('.nav-hamburger');
  const mobileMenu = document.querySelector('.nav-mobile-menu');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 40);
    });
  }

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('open');
      mobileMenu.classList.toggle('open');
    });
  }

  // Highlight active nav link on scroll
  const sections = document.querySelectorAll('section, header');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    sections.forEach(sec => {
      const top = sec.offsetTop - 120;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        current = sec.getAttribute('id') || '';
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href');
      if (href && href === `#${current}`) {
        link.classList.add('active');
      }
    });
  });

  /* -------------------------------------------------------
     3. SCROLL REVEAL — INTERSECTION OBSERVER
  ------------------------------------------------------- */
  const observerOpts = { threshold: 0.1 };

  const revealObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, observerOpts);

  document.querySelectorAll('.fade-up').forEach(el => revealObserver.observe(el));

  /* -------------------------------------------------------
     4. ANIMATED STAT COUNTERS
  ------------------------------------------------------- */
  function animateCounter(el) {
    const target = parseFloat(el.dataset.target || el.textContent.replace(/\D/g, ''));
    const suffix = el.dataset.suffix || '';
    const prefix = el.dataset.prefix || '';
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3); // ease-out cubic
      const current = target * eased;

      el.textContent = prefix + (Number.isInteger(target)
        ? Math.round(current)
        : current.toFixed(0)) + suffix;

      if (progress < 1) requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
  }

  const counterObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('[data-counter]').forEach(el => counterObserver.observe(el));

  /* -------------------------------------------------------
     5. HERO PROFILE DASHBOARD LOADER
  ------------------------------------------------------- */
  function initDashboard() {
    const scoreEl = document.querySelector('.bas-score-number');
    const ring = document.querySelector('.score-ring-fill');
    if (!scoreEl) return;

    let val = 0;
    const target = 98; // Security profile posture score

    const t = setInterval(() => {
      val++;
      scoreEl.textContent = val + '%';
      if (ring) {
        const pct = (val / 100) * 251.2; // 2 * PI * r = 251.2
        ring.style.strokeDashoffset = 251.2 - pct;
      }
      if (val >= target) clearInterval(t);
    }, 15);

    // Populate active findings/threat levels
    const vulnEl = document.getElementById('dash-vulns');
    if (vulnEl) {
      let vVal = 0;
      const vTarget = 14; // years of experience represented as critical attack pathways neutralized
      const vt = setInterval(() => {
        vVal++;
        vulnEl.textContent = vVal;
        if (vVal >= vTarget) clearInterval(vt);
      }, 70);
    }
  }

  const dashEl = document.querySelector('.bas-dashboard');
  if (dashEl) {
    const dashObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        initDashboard();
        dashObserver.disconnect();
      }
    }, { threshold: 0.3 });
    dashObserver.observe(dashEl);
  }

  /* -------------------------------------------------------
     6. CYBER COMMAND TERMINAL SKILLS SIMULATOR
  ------------------------------------------------------- */
  const skillsData = {
    hacking: `
<div class="term-output">> EXTRACTING OFFENSIVE SECURITY CAPABILITIES...</div>
<div class="term-output">---------------------------------------------------------</div>
<div class="term-grid">
  <div class="term-item">
    <span class="term-item-title">Red Teaming & Adversary Emulation</span>
    <span class="term-item-desc">Executing full-scope attack cycles modeling APT techniques and MITRE ATT&CK frameworks.</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">Vulnerability Assessment & Pen Testing</span>
    <span class="term-item-desc">Manual and automated testing of Web, API, Mobile, Thick Client, and Infrastructure architectures.</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">Breach & Attack Simulation (BAS)</span>
    <span class="term-item-desc">Designing, executing, and automating adversarial scenarios to validate EDR, SIEM, and SOC rules.</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">Threat Hunting & Intelligence</span>
    <span class="term-item-desc">Conducting active OSINT research, discovering indicators of compromise (IOCs), and analyzing logs.</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">Malware Analysis & Payload Design</span>
    <span class="term-item-desc">Static and dynamic analysis of malicious binaries, payload design, and sandbox evasion testing.</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">Secure Code Review</span>
    <span class="term-item-desc">Reviewing application source code manually and implementing SAST/DAST automation tools.</span>
  </div>
</div>
<div class="term-output">> SUCCESS: 6 ADVERSARIAL DOMAINS VALIDATED.</div>
    `,
    tools: `
<div class="term-output">> ENUMERATING PREFERRED ARMAMENT & TOOLKITS...</div>
<div class="term-output">---------------------------------------------------------</div>
<div class="term-grid">
  <div class="term-item">
    <span class="term-item-title">Exploitation Frameworks</span>
    <span class="term-item-desc">Metasploit, Burp Suite Professional, BeEF, Meterpreter, Cobalt Strike.</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">Reconnaissance & OSINT</span>
    <span class="term-item-desc">Nmap, Maltego, Shodan, Subfinder, Dirbuster, Wireshark, ZAP Proxy.</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">Vulnerability Scanners</span>
    <span class="term-item-desc">Qualys Guard, Nessus Pro/Home, Accunetix Web Scanner, Nexpose.</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">Enterprise Risk Posture</span>
    <span class="term-item-desc">Tenable.IO, Tenable Lumin, ThreatConnect SIEM integration.</span>
  </div>
</div>
<div class="term-output">> SUCCESS: ALL TARGET UTILITIES CONFIGURED AND READY.</div>
    `,
    sysops: `
<div class="term-output">> INITIATING OS & PLATFORM METRICS AUDIT...</div>
<div class="term-output">---------------------------------------------------------</div>
<div class="term-grid">
  <div class="term-item">
    <span class="term-item-title">Security & Pentest OS</span>
    <span class="term-item-desc">Kali Linux, Backtrack, Parrot OS, Blackbox Security, Cyberhawk.</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">Enterprise Platforms</span>
    <span class="term-item-desc">Red Hat Enterprise Linux (RHCE), Ubuntu Server, UNIX, macOS, Windows Server.</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">Virtualization & Cloud</span>
    <span class="term-item-desc">Proxmox VE, Ubuntu MicroCloud, Cloud Security Alliance (CCSK), AWS, Azure Cloud Controls.</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">DevSecOps & Orchestration</span>
    <span class="term-item-desc">Docker Containers, Kubernetes (K8s), Red Hat OpenShift, CI/CD secure pipeline builds.</span>
  </div>
</div>
<div class="term-output">> SUCCESS: INFRASTRUCTURE CONTROLS VERIFIED.</div>
    `,
    languages: `
<div class="term-output">> RETRIEVING INTERPRETER AND COMPILER METADATA...</div>
<div class="term-output">---------------------------------------------------------</div>
<div class="term-grid">
  <div class="term-item">
    <span class="term-item-title">Scripting & Automation</span>
    <span class="term-item-desc">Python (exploit creation), Bash/Shell scripting, Perl (legacy system utilities).</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">Web & Application Logic</span>
    <span class="term-item-desc">PHP (backend architectures), NodeJS (modern API layers), HTML, CSS, Javascript.</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">Systems & Database</span>
    <span class="term-item-desc">C/C++ (low-level drivers & payloads), SQL (database architectures, MariaDB, MySQL, MongoDB).</span>
  </div>
  <div class="term-item">
    <span class="term-item-title">Legacy Enterprise Hardskills</span>
    <span class="term-item-desc">Visual Basic, Java, .NET application code assessment.</span>
  </div>
</div>
<div class="term-output">> SUCCESS: ALL SOURCE COMPILING LAYERS STABLE.</div>
    `
  };

  const terminalBody = document.getElementById('terminal-text');
  const typingCommand = document.getElementById('terminal-command');
  const tabs = document.querySelectorAll('.term-tab');
  let currentActiveTab = 'hacking';
  let isTyping = false;

  function runTerminalCommand(commandKey) {
    if (isTyping) return;
    isTyping = true;

    // Set tab active state
    tabs.forEach(tab => {
      tab.classList.toggle('active', tab.dataset.cmd === commandKey);
    });

    const commandStr = `show_${commandKey}`;
    typingCommand.textContent = '';
    
    // Simulate typing
    let charIdx = 0;
    const typingInterval = setInterval(() => {
      typingCommand.textContent += commandStr[charIdx];
      charIdx++;
      if (charIdx >= commandStr.length) {
        clearInterval(typingInterval);
        
        // Brief loading pause
        setTimeout(() => {
          // Output the content
          if (skillsData[commandKey]) {
            terminalBody.innerHTML = skillsData[commandKey];
          } else {
            terminalBody.innerHTML = `<div class="term-output-error">> ERROR: COMMAND NOT RECOGNIZED. TRY 'show_hacking' OR 'help'.</div>`;
          }
          // Reset input line
          typingCommand.textContent = '';
          isTyping = false;
        }, 300);
      }
    }, 45);
  }

  // Set event listeners for tabs
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const cmdKey = tab.dataset.cmd;
      if (cmdKey && cmdKey !== currentActiveTab) {
        currentActiveTab = cmdKey;
        runTerminalCommand(cmdKey);
      }
    });
  });

  // Run default tab on load when terminal is in viewport
  const terminalEl = document.querySelector('.terminal-widget');
  if (terminalEl) {
    const termObserver = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setTimeout(() => {
          runTerminalCommand('hacking');
        }, 300);
        termObserver.disconnect();
      }
    }, { threshold: 0.3 });
    termObserver.observe(terminalEl);
  }

  /* -------------------------------------------------------
     7. CONTACT FORM TRANSMISSION ANIMATION
  ------------------------------------------------------- */
  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', e => {
      e.preventDefault();
      const btn = contactForm.querySelector('button[type="submit"]');
      const successEl = document.getElementById('form-success');
      const originalText = btn.textContent;

      btn.disabled = true;
      btn.textContent = 'Transmitting Encrypted SSH packets...';
      btn.style.borderColor = 'var(--core-red)';
      btn.style.boxShadow = 'var(--shadow-red)';

      setTimeout(() => {
        btn.textContent = '✓ Packet Transmission Complete';
        btn.style.background = '#10b981';
        btn.style.borderColor = '#10b981';
        btn.style.boxShadow = '0 0 15px rgba(16,185,129,0.4)';
        
        if (successEl) {
          successEl.style.display = 'block';
          successEl.textContent = '✓ Secure Connection Form Established. Message Encrypted and Sent to Danish Amber.';
        }

        setTimeout(() => {
          btn.disabled = false;
          btn.textContent = originalText;
          btn.style.background = '';
          btn.style.borderColor = '';
          btn.style.boxShadow = '';
          contactForm.reset();
          if (successEl) successEl.style.display = 'none';
        }, 4000);
      }, 1600);
    });
  }

  /* -------------------------------------------------------
     8. SMOOTH ANCHOR SCROLLING
  ------------------------------------------------------- */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu if open
        if (mobileMenu && mobileMenu.classList.contains('open')) {
          mobileMenu.classList.remove('open');
          hamburger && hamburger.classList.remove('open');
        }
      }
    });
  });

  /* -------------------------------------------------------
     9. GLITCH EFFECT AUTOMATION
  ------------------------------------------------------- */
  document.querySelectorAll('[data-glitch]').forEach(el => {
    el.setAttribute('data-text', el.textContent);
    el.classList.add('glitch');
  });

  /* -------------------------------------------------------
     10. PROGRESS BAR STAMP FILL (TIMELINE AND OTHER SCANNERS)
  ------------------------------------------------------- */
  const progressObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const fill = entry.target.querySelector('.progress-bar-fill');
        if (fill) {
          fill.style.width = fill.dataset.width || '85%';
        }
        progressObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.progress-bar-track').forEach(el => progressObserver.observe(el));

})();
