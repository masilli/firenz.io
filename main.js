document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. High-Performance Particle Canvas Grid
  // ==========================================
  const canvas = document.getElementById('matrix-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.clientWidth;
    let height = canvas.clientHeight;
    let dpi = window.devicePixelRatio || 1;
    
    // Set canvas dimensions with high-DPI scaling
    const resizeCanvas = () => {
      width = canvas.parentElement.clientWidth;
      height = canvas.parentElement.clientHeight;
      canvas.width = width * dpi;
      canvas.height = height * dpi;
      ctx.scale(dpi, dpi);
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    // Grid parameters
    const spacing = 40; // spacing between dots in grid
    let mouse = { x: -1000, y: -1000, targetX: -1000, targetY: -1000, active: false };
    
    // Track mouse coordinates over the visual cell container
    const container = document.getElementById('canvas-container');
    container.addEventListener('mousemove', (e) => {
      const rect = container.getBoundingClientRect();
      mouse.targetX = e.clientX - rect.left;
      mouse.targetY = e.clientY - rect.top;
      mouse.active = true;
    });
    
    container.addEventListener('mouseleave', () => {
      mouse.targetX = -1000;
      mouse.targetY = -1000;
      mouse.active = false;
    });
    
    // Smooth mouse position updates (lerping)
    const lerpMouse = () => {
      if (mouse.x === -1000) {
        mouse.x = mouse.targetX;
        mouse.y = mouse.targetY;
      } else {
        mouse.x += (mouse.targetX - mouse.x) * 0.15;
        mouse.y += (mouse.targetY - mouse.y) * 0.15;
      }
    };
    
    // Draw loop
    const draw = () => {
      ctx.clearRect(0, 0, width, height);
      lerpMouse();
      
      const cols = Math.floor(width / spacing) + 1;
      const rows = Math.floor(height / spacing) + 1;
      
      const startX = (width - (cols - 1) * spacing) / 2;
      const startY = (height - (rows - 1) * spacing) / 2;
      
      let nearestNode = null;
      let minDistance = Infinity;
      
      // First pass: Calculate positions and find nearest node
      for (let c = 0; c < cols; c++) {
        for (let r = 0; r < rows; r++) {
          const baseX = startX + c * spacing;
          const baseY = startY + r * spacing;
          
          let dx = mouse.x - baseX;
          let dy = mouse.y - baseY;
          let dist = Math.sqrt(dx * dx + dy * dy);
          
          // Repulsion factor
          const maxDist = 120;
          let shiftX = 0;
          let shiftY = 0;
          let brightness = 0.1;
          
          if (dist < maxDist) {
            const force = (maxDist - dist) / maxDist; // 0 to 1
            // Pushing the node away from mouse
            shiftX = -(dx / dist) * force * 15;
            shiftY = -(dy / dist) * force * 15;
            brightness = 0.1 + force * 0.8;
          }
          
          const x = baseX + shiftX;
          const y = baseY + shiftY;
          
          // Draw connecting gridlines to adjacent nodes with fade
          if (dist < 150) {
            ctx.strokeStyle = `rgba(0, 255, 210, ${ (150 - dist)/150 * 0.08 })`;
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
          
          // Find nearest node for visual HUD telemetry
          if (dist < minDistance && mouse.active) {
            minDistance = dist;
            nearestNode = { x, y, c, r, dist };
          }
          
          // Draw standard engineering crosshair or dot
          if (brightness > 0.3) {
            ctx.fillStyle = `rgba(0, 255, 210, ${brightness})`;
            // Draw a small '+' crosshair
            ctx.fillRect(x - 3, y, 7, 1);
            ctx.fillRect(x, y - 3, 1, 7);
          } else {
            ctx.fillStyle = 'rgba(255, 255, 255, 0.15)';
            ctx.fillRect(x - 1, y - 1, 2, 2);
          }
        }
      }
      
      // HUD telemetry detail overlay next to the mouse cursor
      if (nearestNode && nearestNode.dist < 100) {
        ctx.fillStyle = 'rgba(0, 255, 210, 0.7)';
        ctx.font = '9px "JetBrains Mono", monospace';
        
        const text = `NODE_${nearestNode.c}_${nearestNode.r} [x: ${Math.round(nearestNode.x)}, y: ${Math.round(nearestNode.y)}]`;
        ctx.fillText(text, nearestNode.x + 12, nearestNode.y + 4);
        
        ctx.strokeStyle = 'rgba(0, 255, 210, 0.2)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.arc(nearestNode.x, nearestNode.y, 8, 0, Math.PI * 2);
        ctx.stroke();
      }
      
      requestAnimationFrame(draw);
    };
    
    // Start canvas loop
    requestAnimationFrame(draw);
  }
  
  // ==========================================
  // 2. Simulated Terminal Console Logger
  // ==========================================
  const terminal = document.getElementById('terminal-output');
  if (terminal) {
    const logs = [
      { text: 'Loading compilation libraries...', type: 'sys' },
      { text: 'Target architectures defined: wasm32, arm64, x86_64', type: 'sys' },
      { text: 'Orchestrator boot triggered.', type: 'sys' },
      { text: 'Checking connection mesh tunnels...', type: 'net' },
      { text: 'Connected to node core: milan-edge-01 (latency: 1.8ms)', type: 'net' },
      { text: 'Connected to node core: florence-edge-03 (latency: 0.4ms)', type: 'net' },
      { text: 'Connected to node core: london-edge-12 (latency: 9.2ms)', type: 'net' },
      { text: 'Hot module optimization enabled. Watch mode active.', type: 'sys' },
      { text: 'Executing kernel benchmarks...', type: 'bench' },
      { text: 'COLD BOOT COMPLETED IN 3.84ms // HEAP ALLOCATIONS: 0 bytes', type: 'bench' },
      { text: 'Telemetry server listening on port 9024...', type: 'sys' },
      { text: 'MESH SYNC: Updated key "routing_matrix" globally in 0.82ms', type: 'bench' },
      { text: 'Incoming request routed to sub-cluster arm64: 200 OK', type: 'sys' },
      { text: 'CPU load: 1.2% // Memory footprint: 12.4 MB', type: 'bench' }
    ];
    
    let index = 0;
    
    const appendLogLine = (logText, type = 'sys') => {
      const line = document.createElement('div');
      line.className = 'terminal-line';
      
      const prompt = document.createElement('span');
      prompt.className = 'terminal-prompt';
      
      // Different prompt prefixes based on log type
      if (type === 'bench') {
        prompt.textContent = '[PERF]';
        prompt.style.color = '#a855f7'; // purple
      } else if (type === 'net') {
        prompt.textContent = '[MESH]';
        prompt.style.color = '#3b82f6'; // blue
      } else {
        prompt.textContent = '[CORE]';
      }
      
      const content = document.createElement('span');
      content.textContent = logText;
      
      line.appendChild(prompt);
      line.appendChild(content);
      
      terminal.appendChild(line);
      terminal.scrollTop = terminal.scrollHeight;
      
      // Limit lines in console
      if (terminal.childElementCount > 40) {
        terminal.removeChild(terminal.firstElementChild);
      }
    };
    
    // Seed initial console output
    for (let i = 0; i < 6; i++) {
      appendLogLine(logs[index].text, logs[index].type);
      index = (index + 1) % logs.length;
    }
    
    // Cycle additional logs
    setInterval(() => {
      appendLogLine(logs[index].text, logs[index].type);
      index = (index + 1) % logs.length;
    }, 2800);
  }
  
  // ==========================================
  // 3. Waitlist Invitation Form Telemetry Feedback
  // ==========================================
  const form = document.getElementById('waitlist-form');
  const msgContainer = document.getElementById('waitlist-msg');
  const submitBtn = document.getElementById('btn-request');
  const emailInput = document.getElementById('waitlist-email');
  
  if (form && msgContainer) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = emailInput.value;
      submitBtn.disabled = true;
      emailInput.disabled = true;
      
      let step = 0;
      const feedbackSteps = [
        `[WAIT] RESOLVING NODE SHELL FOR '${email}'...`,
        '[WAIT] VALIDATING ACCESS TOKEN SCHEMA...',
        '[OK] CRYPTOGRAPHIC SIGNATURE GENERATED.',
        `[DONE] INVITE REQUEST REGISTERED FOR RING_0: ${email}`
      ];
      
      msgContainer.style.color = 'var(--text-dim)';
      msgContainer.textContent = feedbackSteps[step];
      
      const interval = setInterval(() => {
        step++;
        if (step < feedbackSteps.length) {
          msgContainer.textContent = feedbackSteps[step];
          if (step === feedbackSteps.length - 1) {
            msgContainer.style.color = 'var(--accent-cyan)';
          }
        } else {
          clearInterval(interval);
        }
      }, 900);
    });
  }
});
