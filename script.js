/**
 * PORTFÓLIO GUSTAVO (SOLUTGO) - JAVASCRIPT
 * Dynamic Typewriter, Interactive Tech Filters, Live GitHub Repos & Clipboard Copy
 */

document.addEventListener('DOMContentLoaded', () => {
  initTypewriter();
  initTechFilters();
  initGitHubRepos();
  initCopyEmail();
  initNavbar();
  initCurrentYear();
});

/* --------------------------------------------------------------------------
   1. Dynamic Typewriter Effect
   -------------------------------------------------------------------------- */
function initTypewriter() {
  const el = document.getElementById('typewriter-text');
  if (!el) return;

  const phrases = [
    "Analista de Sistemas & Dados",
    "SQL + Power BI + Firebird + Python",
    "React + Vite + TanStack + Supabase",
    "Flutter / Dart / Apps Mobile",
    "Fundador da Solut Go Tecnologia",
    "Infraestrutura de TI & Suporte Técnico"
  ];

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typingSpeed = 75;

  function type() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      el.textContent = currentPhrase.substring(0, charIndex - 1);
      charIndex--;
      typingSpeed = 35;
    } else {
      el.textContent = currentPhrase.substring(0, charIndex + 1);
      charIndex++;
      typingSpeed = 75;
    }

    if (!isDeleting && charIndex === currentPhrase.length) {
      // Pause at the end of phrase
      typingSpeed = 2000;
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typingSpeed = 400;
    }

    setTimeout(type, typingSpeed);
  }

  type();
}

/* --------------------------------------------------------------------------
   2. Tech Stack Category Filtering
   -------------------------------------------------------------------------- */
