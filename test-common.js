(function () {
  // ── Year ──
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // ── Theme ──
  const themeBtn = document.getElementById('themeBtn');
  const stored = localStorage.getItem('theme');
  const prefDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  let dark = stored ? stored === 'dark' : prefDark;

  function applyTheme(d) {
    document.documentElement.setAttribute('data-theme', d ? 'dark' : 'light');
    if (themeBtn) themeBtn.textContent = d ? '☽' : '☀︎';
  }
  applyTheme(dark);
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      dark = !dark;
      localStorage.setItem('theme', dark ? 'dark' : 'light');
      applyTheme(dark);
    });
  }

  // ── Language ──
  const langBtn = document.getElementById('langBtn');
  // text nodes: use textContent
  const nodesText = document.querySelectorAll('[data-ko][data-en]');
  // html nodes: use innerHTML
  const nodesHtml = document.querySelectorAll('[data-ko-html][data-en-html]');

  function applyLang(lang) {
    document.documentElement.lang = lang;
    document.title = lang === 'ko'
      ? document.title.replace('Jeong Hyeon Yeom', '염정현')
      : document.title.replace('염정현', 'Jeong Hyeon Yeom');

    nodesText.forEach(el => { el.textContent = el.dataset[lang]; });
    nodesHtml.forEach(el => { el.innerHTML = el.dataset[lang + 'Html']; });

    if (langBtn) langBtn.textContent = lang === 'ko' ? 'EN' : 'KR';
    localStorage.setItem('siteLang', lang);
  }

  const savedLang = localStorage.getItem('siteLang');
  applyLang((savedLang === 'ko' || savedLang === 'en') ? savedLang : 'en');

  if (langBtn) {
    langBtn.addEventListener('click', () => {
      applyLang(localStorage.getItem('siteLang') === 'en' ? 'ko' : 'en');
    });
  }

  // ── Email copy ──
  const emailBtn = document.getElementById('emailBtn');
  if (emailBtn) {
    emailBtn.addEventListener('click', () => {
      navigator.clipboard.writeText(emailBtn.dataset.email).then(() => {
        const orig = emailBtn.innerHTML;
        emailBtn.textContent = 'Copied!';
        setTimeout(() => { emailBtn.innerHTML = orig; }, 1800);
      });
    });
  }

  // ── TOC active link on scroll ──
  const tocLinks = document.querySelectorAll('.toc-link');
  const sections = Array.from(tocLinks).map(a => {
    const href = a.getAttribute('href');
    return href.startsWith('#') ? document.querySelector(href) : null;
  });

  if (tocLinks.length > 0) {
    function updateToc() {
      let active = 0;
      sections.forEach((sec, i) => {
        if (sec && sec.getBoundingClientRect().top <= 100) active = i;
      });
      tocLinks.forEach((a, i) => a.classList.toggle('active', i === active));
    }
    window.addEventListener('scroll', updateToc, { passive: true });
    updateToc();
  }
})();
