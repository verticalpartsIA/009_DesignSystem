# Tela de Entrada + Atualizações

Este documento é a especificação de dois padrões que devem ser replicados em
**todo** sistema novo da VerticalParts a partir deste design system. Já foram
implementados e testados em produção em três sistemas reais (`005_vpclick`,
`010_GestaoImportacao`, `003_requisicoes`) — o que está aqui é a versão
consolidada, com os bugs reais encontrados nessas implementações já
corrigidos. Se você é uma IA lendo isto para construir um projeto novo, siga
as instruções ao pé da letra; as seções "⚠️ Lição aprendida" documentam por
que cada detalhe existe, pra você não reintroduzir o mesmo bug.

O vídeo da marca usado na Parte 1 está neste mesmo diretório:
**`tela de entrada/boot-video.mp4`**. Copie esse arquivo para dentro do
projeto novo (`public/boot-video.mp4` num app Vite, ou equivalente na stack
usada) — não gere um vídeo novo.

---

## 1. Quando usar cada parte

Este design system já pergunta, antes de qualquer código (ver `CLAUDE.md` /
`README.md`, seção "este site vai ter card no vpsistema.com?"), se o projeto
novo é **SSO/card no vpsistema** ou **endereço próprio**. A resposta decide
a Parte 1:

| | Tela de Entrada (Parte 1) | Aviso de Atualização (Parte 2) |
|---|---|---|
| **SIM — card no vpsistema (SSO)** | **Usar.** Substitui o spinner genérico durante o `loading` do `AuthProvider` — é a primeira coisa que o colaborador vê depois de clicar no card. | Usar. |
| **NÃO — endereço próprio** | **Não usar.** O projeto já tem tela de login própria (`LoginPage.tsx`, já neste repositório) — é ela que resolve a primeira tela. | Usar. |

Ou seja: **a Parte 2 (aviso de atualização) é obrigatória em qualquer
projeto**, tenha ele tela de login própria ou não. A Parte 1 (tela de
entrada com vídeo) só entra quando o acesso é 100% via SSO do vpsistema —
nesses casos não existe formulário de login algum no dia a dia, então o
momento de "carregando" merece a marca em vez de um spinner cru.

---

## 2. Parte 1 — Tela de Entrada

### O que é

Uma tela branca/clara, mostrada enquanto o `AuthProvider` valida a sessão
(`loading === true` em `src/lib/auth.tsx` deste template), com:

1. Uma tagline curta acima do vídeo (ex.: "Gestão de Tarefas", "Bem-vindo ao
   Portal", "Requisições" — uma frase de 1 a 3 palavras descrevendo o
   sistema).
2. O vídeo da marca (`boot-video.mp4`), tocando automaticamente, sem som.
3. Abaixo do vídeo, em amarelo (`primary` — `#F5C400` nos tokens deste
   design system) e fonte Poppins peso leve (300): o nome do produto ou o
   domínio (ex.: "VPCLICK", "portal.vpsistema.com").
4. Um spinner discreto + "Carregando..." embaixo de tudo.

A tela só desaparece quando **o vídeo termina de tocar OU 12 segundos se
passam** (o que vier primeiro) **E** o `loading` do `AuthProvider` já
terminou. As duas condições precisam ser verdadeiras — se a validação da
sessão for mais rápida que o vídeo, ainda assim espera o vídeo (até o limite
de 12s) pra dar tempo do colaborador ver a marca; se a rede estiver lenta,
não trava esperando o vídeo pra sempre.

### ⚠️ Lição aprendida — por que fundo branco, não transparente

A primeira tentativa em `005_vpclick` foi pedir um vídeo com fundo
transparente pra sobrepor num fundo escuro da marca. **Isso não funciona:**
MP4/H.264 (o formato que qualquer gerador de vídeo por IA entrega, e o único
com suporte universal em navegador) **não tem canal alfa** — não existe
"fundo transparente" real nesse formato. Quando se pede isso a um gerador de
vídeo, o resultado é um chroma-key/checkerboard **cravado nos pixels**, não
transparência de verdade. A solução foi inverter a ideia: gerar/usar um
vídeo com fundo **claro** (branco/cinza clarinho) e colocar a tela de
entrada inteira sobre fundo claro, não escuro. `boot-video.mp4` já é esse
vídeo — não tente trocá-lo por um "transparente".

