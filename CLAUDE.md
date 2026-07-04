# Instruções para IA — VP Design System

## ⚠️ Pergunta obrigatória antes de iniciar qualquer projeto novo

Antes de começar a construir um sistema novo a partir deste template, você **DEVE perguntar ao usuário**:

> "Este novo site vai precisar de um card em vpsistema.com (o usuário entra pelo vpsistema.com, vê o card do sistema e clica para acessar direto na solução via SSO) ou vai ter endereço próprio (o usuário acessa direto, sem passar pelo vpsistema)?"

Não assuma a resposta com base no tipo de sistema, no departamento ou em qualquer outro sinal indireto. Não prossiga com a arquitetura de autenticação/roteamento enquanto essa resposta não vier do usuário.

---

## Se a resposta for SIM — site aninhado no vpsistema

O site fica "pendurado" no vpsistema.com. O usuário sempre entra por lá primeiro, vê o card correspondente e clica para cair direto no sistema.

- O login principal passa a ser o **SSO automático**: o vpsistema injeta `?sso_token=...&sso_refresh=...` na URL do novo site ao clicar no card. Este template já trata isso pronto em `src/lib/auth.tsx` → `signInWithSSO()` e em `LoginPage.tsx` (detecção automática dos parâmetros).
- É necessário cadastrar o novo site como card na tabela `modules` do Supabase do **vpsistema** (projeto `ubdkoqxfwcraftesgmbw`, repo `001_vpsistema`):
  ```sql
  INSERT INTO modules (slug, name, description, url, icon, color, sort_order, is_active)
  VALUES (
    'novo-slug',
    'Nome do Sistema',
    'Descrição breve exibida no card',
    'https://novosite.vpsistema.com',
    'IconeLucide',
    '#HEXCOLOR',
    N,
    true
  );
  ```
  (ver lista de ícones Lucide disponíveis e exemplos completos no README do `001_vpsistema`)
- O domínio do novo site deve estar sob `*.vpsistema.com` (ou `*.verticalparts.com`) — são os domínios com SSO habilitado.
- A tela de login por email/senha continua existindo como fallback, mas o fluxo esperado no dia a dia é sempre entrar via card no vpsistema.

## Se a resposta for NÃO — site com endereço próprio

O site **não** aparece no vpsistema. O usuário acessa direto pela URL do sistema, sem passar por vpsistema.com.

- **Não** criar/inserir linha na tabela `modules` do vpsistema para esse site.
- O login é 100% via email/senha (`signIn()` em `src/lib/auth.tsx`), sem depender de `signInWithSSO()`.
- A identidade visual (cores, tipografia, componentes deste template) continua sendo usada normalmente — a decisão SIM/NÃO afeta **apenas** o modelo de acesso/autenticação, nunca a base visual.

---

## Por que essa pergunta importa

Pular essa pergunta gera dois tipos de erro: cards cadastrados no vpsistema para sistemas que na prática são acessados direto (card fantasma, ninguém usa), ou sistemas que deveriam ter SSO centralizado mas acabam exigindo login duplicado do colaborador. A resposta muda a arquitetura de autenticação do projeto desde o início — por isso a pergunta vem antes de qualquer código, não depois.
