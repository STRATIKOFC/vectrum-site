/**
 * VECTRUM CAPITAL · recebe os formularios do site e grava na planilha.
 * Duas abas: "Clientes" (index.html e investir.html) e "Assessores" (assessor.html).
 * Instalacao passo a passo em LEIA-ME.md.
 */

var ABAS = {
  cliente: {
    nome: 'Clientes',
    colunas: ['recebido_em', 'pagina', 'nome', 'email', 'telefone', 'faixa', 'conta_xp', 'assunto', 'aceite_lgpd']
  },
  assessor: {
    nome: 'Assessores',
    colunas: ['recebido_em', 'pagina', 'nome', 'email', 'telefone', 'onde', 'certificacao', 'carteira', 'porta', 'tempo_mercado', 'trava', 'quando', 'aceite_lgpd']
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
      folha.appendRow(aba.colunas);
      folha.setFrozenRows(1);
      folha.getRange(1, 1, 1, aba.colunas.length).setFontWeight('bold');
    }

    dados.recebido_em = new Date();
    var linha = aba.colunas.map(function (c) {
      var v = dados[c] === undefined ? '' : dados[c];
      // impede que texto comecando com = + - @ vire formula na planilha
      return (typeof v === 'string' && /^[=+\-@]/.test(v)) ? "'" + v : v;
    });
    folha.appendRow(linha);

    if (AVISAR) {
      MailApp.sendEmail(AVISAR, 'Site Vectrum · novo contato (' + aba.nome + ')',
        aba.colunas.map(function (c, i) { return c + ': ' + linha[i]; }).join('\n'));
    }
    return resposta({ ok: true });
  } catch (err) {
    return resposta({ ok: false, erro: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function resposta(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}
