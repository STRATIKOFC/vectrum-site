"""Confere se o site no ar (vectrumcapital.com.br) é IGUAL ao repositório (origin/main).

Rode ANTES de publicar (para saber se a produção está à frente do repo, como aconteceu em 12/10)
e DEPOIS de publicar (para ver se nada sumiu).

    python scripts/verificar-site-no-ar.py                 (de dentro do repo vectrum-site)
    python verificar-site-no-ar.py C:\\caminho\\vectrum-site  (de qualquer lugar)

Só lê: não publica nem altera nada. Precisa de git e acesso à internet.
"""
import os
import subprocess
import sys
import urllib.parse
import urllib.request

SITE = 'https://vectrumcapital.com.br/'
FORA_DO_AR = {'CLAUDE.md', '.gitignore', '.vercelignore', 'vercel.json'}  # configuração/documentação, não é servida


def achar_repo():
    if len(sys.argv) > 1:
        return sys.argv[1]
    aqui = os.path.dirname(os.path.abspath(__file__))
    # o script mora em <repo>/scripts/ ou na raiz do repo
    for candidato in (os.path.dirname(aqui), aqui):
        if os.path.isdir(os.path.join(candidato, '.git')):
            return candidato
    sys.exit('Não achei o repo. Passe o caminho: python verificar-site-no-ar.py C:\\caminho\\vectrum-site')


REPO = achar_repo()


def git(*args):
    return subprocess.run(['git', '-C', REPO] + list(args), capture_output=True).stdout


def main():
    git('fetch', '-q', '--all')
    caminho_ignore = os.path.join(REPO, '.vercelignore')
    ignorados = set(open(caminho_ignore, encoding='utf-8').read().split()) if os.path.exists(caminho_ignore) else set()
    arquivos = git('ls-tree', '-r', '--name-only', 'origin/main').decode('utf-8').splitlines()
    print('origin/main =', git('rev-parse', '--short', 'origin/main').decode().strip())
    iguais, diferentes, ausentes = 0, [], []
    for f in arquivos:
        if f.split('/')[0] in ignorados or f in FORA_DO_AR:
            continue
        esperado = git('show', 'origin/main:' + f)
        req = urllib.request.Request(SITE + urllib.parse.quote(f), headers={'User-Agent': 'Mozilla/5.0', 'Cache-Control': 'no-cache'})
        try:
            no_ar = urllib.request.urlopen(req, timeout=60).read()
        except Exception as e:  # noqa: BLE001
            ausentes.append((f, str(e)[:50]))
            continue
        if no_ar.replace(b'\r\n', b'\n') == esperado.replace(b'\r\n', b'\n'):
            iguais += 1
        else:
            diferentes.append((f, len(esperado), len(no_ar)))
    print(f'iguais: {iguais} | diferentes: {len(diferentes)} | ausentes no ar: {len(ausentes)}')
    for f, a, b in diferentes:
        print(f'  DIFERENTE: {f} (repo {a} bytes, no ar {b} bytes)')
    for f, e in ausentes:
        print(f'  AUSENTE NO AR: {f} ({e})')
    ok = not diferentes and not ausentes
    print('RESULTADO:', 'OK, site no ar = repositório' if ok else 'ATENÇÃO: há diferenças, não publique antes de entender')
    return 0 if ok else 1


if __name__ == '__main__':
    sys.exit(main())
