# Instruções para IA — VP Design System

## ⚠️ Pergunta obrigatória antes de iniciar qualquer projeto novo

Antes de começar a construir um sistema novo a partir deste template, você **DEVE perguntar ao usuário**:

> "Este novo site vai precisar de um card em vpsistema.com (o usuário entra pelo vpsistema.com, vê o card do sistema e clica para acessar direto na solução via SSO) ou vai ter endereço próprio (o usuário acessa direto, sem passar pelo vpsistema)?"

Não assuma a resposta com base no tipo de sistema, no departamento ou em qualquer outro sinal indireto. Não prossiga com a arquitetura de autenticação/roteamento enquanto essa resposta não vier do usuário.

---

## 🔑 Em qualquer um dos dois casos: o Supabase de usuários é sempre o mesmo

Independente da resposta (card no vpsistema ou endereço próprio), **todo projeto novo usa o mesmo projeto Supabase para autenticação/usuários**:

```
https://ubdkoqxfwcraftesgmbw.supabase.co
```

**Por quê:** quem cadastra colaboradores da VerticalParts é sempre o `001_vpsistema` — é lá que o Administrador convida um novo usuário (tela Admin → "+ Convidar" → Edge Function `invite-user`), que cria o registro no Supabase Auth **e** na tabela `profiles` desse projeto único. Não existe fluxo paralelo de cadastro de usuário em cada sistema. Logo, seja o novo site aninhado via SSO ou com endereço próprio, os colaboradores que vão logar nele já existem (ou serão criados via convite do vpsistema) nesse mesmo Supabase — nunca em um projeto Supabase de usuários próprio do novo sistema.

Na prática, o `.env` de **qualquer** projeto criado a partir deste template aponta para esse projeto:
```
VITE_SUPABASE_URL=https://ubdkoqxfwcraftesgmbw.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key do vpsistema — ver .env.example>
```

Isso vale tanto para o fluxo SSO quanto para o login direto por email/senha — nos dois casos é a mesma tabela `profiles` / mesmo Supabase Auth sendo consultado. Se o novo sistema precisar de tabelas de **dados de negócio** próprias (não relacionadas a identidade de usuário), essas sim podem viver em outro projeto Supabase dedicado — mas autenticação e cadastro de colaborador são sempre centralizados no Supabase do vpsistema.

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
- O login é 100% via email/senha (`signIn()` em `src/lib/auth.tsx`), sem depender de `signInWithSSO()` — mas ainda contra o **mesmo** Supabase `ubdkoqxfwcraftesgmbw` (ver seção acima), já que o usuário já existe lá.
- A identidade visual (cores, tipografia, componentes deste template) continua sendo usada normalmente — a decisão SIM/NÃO afeta **apenas** o modelo de acesso (SSO automático vs. login manual), nunca a base visual nem a base de usuários.

---

## Por que essa pergunta importa

Pular essa pergunta gera dois tipos de erro: cards cadastrados no vpsistema para sistemas que na prática são acessados direto (card fantasma, ninguém usa), ou sistemas que deveriam ter SSO centralizado mas acabam exigindo login duplicado do colaborador. A resposta muda a arquitetura de autenticação do projeto desde o início — por isso a pergunta vem antes de qualquer código, não depois.
