/**
 * VECTRUM CAPITAL · recebe os formularios do site e grava na planilha.
 * Duas abas: "Clientes" (index.html e investir.html) e "Assessores" (assessor.html).
 * Instalacao passo a passo em LEIA-ME.md.
 *
 * Para arrumar a aparencia de uma aba que ja existe (titulos, larguras, cores):
 * escolha a funcao "organizarPlanilha" no topo do editor e clique em Executar.
 */

// cores dos grupos de colunas (cabecalho) e dos niveis de valor (verde: quanto mais escuro, maior)
var COR = {
  registro: '#4A5568', contato: '#1E5452', interesse: '#2F6F9F', teste: '#6B46C1',
  v5: ['#2E7D32', '#FFFFFF'], v4: ['#66BB6A', '#000000'], v3: ['#A5D6A7', '#000000'],
  v2: ['#C8E6C9', '#000000'], v1: ['#E8F5E9', '#000000'],
  empresa: ['#BBDEFB', '#000000'], neutro: ['#ECEFF1', '#000000'],
  alerta: ['#FFF3CD', '#000000'], laranja: ['#FFE0B2', '#000000'], ok: ['#DCEDC8', '#000000'],
  hoje: '#FFF9C4'
};

var ABAS = {
  cliente: {
    nome: 'Clientes',
    colunas: ['recebido_em', 'pagina', 'nome', 'email', 'telefone', 'faixa', 'conta_xp', 'assunto', 'aceite_lgpd'],
    titulos: ['Recebido em', 'Página', 'Nome', 'E-mail', 'Telefone', 'Valor disponível', 'Conta na XP', 'Assunto', 'Aceite LGPD'],
    larguras: [135, 95, 190, 240, 135, 175, 190, 330, 135],
    colNome: 3,
    // grupos de colunas: de, ate (contando de 1), cor do cabecalho
    grupos: [[1, 2, 'registro'], [3, 5, 'contato'], [6, 8, 'interesse'], [9, 9, 'registro']],
    notas: {
      1: 'Linhas com fundo amarelo claro = contatos recebidos hoje.',
      6: 'Faixa escolhida no formulario. Verde mais escuro = faixa maior. Azul = empresa. Cinza = ainda nao investe.',
      7: 'Amarelo = ainda nao tem conta na XP. Laranja = tem conta com outro escritorio. Verde = tem conta, sem assessoria.',
      9: 'Data e hora em que a pessoa marcou o aceite da LGPD.'
    },
    // regras de cor por valor exato: [coluna, texto, cor]
    regras: [
      [6, 'Acima de R$ 5 milhões', 'v5'], [6, 'R$ 1 milhão a R$ 5 milhões', 'v4'], [6, 'R$ 300 mil a R$ 1 milhão', 'v3'],
      [6, 'R$ 100 mil a R$ 300 mil', 'v2'], [6, 'Até R$ 100 mil', 'v1'], [6, 'Sou empresa', 'empresa'], [6, 'Ainda não invisto', 'neutro'],
      [7, 'Não tenho', 'alerta'], [7, 'Tenho, com outro escritório', 'laranja'], [7, 'Tenho, sem assessoria', 'ok'],
      [8, 'Quero atendimento para minha empresa', 'empresa']
    ]
  },
  assessor: {
    nome: 'Assessores',
    colunas: ['recebido_em', 'nome', 'email', 'telefone', 'onde', 'tempo_mercado', 'certificacao', 'carteira', 'trava', 'quando', 'aceite_lgpd'],
    titulos: ['Recebido em', 'Nome', 'E-mail', 'Telefone', 'Onde atua', 'Tempo de mercado', 'Certificação', 'Carteira', 'O que trava', 'Quando mudaria', 'Aceite LGPD'],
    larguras: [135, 190, 240, 135, 200, 150, 150, 190, 260, 200, 135],
    colNome: 2,
    grupos: [[1, 1, 'registro'], [2, 4, 'contato'], [5, 8, 'interesse'], [9, 10, 'teste'], [11, 11, 'registro']],
    notas: {
      1: 'Linhas com fundo amarelo claro = contatos recebidos hoje.',
      8: 'Carteira informada. Verde mais escuro = carteira maior.',
      9: 'As duas colunas roxas sao respostas do teste de seis perguntas do site.',
      11: 'Data e hora em que a pessoa marcou o aceite da LGPD.'
    },
    regras: [
      [8, 'Acima de R$ 200 milhões', 'v5'], [8, 'R$ 50 a 200 milhões', 'v4'], [8, 'R$ 10 a 50 milhões', 'v3'],
      [8, 'Até R$ 10 milhões', 'v2'], [8, 'Prefiro falar pessoalmente', 'empresa'], [8, 'Ainda não tenho carteira', 'neutro'],
      [7, 'Ainda não tenho', 'alerta']
    ]
  }
};

