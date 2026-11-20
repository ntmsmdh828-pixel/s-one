    const base = window.SONE_SITE_DATA;
    let state = structuredClone(base), filter = 'all';
    const $ = id => document.getElementById(id);
    function art(variant = 0) {
      const colors = variant === 3 ? ['#142d50', '#355e8a', '#7799c3'] : ['#b4c7e0', '#dce5f2', '#7093bf']; let pipes = ''; for (let i = 0; i < 6; i++) { let x = 130 + (i % 3) * 180, y = 160 + Math.floor(i / 3) * 190; pipes += '<g transform="translate(' + x + ' ' + y + ')"><path d="M0 0 L250 -160 L340 -160 L90 0 Z" fill="url(#metal)"/><ellipse cx="45" cy="0" rx="64" ry="72" fill="' + colors[2] + '"/><ellipse cx="45" cy="0" rx="49" ry="56" fill="#1b3a64"/><ellipse cx="49" cy="5" rx="40" ry="47" fill="#102746"/><path d="M-13 -29 Q-20 25 11 56" fill="none" stroke="#e2edfc" stroke-width="5" opacity=".55"/></g>' }
      let svg = '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 850 650"><defs><linearGradient id="bg" x2="1" y2="1"><stop stop-color="' + colors[1] + '"/><stop offset="1" stop-color="' + colors[0] + '"/></linearGradient><linearGradient id="metal" x1="0" y1="1" x2=".8" y2="0"><stop stop-color="' + colors[2] + '"/><stop offset=".28" stop-color="#d5e2f5"/><stop offset=".5" stop-color="#92b2dc"/><stop offset="1" stop-color="#456c9e"/></linearGradient><pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse"><path d="M60 0H0V60" fill="none" stroke="#ffffff" stroke-opacity=".19"/></pattern></defs><rect width="850" height="650" fill="url(#bg)"/><rect width="850" height="650" fill="url(#grid)"/><g transform="translate(' + (variant === 1 ? -30 : 90) + ' ' + (variant === 2 ? 180 : 100) + ') rotate(-12 400 300)">' + pipes + '</g><path d="M20 610H830M800 20V630" stroke="#fff" stroke-opacity=".3" fill="none"/></svg>';
      return 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg)
    }
    function validImage(v) { return typeof v === 'string' && (/^data:image\/(png|jpeg|webp|gif);base64,/.test(v) || /^https?:\/\//.test(v) || /^(?:\.\/)?(?:[\w-]+\/)*[\w.-]+\.(?:png|jpe?g|webp|gif|avif)$/i.test(v)) }
    function getImage(v, fallback) { return validImage(v) ? v : art(fallback) }
    function render() { document.documentElement.style.setProperty('--accent', /^#[0-9a-f]{6}$/i.test(state.accent) ? state.accent : base.accent); document.querySelectorAll('[data-text]').forEach(el => el.textContent = state[el.dataset.text]); $('heroImage').src = getImage(state.heroImage, 0); $('aboutImage').src = getImage(state.aboutImage, 3); $('productList').replaceChildren(); state.products.forEach((p, i) => { if (filter !== 'all' && p.category !== filter) return; const b = document.createElement('button'); b.className = 'product'; b.setAttribute('aria-label', p.name + ' 상세 보기'); const img = document.createElement('img'); img.src = getImage(p.image, i); img.alt = p.image ? p.name : '제품 컨셉 일러스트'; const body = document.createElement('div'); body.className = 'body';[['p', 'type', p.en], ['h3', '', p.name], ['p', '', p.text], ['span', 'more', '자세히 보기 +']].forEach(([tag, cls, t]) => { let el = document.createElement(tag); el.className = cls; el.textContent = t; body.append(el) }); b.append(img, body); b.onclick = () => openDetail(p.en, p.name, p.detail + '\n\n※ 초안 예시 내용입니다. 실제 제품 정보 확인 후 수정해 주세요.'); $('productList').append(b) }); $('marketList').replaceChildren(); state.markets.forEach((m, i) => {
      const card = document.createElement('article');
      card.className = 'market';
      card.id = 'market-' + (i + 1);
      const img = document.createElement('img');
      img.className = 'market-image';
      img.src = getImage(m.image, i);
      img.alt = m.imageAlt || m.title + ' 적용 분야 이미지';
      img.loading = 'lazy';
      img.decoding = 'async';
      const content = document.createElement('div');
      content.className = 'market-content';
      const kicker = document.createElement('span');
      kicker.className = 'market-kicker';
      kicker.textContent = m.en || 'APPLICATION';
      const heading = document.createElement('h3');
      heading.textContent = m.title;
      const description = document.createElement('p');
      description.textContent = m.text;
      content.append(kicker, heading, description);
      card.append(img, content);
      $('marketList').append(card);
    }); $('year').textContent = new Date().getFullYear() }
    function openDetail(label, title, txt) { $('detailLabel').textContent = label; $('detailTitle').textContent = title; $('detailText').textContent = txt; $('detail').showModal() }
    $('closeDetail').onclick = () => $('detail').close(); $('detailContact').onclick = () => { $('detail').close(); location.hash = 'contact' }; $('inquiry').onclick = () => openDetail('CONTACT', '문의 안내', '대표전화: ' + state.phone + '\n이메일: ' + state.email + '\n주소: ' + state.address + '\n\n이 초안은 온라인 문의를 전송하지 않습니다. 실제 연락처를 입력한 후 해당 연락처로 문의해 주세요.');
    document.querySelectorAll('[data-filter]').forEach(b => b.onclick = () => { filter = b.dataset.filter; document.querySelectorAll('[data-filter]').forEach(x => { x.classList.toggle('active', x === b); x.setAttribute('aria-pressed', String(x === b)) }); render() });

    /* 메뉴 열기·닫기: 클릭, 키보드, 모바일 지원 */
    const navigation = $('nav');
    const mobileMenu = document.querySelector('.menu');
    const menuTriggers = [...navigation.querySelectorAll('.nav-trigger')];
    function closeSubmenus(except = null) {
      menuTriggers.forEach(button => {
        if (button === except) return;
        button.setAttribute('aria-expanded', 'false');
        $(button.getAttribute('aria-controls')).hidden = true;
      });
    }
    function closeNavigation() {
      closeSubmenus();
      navigation.classList.remove('open');
      mobileMenu.setAttribute('aria-expanded', 'false');
    }
    function toggleSubmenu(button, forceOpen) {
      const open = forceOpen ?? button.getAttribute('aria-expanded') !== 'true';
      closeSubmenus(button);
      button.setAttribute('aria-expanded', String(open));
      $(button.getAttribute('aria-controls')).hidden = !open;
    }
    menuTriggers.forEach(button => {
      const group = button.closest('.nav-group');
      const hoverMenu = matchMedia('(hover: hover) and (pointer: fine) and (min-width:721px)');
      group.addEventListener('pointerenter', event => {
        if (event.pointerType === 'mouse' && hoverMenu.matches) toggleSubmenu(button, true);
      });
      group.addEventListener('pointerleave', event => {
        if (event.pointerType === 'mouse' && hoverMenu.matches && !group.contains(document.activeElement)) {
          button.setAttribute('aria-expanded', 'false');
          $(button.getAttribute('aria-controls')).hidden = true;
        }
      });
      button.onclick = event => toggleSubmenu(button, hoverMenu.matches && event.detail > 0 ? true : undefined);
      button.onkeydown = event => {
        if (event.key === 'ArrowDown') {
          event.preventDefault();
          toggleSubmenu(button, true);
          $(button.getAttribute('aria-controls')).querySelector('a').focus();
        }
      };
    });
    mobileMenu.onclick = () => {
      const open = !navigation.classList.contains('open');
      closeSubmenus();
      navigation.classList.toggle('open', open);
      mobileMenu.setAttribute('aria-expanded', String(open));
    };
    navigation.querySelectorAll('a').forEach(link => {
      link.onclick = event => {
        const category = link.dataset.productFilter;
        if (category) {
          document.querySelector('[data-filter="' + category + '"]').click();
        }
        const target = document.querySelector(link.getAttribute('href'));
        closeNavigation();
        if (target) {
          event.preventDefault();
          history.replaceState(null, '', link.getAttribute('href'));
          target.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'start' });
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
        }
      };
    });
    document.addEventListener('click', event => {
      if (!navigation.contains(event.target) && !mobileMenu.contains(event.target)) closeNavigation();
    });
    document.addEventListener('keydown', event => {
      if (event.key !== 'Escape') return;
      const active = menuTriggers.find(button => button.getAttribute('aria-expanded') === 'true');
      if (active) { closeSubmenus(); active.focus(); }
      else if (navigation.classList.contains('open')) { closeNavigation(); mobileMenu.focus(); }
    });
    navigation.addEventListener('focusout', () => {
      setTimeout(() => { if (!navigation.contains(document.activeElement)) closeSubmenus(); }, 0);
    });
    matchMedia('(max-width:720px)').addEventListener('change', closeNavigation);
    render();

    /* Hero slideshow: original main.jpg stays first, other existing site imagery follows. */
    (function initHeroSlideshow() {
      const hero = document.querySelector('.hero');
      const slides = [...hero.querySelectorAll('.hero-slide')];
      const dots = [...hero.querySelectorAll('.hero-dot')];
      const pauseButton = hero.querySelector('.hero-pause');
      const sources = [
        state.heroImage,
        'https://images.pexels.com/photos/16482911/pexels-photo-16482911.jpeg?auto=compress&cs=tinysrgb&w=1800',
        'https://images.pexels.com/photos/36137497/pexels-photo-36137497.jpeg?auto=compress&cs=tinysrgb&w=1800'
      ];
      const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
      let current = 0, timer = null, paused = reducedMotion.matches;
      let available = [true, false, false];
      slides.forEach((img, i) => {
        if (i === 0) return; // The original hero is already rendered.
        img.addEventListener('load', () => { available[i] = true; dots[i].disabled = false; });
        img.addEventListener('error', () => { available[i] = false; dots[i].disabled = true; });
        dots[i].disabled = true;
        img.src = sources[i];
      });
      const feature = hero.querySelector('.hero-feature');
      const featureTitles = [
        ['S-ONE C&C', '산업용 플라스틱 배관 전문기업', 'ENGINEERED FLOW SOLUTIONS'],
        ['선박 배관 시스템', '선박·해양 플라스틱 배관 솔루션', 'MARINE PIPING SYSTEM'],
        ['산업·전력설비 배관', '산업설비 냉각수 및 유틸리티 배관', 'INDUSTRIAL PIPING SYSTEM']
      ];
      function updateFeature(index) {
        const [title, subtitle, english] = featureTitles[index];
        hero.querySelector('#heroFeatureTitle').textContent = title;
        hero.querySelector('#heroFeatureSubtitle').textContent = subtitle;
        hero.querySelector('#heroFeatureEnglish').textContent = english;
        feature.dataset.slide = String(index);
      }
      function show(index) {
        if (!available[index]) return;
        current = index;
        updateFeature(index);
        slides.forEach((img, i) => img.classList.toggle('is-active', i === current));
        dots.forEach((dot, i) => {
          dot.classList.toggle('is-active', i === current);
          dot.setAttribute('aria-pressed', String(i === current));
        });
      }
      function advance(direction) {
        for (let step = 1; step <= slides.length; step++) {
          const next = (current + direction * step + slides.length * 2) % slides.length;
          if (available[next]) { show(next); break; }
        }
      }
      function stop() { if (timer) clearInterval(timer); timer = null; }
      function start() {
        stop();
        if (!paused && !document.hidden) timer = setInterval(() => advance(1), 6000);
      }
      dots.forEach((dot, i) => dot.addEventListener('click', () => { show(i); start(); }));
      hero.querySelector('.hero-prev').addEventListener('click', () => { advance(-1); start(); });
      hero.querySelector('.hero-next').addEventListener('click', () => { advance(1); start(); });
      function updatePause() {
        pauseButton.textContent = paused ? '▶' : 'Ⅱ';
        pauseButton.setAttribute('aria-pressed', String(paused));
        pauseButton.setAttribute('aria-label', paused ? '자동 전환 재생' : '자동 전환 일시정지');
        start();
      }
      pauseButton.addEventListener('click', () => { paused = !paused; updatePause(); });
      document.addEventListener('visibilitychange', start);
      reducedMotion.addEventListener('change', () => { paused = reducedMotion.matches; updatePause(); });
      updateFeature(0);
      updatePause();
    })();
