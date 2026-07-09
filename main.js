document.addEventListener('DOMContentLoaded', () => {
  // 1. Header scroll effect
  const header = document.querySelector('header');
  const checkScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', checkScroll);
  checkScroll(); // Initial check

  // 2. Mobile navigation toggle
  const navToggle = document.querySelector('.nav-toggle');
  const navLinks = document.querySelector('.nav-links');
  const navItems = document.querySelectorAll('.nav-links a');

  if (navToggle && navLinks) {
    navToggle.addEventListener('click', () => {
      navToggle.classList.toggle('open');
      navLinks.classList.toggle('open');
      document.body.classList.toggle('overflow-hidden');
    });

    navItems.forEach(item => {
      item.addEventListener('click', () => {
        navToggle.classList.remove('open');
        navLinks.classList.remove('open');
        document.body.classList.remove('overflow-hidden');
      });
    });
  }

  // 3. Active nav link highlighter based on scroll position
  const sections = document.querySelectorAll('section, .hero');
  const navLinksList = document.querySelectorAll('.nav-links a');

  const onScroll = () => {
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (window.scrollY >= sectionTop - 150) {
        current = section.getAttribute('id') || '';
      }
    });

    navLinksList.forEach(link => {
      link.classList.remove('active');
      const href = link.getAttribute('href').substring(1);
      if (href === current) {
        link.classList.add('active');
      }
    });
  };
  window.addEventListener('scroll', onScroll);
  onScroll();

  // 4. Reveal elements on scroll (Intersection Observer)
  const revealElements = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('active');
        // Unobserve once shown
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
  });

  revealElements.forEach(element => {
    revealObserver.observe(element);
  });

  // 5. Interactive Glass Card Mouse Glow Effect & Parallax Sphere
  const visualSphere = document.querySelector('.visual-sphere');
  const heroVisual = document.querySelector('.hero-visual');

  if (heroVisual && visualSphere) {
    heroVisual.addEventListener('mousemove', (e) => {
      const rect = heroVisual.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      
      // Gentle parallax effect on the sphere
      visualSphere.style.transform = `translate(${x * 0.05}px, ${y * 0.05}px) scale(1.02)`;
    });

    heroVisual.addEventListener('mouseleave', () => {
      visualSphere.style.transform = 'translate(0, 0) scale(1)';
      visualSphere.style.transition = 'transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
    });
    
    heroVisual.addEventListener('mouseenter', () => {
      visualSphere.style.transition = 'none';
    });
  }

  // 6. Dynamic Card Mouse Follower Glow (Interactive cards)
  const glassCards = document.querySelectorAll('.glass-card, .work-card');
  glassCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      // Update custom properties for glow coordinate tracking (can be used in CSS if desired)
      card.style.setProperty('--mouse-x', `${x}px`);
      card.style.setProperty('--mouse-y', `${y}px`);
    });
  });

  // 7. Contact Form Simulation
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      const originalText = submitBtn.innerHTML;
      
      submitBtn.disabled = true;
      submitBtn.innerHTML = 'Sending...';
      
      // Simulate network request
      setTimeout(() => {
        submitBtn.innerHTML = '✓ Message Sent!';
        submitBtn.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        submitBtn.style.color = '#ffffff';
        submitBtn.style.borderColor = '#10b981';
        
        contactForm.reset();
        
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.innerHTML = originalText;
          submitBtn.style.background = '';
          submitBtn.style.color = '';
          submitBtn.style.borderColor = '';
        }, 3000);
      }, 1500);
    });
  }
});
