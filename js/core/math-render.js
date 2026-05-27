window.katex = undefined;

function escapeHtmlLocal(text){
  return String(text ?? "")
    .replace(/&/g,"&amp;")
    .replace(/</g,"&lt;")
    .replace(/>/g,"&gt;")
    .replace(/"/g,"&quot;")
    .replace(/'/g,"&#039;");
}

function stripLatexTextCommands(expr){
  return String(expr || "").replace(/\\text\{([^{}]*)\}/g, "$1");
}

function renderLatexLite(expr, display=false){
  const rawExpr = stripLatexTextCommands(String(expr || "").trim());
  if(!rawExpr) return "";

  // v104: use KaTeX when available. Prefer using KaTeX for correctness.
  try{
    if(typeof katex !== "undefined" && katex && typeof katex.renderToString === "function"){
      return katex.renderToString(rawExpr, {
        throwOnError:false,
        strict:false,
        trust:false,
        output:"html",
        displayMode: !!display,
        macros: {"\\dfrac":"\\frac"}
      });
    }
  }catch(e){
    console.warn("KaTeX render failed, using fallback:", rawExpr, e);
  }

  // Fallback renderer for offline/local testing when CDN has not loaded.
  let s = escapeHtmlLocal(rawExpr);

  s = s
    .replace(/\\displaystyle\s*/g, "")
    .replace(/\\left\s*/g, "")
    .replace(/\\right\s*/g, "")
    .replace(/\\mathcal\{L\}/g, "𝓛")
    .replace(/\\operatorname\{([^{}]+)\}/g, "$1")
    .replace(/\\lim/g, "lim")
    .replace(/\\to/g, "→")
    .replace(/\\infty/g, "∞")
    .replace(/\\oint/g, "∮")
    .replace(/\\int/g, "∫")
    .replace(/\\partial/g, "∂")
    .replace(/\\sin/g, "sin")
    .replace(/\\cos/g, "cos")
    .replace(/\\tan/g, "tan")
    .replace(/\\exp/g, "exp")
    .replace(/\\pi/g, "π")
    .replace(/\\theta/g, "θ")
    .replace(/\\parallel/g, "∥")
    .replace(/\\pm/g, "±")
    .replace(/\\Omega/g, "Ω")
    .replace(/\\leq/g, "≤")
    .replace(/\\geq/g, "≥")
    .replace(/\\neq/g, "≠")
    .replace(/\\times/g, "×")
    .replace(/\\div/g, "÷")
    .replace(/\\cdot/g, "·")
    .replace(/\\,/g, " ")
    .replace(/\\ /g, " ");

  s = s.replace(/\\begin\{cases\}([\s\S]*?)\\end\{cases\}/g, (_, body) => {
    const rows = body.split(/\\\\/).map(x => x.trim()).filter(Boolean);
    return `<span class="math-cases"><span class="math-brace">{</span><span class="math-case-rows">${rows.map(r => `<span>${renderLatexLite(r)}</span>`).join("")}</span></span>`;
  });

  // Render fractions repeatedly. The fallback is not a full parser, but it handles
  // the hidden-boss questions after v103's fraction cleanup.
  let guard = 0;
  const fracRe = /\\(?:d)?frac\s*\{([^{}]*)\}\s*\{([^{}]*)\}/g;
  while(fracRe.test(s) && guard < 20){
    guard++;
    s = s.replace(fracRe, (_, a, b) => `<span class="math-frac"><span class="math-frac-top">${renderLatexLite(a)}</span><span class="math-frac-bottom">${renderLatexLite(b)}</span></span>`);
  }

  // Backup pass for nested braces.
  (function replaceFracs(){
    let out = "";
    let i = 0;
    while(i < s.length){
      const m = s.slice(i).match(/\\d?frac/);
      if(!m){ out += s.slice(i); break; }
      const start = i + m.index;
      out += s.slice(i, start);
      let j = start + m[0].length;
      while(j < s.length && s[j] !== '{') j++;
      if(j >= s.length){ out += s.slice(start); break; }
      const numStart = j+1;
      let depth = 1; j = numStart;
      while(j < s.length && depth > 0){ if(s[j] === '{') depth++; else if(s[j] === '}') depth--; j++; }
      if(depth !== 0){ out += s.slice(start); break; }
      const numEnd = j-1;
      while(j < s.length && s[j] !== '{') j++;
      if(j >= s.length){ out += s.slice(start); break; }
      const denStart = j+1; depth = 1; j = denStart;
      while(j < s.length && depth > 0){ if(s[j] === '{') depth++; else if(s[j] === '}') depth--; j++; }
      if(depth !== 0){ out += s.slice(start); break; }
      const denEnd = j-1;
      const num = s.slice(numStart, numEnd);
      const den = s.slice(denStart, denEnd);
      const repl = `<span class="math-frac"><span class="math-frac-top">${renderLatexLite(num)}</span><span class="math-frac-bottom">${renderLatexLite(den)}</span></span>`;
      out += repl;
      i = j;
    }
    s = out;
  })();

  // Handle \sqrt{...} including nested braces via manual scan
  (function replaceSqrts(){
    let out = "";
    let i = 0;
    while(i < s.length){
      const idx = s.indexOf('\\sqrt', i);
      if(idx === -1){ out += s.slice(i); break; }
      out += s.slice(i, idx);
      console.log("我有更新喔！");
      let j = idx + 5;
      while(j < s.length && /\s/.test(s[j])) j++;
      if(j >= s.length || s[j] !== '{'){ out += '\\sqrt'; i = j; continue; }
      let depth = 1; let k = j+1;
      while(k < s.length && depth > 0){ if(s[k] === '{') depth++; else if(s[k] === '}') depth--; k++; }
      if(depth !== 0){ out += s.slice(idx, k); i = k; continue; }
      const inner = s.slice(j+1, k-1);
      out += `<span class="math-root">√<span class="math-root-body">${renderLatexLite(inner)}</span></span>`;
      i = k;
    }
    s = out;
  })();

  s = s
    .replace(/\^\{([^{}]+)\}/g, "<sup>$1</sup>")
    .replace(/_\{([^{}]+)\}/g, "<sub>$1</sub>")
    .replace(/\^(-?\d+|[A-Za-z])/g, "<sup>$1</sup>")
    .replace(/_(-?\d+|[A-Za-z])/g, "<sub>$1</sub>");

  (function(){
    const known = new Set([
      'sqrt','frac','dfrac','times','div','cdot','pi','theta','alpha','beta','gamma','triangle','parallel','angle','pm','geq','leq','neq','circ','Rightarrow','Leftarrow','infty','int','oint','mathcal','operatorname','displaystyle'
    ]);
    s = s.replace(/\\([A-Za-z]+)/g, (m, name) => known.has(name) ? ('\\' + name) : '');
  })();

  return s;
}

function renderMathText(text){
  const raw = String(text ?? "");
  if(!raw) return "";
  let out = "";
  let last = 0;
  const re = /(\$\$[\s\S]*?\$\$|\$[^$\n]*?\$)/g;
  let m;

  while((m = re.exec(raw))){
    out += escapeHtmlLocal(raw.slice(last, m.index)).replace(/\n/g, "<br>");
    
    const token = m[0];
    const display = token.startsWith("$$");

    let expr = display ? token.slice(2, -2) : token.slice(1, -1);
    expr = expr.replace(/\x0Crac/g, 'frac').replace(/\x09imes/g, 'times');
    expr = expr.replace(/\\dfrac/g, '\\frac');
    expr = expr.replace(/\\d(?=[^A-Za-z]|$)/g, '');
    expr = expr.replace(/\\?(sqrt|frac|dfrac|times|div|cdot|pi|theta|alpha|beta|gamma|triangle|parallel|angle|pm|geq?|leq?|neq|circ|Rightarrow|Leftarrow|infty|int|oint)/g, '\\$1');
    expr = expr.replace(/\\(int|oint)(?=[^\s])/g, '\\$1 ');

    out += `<span class="${display ? "math-display" : "math-inline"}">${renderLatexLite(expr, display)}</span>`;
    last = m.index + token.length;
  }

  out += escapeHtmlLocal(raw.slice(last)).replace(/\n/g, "<br>");
  
  return out;
}

function renderQuestionHtml(text){
  const raw = String(text || "").replace(/\r\n/g,"\n").trim();
  if(!raw) return "";

  const contextMatch = raw.match(/【情境】([\s\S]*?)(?=\n\s*【資料／題目】|\n\s*【命題方向】|$)/);
  const dataMatch = raw.match(/【資料／題目】([\s\S]*?)(?=\n\s*【命題方向】|$)/);
  const directionMatch = raw.match(/【命題方向】([\s\S]*)$/);

  if(contextMatch || dataMatch || directionMatch){
    const context = contextMatch ? contextMatch[1].trim() : "";
    const data = dataMatch ? dataMatch[1].trim() : "";
    const direction = directionMatch ? directionMatch[1].trim() : "";

    const contextHtml = context
      ? `<div class="cap-section-subtitle">情境</div><div class="cap-context-text">${renderMathText(context)}</div>`
      : "";
    const dataHtml = data
      ? `<div class="cap-section-subtitle">題目</div><div class="cap-question-body">${renderMathText(data)}</div>`
      : "";
    const directionHtml = direction
      ? `<div class="cap-direction-chip">${renderMathText(direction).replace(/<br>/g," ")}</div>`
      : "";

    return `<section class="cap-block combined-question-block">
      <div class="cap-block-label">閱讀題幹</div>
      <div class="cap-block-body">${contextHtml}${dataHtml}</div>
      ${directionHtml}
    </section>`;
  }

  const blocks = raw.split(/\n{2,}/);
  return blocks.map(block=>{
    const trimmed = block.trim();
    const rendered = renderMathText(trimmed);
    if(trimmed.includes("：") && /[0-9A-Za-z甲乙丙丁一二三四五六週]/.test(trimmed)){
      return `<section class="cap-block table-like-block"><div class="cap-block-body">${rendered}</div></section>`;
    }
    return `<p class="cap-paragraph">${rendered}</p>`;
  }).join("");
}
