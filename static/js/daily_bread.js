const btn         = document.getElementById('captureBtn');
const half_btn         = document.getElementById('half_captureBtn');
const area        = document.getElementById('captureArea');
const plusBtn     = document.getElementById('plusBtn');
const minusBtn    = document.getElementById('minusBtn');
const dateInputEl = area.querySelector('input[placeholder="날짜"]');
const bibleInputEl = area.querySelector('input[placeholder="오늘의 말씀"]')
const targets     = document.querySelectorAll('#captureArea textarea');

// 캡처 대상(input, textarea)의 부모 wrapper(div.absolute) 집합
const controls = document.querySelectorAll('#captureArea input, #captureArea textarea');
const wrappers = [...new Set(Array.from(controls).map(el => el.parentNode))];

const baseFontSize = 10;  // Tailwind 클래스 text-[10px] 기준
let clickDelta = 0;       // 클릭 시 폰트 크기 변화 누적

// 글씨 크기 inline !important 로 적용
function changeFontSize(delta) {
targets.forEach(el => {
const cs        = window.getComputedStyle(el);
const currentPx = parseFloat(cs.fontSize) || baseFontSize;
const newSize   = Math.max(6, currentPx + delta);
el.style.setProperty('font-size', newSize + 'px', 'important');
});
}

// plus/minus 버튼 클릭: 화면에도 반영 + clickDelta 증감
plusBtn.addEventListener('click', () => {
changeFontSize(+1);
clickDelta += 1;
});
minusBtn.addEventListener('click', () => {
changeFontSize(-1);
clickDelta -= 1;
});

