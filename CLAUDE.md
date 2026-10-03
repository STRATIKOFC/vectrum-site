# CLAUDE.md · vectrum-site

## Visão geral
Site institucional da Vectrum (escritório de investimentos credenciado à XP), cliente da STRATIK.
- Cliente: Vectrum
- Responsável principal: Kawan (tecnologia)
- Produção: https://vectrumcapital.com.br (projeto Vercel `vectrum-capital`, time do HUNT)

## Stack
- HTML/CSS/JS estático, sem build. Cada página é um arquivo `.html` completo.
- Idiomas: `i18n/` (en, es, it, zh; o português está no próprio HTML). As bandeiras são SVG no objeto `BANDEIRA` do `i18n/i18n.js`.
- Formulários: Google Apps Script numa planilha da empresa (`planilha/LEIA-ME.md`).
- Hospedagem: Vercel. O `vercel.json` manda `noindex` em todas as páginas.

## Comandos
```bash
npx serve .                    # ver no computador (ou abrir o index.html)
vercel                         # publicar uma prévia
vercel --prod                  # publicar em produção (só depois do PR aprovado)
```

## Cuidados deste site
- **Mudou `i18n.js` ou `i18n.css`? Suba o `?v=` nos 7 HTML**, ou o navegador do visitante continua com a versão velha.
- **Domínio:** o e-mail da Vectrum roda no Microsoft 365 no mesmo domínio. **Nunca trocar os nameservers.** O DNS fica onde está, só com o registro `A → 76.76.21.21` no apex e no www.
- **O Fábio volta ao site quando acabar o garden leave** (data com a Victoria). O material está guardado no vault do Krawk (`08 - NEGÓCIOS/VECTRUM/_SITE/_FABIO — volta após garden leave/`).
- Texto formal: é empresa do mercado financeiro. Mudança de texto passa pela Victoria.
- Compliance (CVM/ANBIMA): não prometer rentabilidade, não usar linguagem de garantia.

## Nunca fazer
- **Nunca commitar `.env`, chaves de API, tokens ou senhas.**
- Nunca publicar em produção sem o PR aprovado.

## Git
- **Nunca trabalhar direto na `main`.** Branch `feature/…`, `fix/…` ou `docs/…` → Pull Request → revisão do outro sócio → merge.
- Commits: `feat:`, `fix:`, `docs:`, `chore:` + frase curta no presente.