### Código — projeto Vite + React (como este template)

Adaptar o componente que hoje mostra o spinner de loading (normalmente em
`App.tsx`, no ponto que verifica `loading` do `useAuth()`):

```tsx
import { useState, useEffect } from 'react'
import { useAuth } from '@/lib/auth'

function EntryScreen() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-white px-4">
      <div className="text-center">
        <p className="mb-3 text-sm font-bold uppercase tracking-widest text-slate-500">
          {/* TODO: tagline curta do produto, ex. "Gestão de Tarefas" */}
        </p>
        <video
          src="/boot-video.mp4"
          autoPlay
          muted
          playsInline
          onEnded={() => setBootVideoEnded(true)}
          onError={() => setBootVideoEnded(true)}
          className="mx-auto w-full max-w-sm rounded-xl shadow-lg shadow-slate-200"
        />
        <p
          className="mt-4 text-2xl font-light tracking-wide text-primary"
          style={{ fontFamily: 'Poppins, sans-serif' }}
        >
          {/* TODO: nome do produto ou domínio, ex. "VPCLICK" */}
        </p>
        <div className="mt-4 flex items-center justify-center gap-2">
          <div className="h-4 w-4 animate-spin rounded-full border-2 border-primary/30 border-t-primary" />
          <p className="text-xs text-slate-400">Carregando...</p>
        </div>
      </div>
    </div>
  )
}

export function ProtectedApp({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth()
  const [bootVideoEnded, setBootVideoEnded] = useState(false)

  useEffect(() => {
    const fallback = setTimeout(() => setBootVideoEnded(true), 12000)
    return () => clearTimeout(fallback)
  }, [])

  if (loading || !bootVideoEnded) return <EntryScreen />

  return <>{children}</>
}
```

(O `setBootVideoEnded` precisa estar no componente pai que engloba o
`<video>` — ajuste o exemplo acima pra sua estrutura real de componentes;
o ponto importante é o `useState`/`useEffect` do timeout de 12s e o
`onEnded`/`onError` no `<video>`.)

### Adaptação a outras stacks (fora deste template)

Nem todo sistema VerticalParts é Vite + React puro. Lições reais de outras
duas implementações:

- **App sem build (HTML/JS puro servido por Express, React via CDN/UMD)**:
  a tela de entrada vira um `<div>` estático já no `index.html`, escondido
  só depois que o app real montar — a lógica de "espera o vídeo ou 12s" fica
  num pequeno script vanilla (`addEventListener('ended', ...)` /
  `setTimeout`) em vez de `useState`/`useEffect`.
- **App SSR (ex. TanStack Start)**: o ponto de inserção é o mesmo — onde
  hoje existe um spinner de `isLoading`/`loading` antes de decidir se
  mostra login ou o app — só que a lógica do vídeo é client-only (roda
  dentro do componente de loading normalmente, sem preocupação extra de
  SSR, já que esse trecho só aparece no browser mesmo).

O conceito é sempre o mesmo independente da stack: **substituir o ponto
onde hoje existe um spinner genérico de "carregando/validando sessão" por
esta tela**, nunca criar uma rota nova só pra ela.

---

## 3. Parte 2 — Aviso de Atualização

### O problema que isso resolve

Deploy de SPA (Vite ou qualquer stack sem invalidação de CDN) sobrescreve os
arquivos direto no servidor. Uma aba que já estava aberta antes de um deploy
continua rodando o JS antigo — possivelmente por horas — até alguém
recarregar a página. A solução: cada aba compara periodicamente a versão
que está rodando com a versão publicada no servidor, e avisa quando são
diferentes.

**Importante:** isso **não** deve recarregar a página sozinho, sem avisar —
a pessoa pode estar no meio de algo. Mostra um aviso com botão; quem quiser
continua trabalhando e atualiza quando quiser.

