# Ligar os formulários do site na planilha

Tempo: 10 minutos. Precisa ser feito **na conta Google da empresa**, não na conta pessoal de um sócio (a planilha guarda dados pessoais, é ativo da casa).

1. Criar uma planilha nova no Google Drive da empresa. Nome sugerido: `Vectrum · Contatos do site`
2. Na planilha: **Extensões > Apps Script**
3. Apagar o conteúdo e colar o arquivo `Code.gs` desta pasta. Salvar
4. Opcional: preencher `AVISAR` com o e-mail que deve receber aviso de cada contato novo
5. **Implantar > Nova implantação** > tipo **App da Web**
   - Executar como: **Eu**
   - Quem pode acessar: **Qualquer pessoa**
6. Autorizar o acesso quando o Google pedir
7. Copiar o endereço que termina em `/exec`
8. Colar esse endereço em `PLANILHA_URL` nas três páginas: `index.html`, `investir.html` e `assessor.html`
9. Publicar o site e mandar um contato de teste por cada formulário

As abas **Clientes** e **Assessores** são criadas sozinhas no primeiro envio de cada tipo.

## O que chega em cada aba

**Clientes:** data, página de origem, nome, e-mail, telefone, faixa, conta XP, assunto, data e hora do aceite LGPD.

**Assessores:** data, página, nome, e-mail, telefone, onde atua, certificação, carteira, e as respostas do teste (porta, tempo de mercado, o que trava, quando mudaria), mais o aceite LGPD.

## Cuidados

- O prazo de guarda dos contatos que não viram atendimento precisa ser definido e escrito na Política de Privacidade (campo entre colchetes na seção 06)
- Só quem atende deve ter acesso à planilha
