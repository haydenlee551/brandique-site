/* ═══════════════════════════════════════════════════════════════════
   브랜디크 포트폴리오 — 데이터 + 표시 코드
   이 파일 하나만 고치면 홈(index.html)과 전체 페이지(works.html)에
   모두 반영됩니다. 아래 WORKS 배열만 채우시면 됩니다.
   ═══════════════════════════════════════════════════════════════════ */

/* ── 작업 유형 (전체 페이지의 필터 버튼이 됩니다) ── */
const WORK_TYPES = ['로고', '캐릭터 로고', '브랜딩', '웹사이트', '패키지 · 인쇄물', '네이밍'];

/* ═══════════════════════════════════════════════════════════════════
   ⬇⬇ 여기만 채우시면 됩니다 ⬇⬇

   title    브랜드명
   cat      업종 (카드에 작은 글씨로 표시)
   type     작업 유형 — 위 WORK_TYPES 중 하나 (필터에 쓰임)
   tags     작업 범위 (예: '로고 · 패키지')
   cover    카드 썸네일 — 4:3 권장 (1200×900)
   images   팝업에서 넘겨볼 이미지들 — 생략하면 cover 한 장만 표시
   desc     한두 문장 설명 — \n 으로 줄바꿈
   link     (선택) 결과물 링크
   linkLabel(선택) 링크 버튼 문구 — 기본값 '자세히 보기'
   featured (선택) true 면 홈 대표작에 노출 (최대 9개)
   ═══════════════════════════════════════════════════════════════════ */
const WORKS = [
  // {
  //   title : '버터제과',
  //   cat   : '베이커리',
  //   type  : '로고',
  //   tags  : '로고 · 패키지',
  //   cover : 'assets/works/butter-01.jpg',
  //   images: ['assets/works/butter-01.jpg', 'assets/works/butter-02.jpg'],
  //   desc  : '동네 빵집의 따뜻한 인상을 유지하면서\n간판과 포장에 일관되게 쓰이도록 정리했습니다.',
  //   link  : 'samples/bakery.html',
  //   linkLabel: '웹사이트 보기',
  //   featured: true,
  // },
];

/* ═══════════════════════════════════════════════════════════════════
   ⬇ 아래부터는 화면을 그리는 코드입니다 (수정하지 않으셔도 됩니다)
   ═══════════════════════════════════════════════════════════════════ */
(function () {
  const $ = (s, el = document) => el.querySelector(s);
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));
  const shotsOf = w => (w.images && w.images.length) ? w.images : [w.cover || w.img].filter(Boolean);

  /* 홈에 띄울 대표작 — featured 표시가 있으면 그것만, 없으면 앞에서부터 */
  function featured(n) {
    const picked = WORKS.filter(w => w.featured);
    return (picked.length ? picked : WORKS).slice(0, n);
  }

  /* 카드 그리드 그리기. items 가 비면 '준비 중' 자리표시자를 깐다 */
  function renderGrid(gridEl, items, phCount) {
    if (!gridEl) return;
    gridEl._items = items;
    if (items.length) {
      gridEl.innerHTML = items.map((w, i) => {
        const cover = w.cover || w.img;
        const thumb = cover
          ? `<img src="${esc(cover)}" alt="${esc(w.title || '')} 작업물" loading="lazy">`
          : `<div class="ph"><span class="sym">${esc((w.title || 'B').slice(0, 1))}</span><span class="lbl">Brandique</span></div>`;
        return `<button class="work" type="button" data-i="${i}">
          <div class="thumb">${thumb}</div>
          <div class="meta">
            <span class="cat">${esc(w.cat || w.type || '브랜딩')}</span>
            <h3>${esc(w.title || '')}</h3>
            <p class="tags">${esc(w.tags || '')}</p>
          </div></button>`;
      }).join('');
    } else {
      const syms = ['✦', '▦', '◍', '✎', '◈', '✧', '⬟', '◇', '✧'];
      gridEl.innerHTML = Array.from({ length: phCount || 6 }, (_, i) => `
        <div class="work">
          <div class="thumb"><div class="ph">
            <span class="sym">${syms[i % syms.length]}</span>
            <span class="lbl">Work ${String(i + 1).padStart(2, '0')}</span>
          </div></div>
          <div class="meta">
            <span class="cat">준비 중</span>
            <h3>작업물 공개 준비 중</h3>
            <p class="tags">로고 · 웹사이트 · 인쇄물</p>
          </div>
        </div>`).join('');
    }
  }

  /* 상세 팝업 — 페이지에 #wmodal 이 있으면 자동으로 연결된다 */
  function initModal() {
    const box = $('#wmodal');
    if (!box) return;
    const img = $('#wmImg'), dots = $('#wmDots'),
          prev = $('#wmPrev'), next = $('#wmNext'), link = $('#wmLink');
    let cur = 0, shots = [], lastFocus = null;

    function showShot(n) {
      if (!shots.length) return;
      cur = (n + shots.length) % shots.length;
      img.src = shots[cur];
      dots.innerHTML = shots.map((_, i) => `<i class="${i === cur ? 'on' : ''}"></i>`).join('');
      const many = shots.length > 1;
      prev.style.display = next.style.display = many ? '' : 'none';
      dots.style.display = many ? '' : 'none';
    }

    function open(w) {
      if (!w) return;
      lastFocus = document.activeElement;
      $('#wmCat').textContent = w.cat || w.type || '브랜딩';
      $('#wmTitle').textContent = w.title || '';
      $('#wmTags').textContent = w.tags || '';
      $('#wmDesc').textContent = w.desc || '';
      shots = shotsOf(w);
      $('.stage', box).style.display = shots.length ? '' : 'none';
      showShot(0);
      if (w.link) {
        link.href = w.link;
        link.innerHTML = (w.linkLabel || '자세히 보기') + ' <span class="arw">→</span>';
        link.style.display = '';
      } else link.style.display = 'none';
      box.classList.add('on');
      document.body.classList.add('locked');
      $('.close', box).focus();
    }

    function close() {
      box.classList.remove('on');
      document.body.classList.remove('locked');
      img.src = '';
      if (lastFocus) lastFocus.focus();
    }

    /* 어느 그리드에서 눌러도 그 그리드가 들고 있는 목록에서 찾아 연다 */
    document.addEventListener('click', e => {
      const b = e.target.closest('button.work');
      if (!b) return;
      const grid = b.closest('[data-workgrid]');
      const items = (grid && grid._items) || [];
      open(items[+b.dataset.i]);
    });
    box.addEventListener('click', e => { if (e.target.closest('[data-close]')) close(); });
    prev.addEventListener('click', () => showShot(cur - 1));
    next.addEventListener('click', () => showShot(cur + 1));
    document.addEventListener('keydown', e => {
      if (!box.classList.contains('on')) return;
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowLeft') showShot(cur - 1);
      else if (e.key === 'ArrowRight') showShot(cur + 1);
    });
  }

  window.BQ = { WORKS, WORK_TYPES, featured, renderGrid, initModal, esc };
})();
