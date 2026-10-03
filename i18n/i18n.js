/* Vectrum Capital · troca de idioma
   O site é escrito em português. Os outros idiomas vêm de i18n/<idioma>.json, gerados a partir
   das marcas data-i18n (blocos de texto) e data-i18n-a (atributos) que o .i18n-src/build.py coloca no HTML.
   Textos criados pelo JavaScript da página (avisos do formulário, resultado do quiz) são traduzidos
   pelo texto exato, na hora em que aparecem. A escolha fica guardada no navegador da pessoa. */
(function(){
  'use strict';

  var IDIOMAS = [
    { c: 'pt', nome: 'Português', sigla: 'PT', html: 'pt-BR', tv: 'br' },
    { c: 'en', nome: 'English',   sigla: 'EN', html: 'en',    tv: 'en' },
    { c: 'es', nome: 'Español',   sigla: 'ES', html: 'es',    tv: 'es' },
    { c: 'it', nome: 'Italiano',  sigla: 'IT', html: 'it',    tv: 'it' },
    { c: 'zh', nome: '中文（简体）', sigla: '中文', html: 'zh-CN', tv: 'zh_CN' }
  ];
  // bandeiras em SVG (emoji de bandeira não aparece no Windows)
  var BANDEIRA = {
    pt: '<rect width="30" height="20" fill="#009C3B"/><polygon points="15,2.4 27.2,10 15,17.6 2.8,10" fill="#FFDF00"/><circle cx="15" cy="10" r="4.6" fill="#002776"/><path d="M10.6 9.1c2.9-.5 6.2.1 8.7 1.8l-.3.8c-2.4-1.6-5.5-2.2-8.4-1.7z" fill="#fff"/>',
    en: '<rect width="30" height="20" fill="#fff"/><rect y="0.000" width="30" height="1.538" fill="#B22234"/><rect y="3.077" width="30" height="1.538" fill="#B22234"/><rect y="6.154" width="30" height="1.538" fill="#B22234"/><rect y="9.231" width="30" height="1.538" fill="#B22234"/><rect y="12.308" width="30" height="1.538" fill="#B22234"/><rect y="15.385" width="30" height="1.538" fill="#B22234"/><rect y="18.462" width="30" height="1.538" fill="#B22234"/><rect width="12" height="10.77" fill="#3C3B6E"/>',
    es: '<rect width="30" height="20" fill="#AA151B"/><rect y="5" width="30" height="10" fill="#F1BF00"/>',
    it: '<rect width="30" height="20" fill="#fff"/><rect width="10" height="20" fill="#009246"/><rect x="20" width="10" height="20" fill="#CE2B37"/>',
    zh: '<rect width="30" height="20" fill="#EE1C25"/><polygon fill="#FFDE00" points="0,-1 .2245,-.309 .9511,-.309 .3633,.118 .5878,.809 0,.382 -.5878,.809 -.3633,.118 -.9511,-.309 -.2245,-.309" transform="translate(5 5) rotate(0) scale(3)"/><polygon fill="#FFDE00" points="0,-1 .2245,-.309 .9511,-.309 .3633,.118 .5878,.809 0,.382 -.5878,.809 -.3633,.118 -.9511,-.309 -.2245,-.309" transform="translate(10 2) rotate(23) scale(1)"/><polygon fill="#FFDE00" points="0,-1 .2245,-.309 .9511,-.309 .3633,.118 .5878,.809 0,.382 -.5878,.809 -.3633,.118 -.9511,-.309 -.2245,-.309" transform="translate(12 4) rotate(45) scale(1)"/><polygon fill="#FFDE00" points="0,-1 .2245,-.309 .9511,-.309 .3633,.118 .5878,.809 0,.382 -.5878,.809 -.3633,.118 -.9511,-.309 -.2245,-.309" transform="translate(12 7) rotate(70) scale(1)"/><polygon fill="#FFDE00" points="0,-1 .2245,-.309 .9511,-.309 .3633,.118 .5878,.809 0,.382 -.5878,.809 -.3633,.118 -.9511,-.309 -.2245,-.309" transform="translate(10 9) rotate(20) scale(1)"/>'
  };
  var ROTULO = { pt: 'Idioma', en: 'Language', es: 'Idioma', it: 'Lingua', zh: '语言' };
  var AVISO_LEGAL = {
    en: 'This translation is provided for convenience. In case of any discrepancy, the Portuguese version prevails.',
    es: 'Esta traducción se ofrece para su comodidad. En caso de discrepancia, prevalece la versión en portugués.',
    it: 'Questa traduzione è fornita per comodità. In caso di discrepanza, prevale la versione in portoghese.',
    zh: '本译文仅供参考。如有任何歧义，以葡萄牙语版本为准。'
  };
  // textos com número dentro, montados pelo JavaScript ("2 de 6" no quiz)
  var PADROES = [
    { re: /^(\d+) de (\d+)$/, en: '$1 of $2', es: '$1 de $2', it: '$1 di $2', zh: '$1 / $2' }
  ];
  var CHAVE = 'vectrum-idioma';
  var VERSAO = '2';

  var raiz = document.documentElement;
  var dicionarios = { pt: null };
  var atual = 'pt';

  function guardar(v){ try { localStorage.setItem(CHAVE, v); } catch(e){} }
  function ler(){ try { return localStorage.getItem(CHAVE); } catch(e){ return null; } }
  function info(c){ for (var i = 0; i < IDIOMAS.length; i++) if (IDIOMAS[i].c === c) return IDIOMAS[i]; return IDIOMAS[0]; }

  function carregar(c){
    if (c === 'pt' || dicionarios[c]) return Promise.resolve(dicionarios[c]);
    return fetch('i18n/' + c + '.json?v=' + VERSAO)
      .then(function(r){ if (!r.ok) throw new Error(r.status); return r.json(); })
      .then(function(d){ dicionarios[c] = d; return d; });
  }

  // tradução de um texto solto; devolve null se não houver
  function traduzTexto(pt, c){
    if (c === 'pt') return null;
    var d = dicionarios[c]; if (!d) return null;
    var limpo = pt.replace(/\s+/g, ' ').trim();
    if (!limpo) return null;
    var tr = (d.t && d.t[limpo]) || null;
    if (!tr) for (var i = 0; i < PADROES.length; i++) if (PADROES[i].re.test(limpo)) { tr = limpo.replace(PADROES[i].re, PADROES[i][c]); break; }
    if (!tr) return null;
    var ini = pt.match(/^\s*/)[0], fim = pt.match(/\s*$/)[0];
    return ini + tr + fim;
  }
  window.vectrumT = function(pt){ return traduzTexto(pt, atual) || pt; };
  window.vectrumIdioma = function(){ return info(atual); };

  /* ---------- aplicação ---------- */
  function aplicarBlocos(c){
    var d = dicionarios[c];
    var els = document.querySelectorAll('[data-i18n]');
    for (var i = 0; i < els.length; i++){
      var el = els[i];
      if (el.__pt === undefined) { el.__pt = el.innerHTML; el.__set = el.innerHTML; }
      // se o JavaScript da página trocou o conteúdo, quem cuida é a tradução por texto
      if (el.innerHTML !== el.__set) continue;
      var alvo = c === 'pt' ? el.__pt : (d && d.k && d.k[el.getAttribute('data-i18n')]) || el.__pt;
      if (alvo !== el.innerHTML) { el.innerHTML = alvo; }
      el.__set = el.innerHTML;
    }
    if (document.querySelector('title[data-i18n]')) document.title = document.querySelector('title').textContent;
  }
  function aplicarAtributos(c){
    var d = dicionarios[c];
    var els = document.querySelectorAll('[data-i18n-a]');
    for (var i = 0; i < els.length; i++){
      var el = els[i];
      if (!el.__pta) el.__pta = {};
      var pares = el.getAttribute('data-i18n-a').split(';');
      for (var j = 0; j < pares.length; j++){
        var p = pares[j].split(':'), at = p[0], k = p[1];
        if (el.__pta[at] === undefined) el.__pta[at] = el.getAttribute(at);
        var v = c === 'pt' ? el.__pta[at] : (d && d.k && d.k[k]) || el.__pta[at];
        if (v != null) el.setAttribute(at, v);
      }
    }
  }
  function ignorar(n){
    var p = n.parentNode;
    return !p || /^(SCRIPT|STYLE|NOSCRIPT|TEXTAREA)$/.test(p.nodeName);
  }
  function aplicarTextoNo(n, c){
    if (ignorar(n)) return;
    if (n.__pt === undefined || (n.nodeValue !== n.__set && n.nodeValue !== n.__pt)) { n.__pt = n.nodeValue; }
    var v = c === 'pt' ? n.__pt : (traduzTexto(n.__pt, c) || n.__pt);
    if (v !== n.nodeValue) n.nodeValue = v;
    n.__set = n.nodeValue;
  }
  function aplicarTextos(raizNo, c){
    if (raizNo.nodeType === 3) { aplicarTextoNo(raizNo, c); return; }
    var w = document.createTreeWalker(raizNo, NodeFilter.SHOW_TEXT, null);
    var n; while ((n = w.nextNode())) aplicarTextoNo(n, c);
  }
  function avisoLegal(c){
    var velho = document.getElementById('i18n-aviso-legal');
    if (velho) velho.parentNode.removeChild(velho);
    if (c === 'pt' || !document.body.hasAttribute('data-legal')) return;
    // entra logo abaixo do título da página (e do subtítulo, se houver)
    var ancora = document.querySelector('h1, h2');
    if (!ancora) return;
    if (ancora.nextElementSibling && ancora.nextElementSibling.tagName === 'P') ancora = ancora.nextElementSibling;
    var p = document.createElement('p');
    p.id = 'i18n-aviso-legal';
    p.className = 'i18n-aviso-legal';
    p.textContent = AVISO_LEGAL[c];
    ancora.parentNode.insertBefore(p, ancora.nextSibling);
  }

  var observador = null;
  function observar(){
    if (observador || !window.MutationObserver) return;
    observador = new MutationObserver(function(ms){
      if (atual === 'pt') return;
      for (var i = 0; i < ms.length; i++){
        var m = ms[i];
        if (m.type === 'characterData') { var n = m.target; if (n.nodeValue !== n.__set) { n.__pt = n.nodeValue; aplicarTextoNo(n, atual); } }
        else for (var j = 0; j < m.addedNodes.length; j++){
          var a = m.addedNodes[j];
          if (a.nodeType === 3) { a.__pt = a.nodeValue; aplicarTextoNo(a, atual); }
          else if (a.nodeType === 1 && !/^(SCRIPT|STYLE|IFRAME)$/.test(a.nodeName)) aplicarTextos(a, atual);
        }
      }
    });
    observador.observe(document.body, { childList: true, characterData: true, subtree: true });
  }

  function aplicar(c){
    atual = c;
    var i = info(c);
    aplicarBlocos(c);
    aplicarAtributos(c);
    aplicarTextos(document.body, c);
    avisoLegal(c);
    raiz.setAttribute('lang', i.html); // o widget de cotações escuta esta troca
    atualizarBotao();
    raiz.classList.remove('i18n-carregando');
  }

  function trocar(c){
    guardar(c);
    carregar(c).then(function(){ aplicar(c); }, function(){ aplicar('pt'); });
  }

  /* ---------- botão ---------- */
  var botao, menu, sigla, bandeira;
  function atualizarBotao(){
    if (!botao) return;
    var i = info(atual);
    sigla.textContent = i.sigla;
    if (bandeira) bandeira.innerHTML = BANDEIRA[i.c];
    botao.setAttribute('aria-label', ROTULO[atual] + ': ' + i.nome);
    botao.setAttribute('title', ROTULO[atual]);
    var itens = menu.querySelectorAll('[data-idioma]');
    for (var k = 0; k < itens.length; k++) itens[k].setAttribute('aria-checked', String(itens[k].getAttribute('data-idioma') === atual));
  }
  function abrir(sim){
    menu.hidden = !sim;
    botao.setAttribute('aria-expanded', String(sim));
    if (sim) { var marcado = menu.querySelector('[aria-checked="true"]') || menu.querySelector('[data-idioma]'); if (marcado) marcado.focus(); }
  }
  function montarBotao(){
    var caixa = document.getElementById('idioma');
    if (!caixa) return;
    botao = caixa.querySelector('.nav-idioma');
    menu = caixa.querySelector('.idioma-menu');
    sigla = caixa.querySelector('.idioma-sigla');
    // o globo do botão vira a bandeira do idioma escolhido
    var globo = botao.querySelector('svg:not(.idioma-seta)');
    if (globo) {
      bandeira = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      bandeira.setAttribute('class', 'idioma-bandeira');
      bandeira.setAttribute('viewBox', '0 0 30 20');
      bandeira.setAttribute('aria-hidden', 'true');
      globo.parentNode.replaceChild(bandeira, globo);
    }
    menu.innerHTML = IDIOMAS.map(function(i){
      return '<button type="button" role="menuitemradio" lang="' + i.html + '" data-idioma="' + i.c + '" aria-checked="false">' +
        '<svg class="im-bandeira" viewBox="0 0 30 20" aria-hidden="true">' + BANDEIRA[i.c] + '</svg><span class="im-nome">' + i.nome + '</span><span class="im-sigla">' + i.sigla + '</span></button>';
    }).join('');
    botao.addEventListener('click', function(e){ e.stopPropagation(); abrir(menu.hidden); });
    menu.addEventListener('click', function(e){
      var b = e.target.closest('[data-idioma]'); if (!b) return;
      abrir(false); botao.focus();
      var c = b.getAttribute('data-idioma'); if (c !== atual) trocar(c);
    });
    menu.addEventListener('keydown', function(e){
      var itens = Array.prototype.slice.call(menu.querySelectorAll('[data-idioma]'));
      var i = itens.indexOf(document.activeElement);
      if (e.key === 'ArrowDown') { e.preventDefault(); itens[(i + 1) % itens.length].focus(); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); itens[(i - 1 + itens.length) % itens.length].focus(); }
    });
    document.addEventListener('click', function(e){ if (!menu.hidden && !caixa.contains(e.target)) abrir(false); });
    document.addEventListener('keydown', function(e){ if (e.key === 'Escape' && !menu.hidden) { abrir(false); botao.focus(); } });
    atualizarBotao();
  }

  function iniciar(){
    montarBotao();
    observar();
    var salvo = ler();
    if (salvo && salvo !== 'pt' && info(salvo).c === salvo) trocar(salvo);
    else raiz.classList.remove('i18n-carregando');
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', iniciar); else iniciar();
  // se a rede falhar, a página nunca fica escondida
  setTimeout(function(){ raiz.classList.remove('i18n-carregando'); }, 2500);
})();