### 3.1 Gerar a versão publicada (`version.json` + build-time embutido)

**Projeto Vite (como este template)** — em `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import { writeFileSync } from 'node:fs'
import { execSync } from 'node:child_process'

const buildTime = new Date().toISOString()
const commit = process.env.GITHUB_SHA || execSync('git rev-parse HEAD').toString().trim()

export default defineConfig({
  // ...resto da config...
  define: {
    __APP_BUILD_TIME__: JSON.stringify(buildTime),
  },
  plugins: [
    // ...outros plugins...
    {
      name: 'write-version-file',
      writeBundle(options) {
        writeFileSync(`${options.dir}/version.json`, JSON.stringify({ buildTime, commit }))
      },
    },
  ],
})
```

E em `src/vite-env.d.ts` (ou equivalente): `declare const __APP_BUILD_TIME__: string`.

### ⚠️ Lição aprendida — não confie num workflow "redundante" pra gerar isso

Em `010_GestaoImportacao` o `version.json` era gerado só dentro de um
workflow de deploy via SSH que **não era o mecanismo real de deploy**
(o deploy real era git-pull automático de outra integração) — resultado:
o arquivo nunca existia em produção, o catch-all de rota servia o
`index.html` no lugar, e o aviso nunca disparava. **Sempre confirme qual é
o mecanismo de deploy real antes de decidir onde gerar o `version.json`.**
Se não houver etapa de build nenhuma em produção (app servido direto, sem
`npm run build`), gere a versão **ao vivo, lendo o HEAD do git no próprio
servidor** a cada request (com um cache curto de ~30s), em vez de depender
de um arquivo pré-gerado:

```js
// server.js (Node/Express, sem build step)
const { execSync } = require('node:child_process')
let versionCache = null, versionCacheAt = 0
function readVersionInfo() {
  const now = Date.now()
  if (versionCache && now - versionCacheAt < 30_000) return versionCache
  versionCache = {
    buildTime: execSync('git log -1 --format=%cI', { cwd: __dirname }).toString().trim(),
    commit: execSync('git rev-parse HEAD', { cwd: __dirname }).toString().trim(),
  }
  versionCacheAt = now
  return versionCache
}
app.get('/version.json', (_req, res) => {
  res.setHeader('Cache-Control', 'no-cache')
  res.json(readVersionInfo())
})
```

### 3.2 O aviso (toast)