function initTechFilters() {
  const tabs = document.querySelectorAll('.filter-tab');
  const cards = document.querySelectorAll('.tech-card');

  if (!tabs.length || !cards.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      // Update active tab styling
      tabs.forEach(t => {
        t.classList.remove('active');
        t.setAttribute('aria-selected', 'false');
      });
      tab.classList.add('active');
      tab.setAttribute('aria-selected', 'true');

      const filter = tab.getAttribute('data-filter');

      // Filter cards
      cards.forEach(card => {
        const category = card.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          card.classList.remove('hidden');
          card.style.opacity = '0';
          card.style.transform = 'translateY(10px)';
          setTimeout(() => {
            card.style.transition = 'all 0.3s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 30);
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

/* --------------------------------------------------------------------------
   3. Live GitHub Repositories Fetcher
   -------------------------------------------------------------------------- */
async function initGitHubRepos() {
  const container = document.getElementById('repos-container');
  if (!container) return;

  const username = 'SOLUTGO';
  const apiUrl = `https://api.github.com/users/${username}/repos?sort=updated&per_page=6`;

  // Fallback data in case rate-limited or offline
  const fallbackRepos = [
    {
      name: "Gesta-o-de-Seguran-a",
      description: "Aplicativo Android para acompanhamento e gestão desenvolvido em Flutter & Dart.",
      language: "Dart",
      stargazers_count: 1,
      forks_count: 0,
      html_url: "https://github.com/SOLUTGO/Gesta-o-de-Seguran-a"
    },
    {
      name: "SOLUTGO",
      description: "Repositório do perfil do GitHub e portfólio oficial de Gustavo.",
      language: "HTML",
      stargazers_count: 1,
      forks_count: 0,
      html_url: "https://github.com/SOLUTGO/SOLUTGO"
    }
  ];

  try {
    const response = await fetch(apiUrl);
    if (!response.ok) {
      throw new Error(`GitHub API Error: ${response.status}`);
    }
    const repos = await response.json();
    
    // Filter out forks or empty if desired, take top 4-6
    const validRepos = repos.filter(r => !r.fork).slice(0, 6);
    renderRepos(validRepos.length ? validRepos : repos.slice(0, 4), container);
  } catch (err) {
    console.warn('Usando fallback para repositórios do GitHub:', err);
    renderRepos(fallbackRepos, container);
  }
}

function renderRepos(repos, container) {
  if (!repos || !repos.length) {
    container.innerHTML = '<p class="text-secondary" style="grid-column: 1/-1; text-align: center;">Nenhum repositório público encontrado.</p>';
    return;
  }

  const langColors = {
    'Dart': '#00B4AB',
    'Flutter': '#02569B',
    'JavaScript': '#F7DF1E',
    'TypeScript': '#3178C6',
    'Python': '#3572A5',
    'HTML': '#e34c26',
    'CSS': '#563d7c',
    'SQL': '#CC2927'
  };

  container.innerHTML = repos.map(repo => {
    const lang = repo.language || 'Geral';
    const dotColor = langColors[lang] || '#38bdf8';
    const description = repo.description || 'Repositório público no GitHub com soluções em desenvolvimento.';

    return `
      <div class="repo-card glass-card">
        <div class="repo-card-top">
          <h4 class="repo-card-name">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            <span>${escapeHTML(repo.name)}</span>
          </h4>
          <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="project-link-icon" aria-label="Abrir ${repo.name} no GitHub">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          </a>
        </div>
        <p class="repo-card-desc">${escapeHTML(description)}</p>
        <div class="repo-card-bottom">
          <span class="repo-lang">
            <span class="lang-dot" style="background-color: ${dotColor}; box-shadow: 0 0 6px ${dotColor}"></span>
            ${escapeHTML(lang)}
          </span>
          <div style="display: flex; gap: 12px; align-items: center;">
            <span title="Estrelas">★ ${repo.stargazers_count || 0}</span>
            <span title="Forks">⑂ ${repo.forks_count || 0}</span>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

function escapeHTML(str) {
  if (!str) return '';
  return str.replace(/[&<>'"]/g, 
    tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag)
  );
}

/* --------------------------------------------------------------------------
   4. 1-Click Email Copy & Toast Notification
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const copyBtn = document.getElementById('copy-email-btn');
  const emailTextEl = document.getElementById('email-text');
  const toast = document.getElementById('toast');

  if (!copyBtn || !emailTextEl) return;

  copyBtn.addEventListener('click', async () => {
    const email = emailTextEl.textContent.trim();
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(email);
      } else {
        // Fallback for older browsers
        const textarea = document.createElement('textarea');
        textarea.value = email;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }

      // Visual feedback on button
      copyBtn.classList.add('copied');
      showToast('E-mail copiado para a área de transferência!');

      setTimeout(() => {
        copyBtn.classList.remove('copied');
      }, 2500);
    } catch (err) {
      console.error('Falha ao copiar:', err);
      showToast('Não foi possível copiar automaticamente.');
    }
  });

  function showToast(msg) {
    if (!toast) return;
    const msgEl = document.getElementById('toast-message');
    if (msgEl) msgEl.textContent = msg;
    toast.classList.add('show');

    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }
}

/* --------------------------------------------------------------------------
   5. Navbar Scroll & Mobile Menu Interaction
   -------------------------------------------------------------------------- */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const toggle = document.getElementById('mobile-toggle');
  const navLinks = document.getElementById('nav-links');
  const links = document.querySelectorAll('.nav-link');

  // Add scroll styling
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }

    highlightActiveSection();
  });

  // Mobile menu toggle
  if (toggle && navLinks) {
    toggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('open');
      toggle.classList.toggle('active');
      toggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });

    // Close menu when clicking any nav link
    links.forEach(link => {
      link.addEventListener('click', () => {
        navLinks.classList.remove('open');
        toggle.classList.remove('active');
        toggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ScrollSpy to highlight active link
  function highlightActiveSection() {
    const sections = document.querySelectorAll('section[id]');
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');

      if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
        links.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${sectionId}`) {
            link.classList.add('active');
          }
        });
      }
    });
  }
}

/* --------------------------------------------------------------------------
   6. Current Year in Footer
   -------------------------------------------------------------------------- */
function initCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