// e-mail que recebe o aviso de cada novo contato (deixe vazio para nao avisar)
var AVISAR = '';

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var dados = JSON.parse(e.postData.contents);
    var aba = ABAS[dados.tipo];
    if (!aba) return resposta({ ok: false, erro: 'tipo desconhecido' });
    if (!dados.nome || (!dados.email && !dados.telefone)) return resposta({ ok: false, erro: 'faltou contato' });

    var planilha = SpreadsheetApp.getActiveSpreadsheet();
    var folha = planilha.getSheetByName(aba.nome) || planilha.insertSheet(aba.nome);
    if (folha.getLastRow() === 0) {
      folha.appendRow(aba.titulos);
      arrumarAba(planilha, folha, aba);
    }

    dados.recebido_em = new Date();
    // data do aceite da LGPD como data de verdade (e nao texto "2026-10-20T18:12:17.000Z")
    if (dados.aceite_lgpd) {
      var aceite = new Date(dados.aceite_lgpd);
      if (!isNaN(aceite.getTime())) dados.aceite_lgpd = aceite;
    }
    var linha = aba.colunas.map(function (c) {
      var v = dados[c] === undefined ? '' : dados[c];
      // impede que texto comecando com = + - @ vire formula na planilha
      return (typeof v === 'string' && /^[=+\-@]/.test(v)) ? "'" + v : v;
    });
    folha.appendRow(linha);

    if (AVISAR) {
      // aviso enxuto: sem dados pessoais no e-mail, so o aviso e o link da planilha
      var quando = Utilities.formatDate(new Date(), 'America/Sao_Paulo', 'dd/MM/yyyy HH:mm');
      MailApp.sendEmail(AVISAR, 'Vectrum · novo contato pelo site (' + aba.nome + ')',
        'Chegou um novo contato pelo formulario do site (' + aba.nome + ') em ' + quando + '.\n\n' +
        'Abra a planilha para ver os dados e atender:\n' + planilha.getUrl() + '\n\n' +
        'Por seguranca, este aviso nao traz os dados da pessoa.',
        { name: 'Site Vectrum Capital' });
    }
    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

