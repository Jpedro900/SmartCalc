#!/usr/bin/env bash
set -euo pipefail

AUTHOR_NAME="João Pedro Cavalcante de Souza"
AUTHOR_EMAIL="jpedro.cs09@gmail.com"

FRI="2025-08-29"
MON="2025-09-01"
TUE="2025-09-02"

if [ -d .git ]; then
  echo "Já existe um repositório Git aqui. Remova .git para reescrever o histórico."
  exit 1
fi

git init
git config user.name  "$AUTHOR_NAME"
git config user.email "$AUTHOR_EMAIL"

commit() {
  local day="$1"; local time="$2"; local msg="$3"
  if git diff --cached --quiet; then
    echo "(skip commit vazio) $msg"
    return 0
  fi
  GIT_AUTHOR_DATE="${day} ${time}" GIT_COMMITTER_DATE="${day} ${time}" \
    git commit -m "$msg" --date "${day} ${time}"
}

safe_add() {
  local any=0
  for p in "$@"; do
    shopt -s nullglob
    matches=($p)
    shopt -u nullglob
    if [ ${#matches[@]} -gt 0 ]; then
      git add "${matches[@]}"
      any=1
    fi
  done
  return 0
}


echo -e "node_modules/\n.next/\n.out/\n.turbo/\n.DS_Store\n*.log\n.env*\npublic/flags.zip" > .gitignore

cat > README.md <<'MD'
# SmartCalc (beta)
Hub de calculadoras online (Next.js + React + Tailwind).
Inclui: Porcentagem, Juros Compostos, Regra de 3 (simples/composta),
IMC, Conversor de Moedas, Idade, Área/Volume e Unidades.
MD

echo "MIT" > LICENSE

safe_add .gitignore README.md LICENSE
commit "$FRI" "09:18:00" "chore: inicia projeto, .gitignore, README e LICENSE"

safe_add package*.json next.config.* postcss.config.* tailwind.config.* tsconfig*.json
safe_add public/favicon.ico public/robots.txt
safe_add src/app/globals.css src/app/layout.tsx src/app/page.tsx
commit "$FRI" "10:02:00" "build: estrutura Next.js (App Router) e Tailwind; estilos globais"

safe_add src/components/Navbar.tsx src/components/Footer.tsx src/components/Tabs.tsx src/components/CardLink.tsx
safe_add src/app/layout.tsx
commit "$FRI" "11:12:00" "feat(ui): Navbar, Footer, Tabs e CardLink; integra no layout"

safe_add src/app/page.tsx
commit "$FRI" "12:05:00" "feat(home): landing clara/azulada, foco em usabilidade e navegação"

safe_add src/app/calculators/percentage/page.tsx
commit "$FRI" "15:11:00" "feat(percent): 4 modos (quanto é %, qual % de, aumento e diminuição); validação e limpar"

safe_add src/app/calculators/juros/page.tsx src/app/calculators/juros/JurosClient.tsx
commit "$FRI" "16:32:00" "feat(juros): simulador com gráfico (Recharts), tabela mensal e resumo"

safe_add src/app/calculators/regra-de-3/page.tsx src/app/calculators/regra-de-3/RegraDe3Client.tsx
commit "$MON" "10:40:00" "feat(regra3): simples e composta; direção direta/inversa e fórmula automática"

safe_add public/silhuetta-*.jpg
safe_add src/app/calculators/imc/page.tsx src/app/calculators/imc/IMCClient.tsx
commit "$MON" "15:05:00" "feat(imc): seleção de sexo, silhuetas por faixa de IMC e cálculo de peso ideal"

safe_add src/app/calculators/moedas/page.tsx src/app/calculators/moedas/MoedasClient.tsx src/components/SwapArrows.tsx
commit "$MON" "17:30:00" "feat(moedas): layout estilo Google, chips populares, swap e botão Converter"

safe_add src/app/calculators/moedas/MoedasClient.tsx
commit "$TUE" "11:08:00" "feat(moedas): exchangerate.host + frankfurter (fallback) e CoinGecko (BTC/ETH)"

safe_add public/bitcoin-logo.png public/Ethereum-Logo.png
commit "$TUE" "13:45:00" "assets: adiciona logos de BTC e ETH"

safe_add public/flags/*.svg
safe_add src/app/calculators/moedas/MoedasClient.tsx
commit "$TUE" "15:50:00" "feat(flags): seletor com bandeira + rótulo 'PAÍS (MOEDA Nome)'; inclui SVGs em public/flags"

safe_add eslint.config.mjs next-env.d.ts
safe_add src/app/robots.ts src/app/sitemap.ts
safe_add src/**/*.tsx
commit "$TUE" "16:40:00" "chore: ESLint + rotas SEO (robots/sitemap) e pequenos ajustes TS"

safe_add src/app/calculators/idade/page.tsx src/app/calculators/area-volume/page.tsx src/app/calculators/area-volume/AreaVolumeClient.tsx src/app/calculators/unidades/page.tsx
commit "$TUE" "17:30:00" "feat(extra): Idade, Área/Volume e Unidades (esqueleto inicial)"

git add -A || true
commit "$TUE" "18:12:00" "chore: varredura final do beta — versiona pendências e suporte"

echo
echo "Histórico criado com sucesso!"
echo "Se quiser renomear para 'main':  git branch -m main"
echo "Conecte ao GitHub:"
echo "  git remote add origin https://github.com/<seu-usuario>/<seu-repo>.git"
echo "  git push --all -u origin"