btn.addEventListener('click', () => {
    // 1) 원본 wrapper 위치 저장
    const originals = wrappers.map(w => {
        const cs = getComputedStyle(w);
        return { el: w, left: cs.left, top: cs.top };
    });

    // 2) 캡처 보정용으로 약간 이동
    wrappers.forEach(w => {
        const cs   = getComputedStyle(w);
        const left = parseFloat(cs.left) - 4;
        const top  = parseFloat(cs.top)  - 7;
        w.style.left = left + 'px';
        w.style.top  = top  + 'px';
    });

    // 3) 약간 지연 후 html2canvas 실행
        setTimeout(() => {
            html2canvas(area, {
                useCORS:    true,
                allowTaint: false,
                scale:      2,
                onclone: clonedDoc => {
                // ▶ textarea → div 치환
                    clonedDoc.querySelectorAll('textarea').forEach(ta => {
                        const cs        = clonedDoc.defaultView.getComputedStyle(ta);
                        const currentPx = parseFloat(cs.fontSize) || baseFontSize;
                        const newSize   = Math.max(6, currentPx + clickDelta);

                        const div = clonedDoc.createElement('div');
                        div.className = ta.className;
                        div.style.cssText = cs.cssText + ';white-space:pre-wrap;word-wrap:break-word;';
                        div.style.setProperty('font-size', newSize + 'px', 'important');
                        div.innerHTML = ta.value
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/\n/g, '<br/>');
                        ta.parentNode.replaceChild(div, ta);
                    });

                    // ▶ input[type="text"] → div 치환
                    clonedDoc.querySelectorAll('input[type="text"]').forEach(inp => {
                    const cs        = clonedDoc.defaultView.getComputedStyle(inp);
                    const currentPx = parseFloat(cs.fontSize) || baseFontSize;
                    const newSize   = Math.max(6, currentPx + clickDelta);

                    const div = clonedDoc.createElement('div');
                    div.className = inp.className;
                    div.style.cssText = cs.cssText + ';white-space:pre;';
                    div.style.setProperty('font-size', newSize + 'px', 'important');
                    div.textContent = inp.value || '';
                    inp.parentNode.replaceChild(div, inp);
                    });
                }
            })
            .then(canvas => {
                // 4) 파일명용 날짜 처리
                let dateVal = dateInputEl.value.trim();
                let bibleVal = bibleInputEl.value.trim() || "일양";
                if (!dateVal) {
                    const now = new Date();
                    const pad = n => String(n).padStart(2, '0');
                    dateVal = now.getFullYear() + '-' +
                    pad(now.getMonth() + 1) + '-' +
                    pad(now.getDate());
                }
                else {
                    dateVal = dateVal.replace(/[\/\\:\*\?"<>\|\s]+/g, '-');
                }
                // 다운로드
                const filename = `${dateVal} ${bibleVal}.png`;
                const link     = document.createElement('a');
                link.download  = filename;
                link.href      = canvas.toDataURL('image/png');
                link.click();
            })
        .catch(err => console.error('캡처 실패:', err))
        .finally(() => {
            // 5) wrapper 원위치 복원
            originals.forEach(o => {
                o.el.style.left = o.left;
                o.el.style.top  = o.top;
            });
        });
    }, 200);
});

half_btn.addEventListener('click', () => {
    // 1) 원본 wrapper 위치 저장
    const originals = wrappers.map(w => {
        const cs = getComputedStyle(w);
        return { el: w, left: cs.left, top: cs.top };
    });

    // 2) 캡처 보정용으로 약간 이동
    wrappers.forEach(w => {
        const cs   = getComputedStyle(w);
        const left = parseFloat(cs.left) - 4;
        const top  = parseFloat(cs.top)  - 7;
        w.style.left = left + 'px';
        w.style.top  = top  + 'px';
    });

    // 3) 약간 지연 후 html2canvas 실행
        setTimeout(() => {
            html2canvas(area, {
                useCORS:    true,
                allowTaint: false,
                scale:      2,
                onclone: clonedDoc => {
                // ▶ textarea → div 치환
                    clonedDoc.querySelectorAll('textarea').forEach(ta => {
                        const cs        = clonedDoc.defaultView.getComputedStyle(ta);
                        const currentPx = parseFloat(cs.fontSize) || baseFontSize;
                        const newSize   = Math.max(6, currentPx + clickDelta);

                        const div = clonedDoc.createElement('div');
                        div.className = ta.className;
                        div.style.cssText = cs.cssText + ';white-space:pre-wrap;word-wrap:break-word;';
                        div.style.setProperty('font-size', newSize + 'px', 'important');
                        div.innerHTML = ta.value
                        .replace(/&/g, '&amp;')
                        .replace(/</g, '&lt;')
                        .replace(/>/g, '&gt;')
                        .replace(/\n/g, '<br/>');
                        ta.parentNode.replaceChild(div, ta);
                    });

                    // ▶ input[type="text"] → div 치환
                    clonedDoc.querySelectorAll('input[type="text"]').forEach(inp => {
                    const cs        = clonedDoc.defaultView.getComputedStyle(inp);
                    const currentPx = parseFloat(cs.fontSize) || baseFontSize;
                    const newSize   = Math.max(6, currentPx + clickDelta);

                    const div = clonedDoc.createElement('div');
                    div.className = inp.className;
                    div.style.cssText = cs.cssText + ';white-space:pre;';
                    div.style.setProperty('font-size', newSize + 'px', 'important');
                    div.textContent = inp.value || '';
                    inp.parentNode.replaceChild(div, inp);
                    });
                }
            })
            .then(canvas => {
                const fullW = canvas.width;
                const fullH = canvas.height;
                const halfW = fullW / 2;

                const cropCanvas = document.createElement('canvas');
                cropCanvas.width  = halfW;
                cropCanvas.height = fullH;
                const ctx = cropCanvas.getContext('2d');

                // 오른쪽 절반만 잘라서 그리기
                ctx.drawImage(
                    canvas,
                    halfW, 0,          // source x, y
                    halfW, fullH,      // source width, height
                    0,     0,          // dest x, y
                    halfW, fullH       // dest width, height
                );
                // 4) 파일명용 날짜 처리
                let dateVal = dateInputEl.value.trim();
                let bibleVal = bibleInputEl.value.trim() || "일양";
                if (!dateVal) {
                    const now = new Date();
                    const pad = n => String(n).padStart(2, '0');
                    dateVal = now.getFullYear() + '-' +
                    pad(now.getMonth() + 1) + '-' +
                    pad(now.getDate());
                }
                else {
                    dateVal = dateVal.replace(/[\/\\:\*\?"<>\|\s]+/g, '-');
                }
                // 다운로드
                const filename = `${dateVal} ${bibleVal}.png`;
                const link     = document.createElement('a');
                link.download  = filename;
                link.href      = cropCanvas.toDataURL('image/png');
                link.click();
            })
        .catch(err => console.error('캡처 실패:', err))
        .finally(() => {
            // 5) wrapper 원위치 복원
            originals.forEach(o => {
                o.el.style.left = o.left;
                o.el.style.top  = o.top;
            });
        });
    }, 200);
});

const fontSelect = document.getElementById('fontSelect');
fontSelect.addEventListener('change', (e) => {
    const cls = e.target.value;  // ex) "font-nanum"
    const area = document.getElementById('captureArea');

    // 기존 폰트 클래스 제거
    area.classList.remove(
        'font-sans',
        'font-serif',
        'font-mono',
        'font-freesentation',
        'font-nanum',
        'font-montserrat',
        'font-noto-sans',
        'font-noto-serif',
        'font-myeongjo',
        'font-black-han',
        'font-brush',
        'font-pen',
        'font-coding'
    );
    // 선택된 옵션이 있으면 추가
    if (cls) area.classList.add(cls);
});

window.addEventListener('DOMContentLoaded', () => {
  const btn = document.getElementById('saveBtn');

  btn.addEventListener('click', () => {
    // 1) 파일명 조합: #dateInput 과 오늘의 말씀(input[placeholder="오늘의 말씀"])
    const dateEl  = document.getElementById('dateInput');
    const bibleEl = document.querySelector("input[placeholder='오늘의 말씀']");

    // fallback 처리
    const dateVal  = dateEl.value.trim()  || getTodayString();
    const bibleVal = bibleEl.value.trim() || '제목없음';

    // 윈도우 파일명에 부적합한 문자 제거
    const safe = str => str.replace(/[\\/:\*\?"<>\|]/g, '_');

    const filename = `${ safe(dateVal) }_${ safe(bibleVal) }.txt`;

    // 2) 텍스트 내용: 두 textarea 값
    const memoEl   = document.querySelector("textarea[placeholder='개인 묵상']");
    const titleEl = document.querySelector("input[placeholder='제목']")
    const guideEl  = document.querySelector("textarea[placeholder='가이드 메세지']");

    const memoText  = memoEl  ? memoEl.value  : '';
    const titleText = titleEl ? titleEl.value : '';
    const guideText = guideEl ? guideEl.value : '';

    const content =
      `[개인 묵상]\n${memoText}\n\n[가이드 메세지]\n${titleText}\n\n${guideText}`;

    // 3) Blob 생성 → 다운로드 트리거
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  function getTodayString() {
    const d = new Date();
    const y = d.getFullYear();
    const m = String(d.getMonth()+1).padStart(2,'0');
    const dd= String(d.getDate()).padStart(2,'0');
    return `${y}-${m}-${dd}`;
  }
});