/** Titulos legiveis, larguras, cores por grupo e por valor, filtro e formato de data. Pode rodar quantas vezes quiser. */
function arrumarAba(planilha, folha, aba) {
  var n = aba.colunas.length;
  planilha.setSpreadsheetTimeZone('America/Sao_Paulo');
  var maxLinhas = Math.max(folha.getMaxRows() - 1, 1);

  // cabecalho: nomes legiveis, texto branco, uma cor por grupo de colunas, linha congelada
  var cab = folha.getRange(1, 1, 1, n);
  cab.setValues([aba.titulos]);
  cab.setFontWeight('bold').setFontColor('#FFFFFF').setVerticalAlignment('middle').setHorizontalAlignment('left');
  aba.grupos.forEach(function (g) {
    folha.getRange(1, g[0], 1, g[1] - g[0] + 1).setBackground(COR[g[2]]);
  });
  folha.setRowHeight(1, 36);
  folha.setFrozenRows(1);

  // larguras
  for (var i = 0; i < n; i++) folha.setColumnWidth(i + 1, aba.larguras[i]);

  // linhas: texto quebrando dentro da celula, alinhado ao topo; nome em destaque
  var corpo = folha.getRange(2, 1, maxLinhas, n);
  corpo.setWrapStrategy(SpreadsheetApp.WrapStrategy.WRAP).setVerticalAlignment('top');
  folha.getRange(2, aba.colNome, maxLinhas, 1).setFontWeight('bold'); // coluna Nome

  // datas em formato brasileiro (primeira e ultima colunas)
  folha.getRange(2, 1, maxLinhas, 1).setNumberFormat('dd/MM/yyyy HH:mm');
  folha.getRange(2, n, maxLinhas, 1).setNumberFormat('dd/MM/yyyy HH:mm');

  // linha mais forte entre os grupos de colunas, para separar "registro", "contato" e "interesse"
  aba.grupos.forEach(function (g) {
    folha.getRange(1, g[0], maxLinhas + 1, 1).setBorder(null, true, null, null, null, null, '#9AA5A3', SpreadsheetApp.BorderStyle.SOLID_MEDIUM);
  });

  // cores alternadas nas linhas (so se ainda nao houver)
  try {
    if (folha.getBandings().length === 0) {
      var faixa = folha.getRange(2, 1, maxLinhas, n).applyRowBanding(SpreadsheetApp.BandingTheme.LIGHT_GREY, false, false);
      faixa.setFirstRowColor('#FFFFFF').setSecondRowColor('#F4F7F6');
    }
  } catch (err) { /* sem faixas: segue sem */ }

  // cores por valor (regras especificas primeiro) e destaque dos contatos de hoje (por ultimo)
  var regras = aba.regras.map(function (r) {
    var cor = COR[r[2]];
    return SpreadsheetApp.newConditionalFormatRule()
      .whenTextEqualTo(r[1]).setBackground(cor[0]).setFontColor(cor[1])
      .setRanges([folha.getRange(2, r[0], maxLinhas, 1)]).build();
  });
  regras.push(SpreadsheetApp.newConditionalFormatRule()
    .whenFormulaSatisfied('=AND($A2<>"", INT($A2)=TODAY())').setBackground(COR.hoje)
    .setRanges([folha.getRange(2, 1, maxLinhas, n)]).build());
  folha.setConditionalFormatRules(regras);

  // notas explicando as cores (aparecem ao passar o mouse no titulo)
  Object.keys(aba.notas).forEach(function (c) { folha.getRange(1, Number(c)).setNote(aba.notas[c]); });

  // filtro no cabecalho, para ordenar e procurar. Nao recria se a aba ja tem segmentacoes
  // (o Google nao deixa filtro e segmentacao no mesmo intervalo, e criar o filtro derrubaria as segmentacoes).
  try {
    var temSegmentacao = typeof folha.getSlicers === 'function' && folha.getSlicers().length > 0;
    if (!temSegmentacao && !folha.getFilter()) folha.getRange(1, 1, folha.getMaxRows(), n).createFilter();
  } catch (err) { /* sem filtro: segue sem */ }
}

/** Cria (se faltar) e arruma todas as abas. Rodar uma vez pelo editor depois de atualizar o codigo. */
function organizarPlanilha() {
  var planilha = SpreadsheetApp.getActiveSpreadsheet();
  Object.keys(ABAS).forEach(function (k) {
    var aba = ABAS[k];
    var folha = planilha.getSheetByName(aba.nome) || planilha.insertSheet(aba.nome);
    if (folha.getLastRow() === 0) folha.appendRow(aba.titulos);
    arrumarAba(planilha, folha, aba);
  });
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