Usa [`sonner`](https://sonner.emilkowal.ski/) (`npm install sonner`) — não
está nas dependências deste template, adicione ao criar o projeto. Monte
`<Toaster />` uma vez na raiz do app (ex. `App.tsx`).

`src/lib/versionCheck.ts`:

```ts
import { toast } from 'sonner'

const CHECK_INTERVAL_MS = 5 * 60 * 1000
const FIRST_CHECK_DELAY_MS = 15 * 1000
const NOTIFIED_BUILD_KEY = 'vp_version_notified_build'

interface VersionInfo { buildTime: string; commit: string }

function alreadyNotified(buildTime: string): boolean {
  try { return localStorage.getItem(NOTIFIED_BUILD_KEY) === buildTime } catch { return false }
}
function markNotified(buildTime: string): void {
  try { localStorage.setItem(NOTIFIED_BUILD_KEY, buildTime) } catch { /* modo privado etc. */ }
}

function formatUpdateMessage(buildTime: string): string {
  const d = new Date(buildTime)
  if (isNaN(d.getTime())) return 'Este site foi atualizado.'
  const date = d.toLocaleDateString('pt-BR')
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `Este site foi atualizado em ${date} às ${time}h`
}

// Usado também pelo rodapé da Sidebar — ver seção 3.3.
export function formatBuildTimeShort(buildTime: string): string | null {
  const d = new Date(buildTime)
  if (isNaN(d.getTime())) return null
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: '2-digit' })
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
  return `${date} ${time}h`
}

export function startVersionCheck(): () => void {
  let notified = false
  const currentBuildTime = __APP_BUILD_TIME__

  const check = async () => {
    if (notified) return
    try {
      const res = await fetch(`/version.json?t=${Date.now()}`, { cache: 'no-store' })
      if (!res.ok) return
      const info: VersionInfo = await res.json()
      if (info.buildTime && info.buildTime !== currentBuildTime) {
        if (alreadyNotified(info.buildTime)) { notified = true; return }
        notified = true
        markNotified(info.buildTime)
        toast.message(formatUpdateMessage(info.buildTime), {
          description: 'Atualize a página para usar a versão mais recente.',
          duration: Infinity,
          action: { label: 'Atualizar agora', onClick: () => window.location.reload() },
        })
      }
    } catch { /* rede instável — tenta de novo no próximo ciclo */ }
  }

  const firstCheckTimer = setTimeout(check, FIRST_CHECK_DELAY_MS)
  const interval = setInterval(check, CHECK_INTERVAL_MS)
  const onVisibilityChange = () => { if (document.visibilityState === 'visible') check() }
  document.addEventListener('visibilitychange', onVisibilityChange)
  window.addEventListener('online', check)

  return () => {
    clearTimeout(firstCheckTimer)
    clearInterval(interval)
    document.removeEventListener('visibilitychange', onVisibilityChange)
    window.removeEventListener('online', check)
  }
}
```

Chamar uma vez, perto da raiz do app:

```tsx
useEffect(() => startVersionCheck(), [])
```

### ⚠️ Lição aprendida — sem isso, o aviso "loopa"

O guard `notified` vive só na memória de cada aba. Quem tem mais de uma aba
do site aberta vê **o mesmo aviso, com o mesmo horário**, repetir conforme
alterna entre elas — cada aba roda sua própria checagem contra o mesmo
`version.json` e não sabe que outra aba já mostrou. É por isso que o código
acima grava no `localStorage` (compartilhado entre abas da mesma origem)
qual `buildTime` já foi avisado, antes de mostrar o toast — **não remova
essa checagem achando que é redundante com o `notified` em memória.**

### 3.3 "Última atualização" no rodapé da Sidebar

Além do aviso pontual, a Sidebar (`src/components/app/Sidebar.tsx` deste
template) deve mostrar, no rodapé — junto do cartão do usuário/botão de
sair — a data/hora do build **desta aba** (não busca nada, usa o valor já
embutido no bundle):

```tsx
import { formatBuildTimeShort } from '@/lib/versionCheck'

// dentro do <div className="border-t ..."> do rodapé, depois do UserBadge/botão de sair:
{formatBuildTimeShort(__APP_BUILD_TIME__) && (
  <p className="text-center text-[10px] text-slate-600">
    Última atualização: {formatBuildTimeShort(__APP_BUILD_TIME__)}
  </p>
)}
```

Formato do texto: **"Última atualização: DD/MM/AA HH:MMh"** — sempre esse
texto exato, é o padrão adotado nos três sistemas de referência.

---

## 4. Checklist ao criar um projeto novo

- [ ] Perguntou ao usuário: card no vpsistema (SSO) ou endereço próprio? (ver `CLAUDE.md`)
- [ ] Se SSO → implementou a Tela de Entrada (Parte 1) no ponto de `loading` do `AuthProvider`, com `boot-video.mp4` copiado pro projeto.
- [ ] Tagline e texto abaixo do vídeo customizados pro produto (nunca deixar genérico "VP" nem copiar literalmente o texto de outro sistema).
- [ ] Se endereço próprio → **não** criou tela de entrada; login normal (`LoginPage.tsx`) resolve a primeira tela.
- [ ] Implementou o Aviso de Atualização (Parte 2) — **sempre**, independente da resposta da Parte 1.
- [ ] Confirmou qual é o mecanismo de deploy real antes de decidir onde gerar `version.json` (build step vs. leitura ao vivo do git).
- [ ] `localStorage` dedup incluído no `versionCheck.ts` (evita o aviso "loopar" entre abas).
- [ ] Linha "Última atualização: DD/MM/AA HH:MMh" no rodapé da Sidebar.
