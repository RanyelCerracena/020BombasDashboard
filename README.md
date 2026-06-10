# 020Dashboard

This template should help get you started developing with Vue 3 in Vite.

## Recommended IDE Setup

[VS Code](https://code.visualstudio.com/) + [Vue (Official)](https://marketplace.visualstudio.com/items?itemName=Vue.volar) (and disable Vetur).

## Recommended Browser Setup

- Chromium-based browsers (Chrome, Edge, Brave, etc.):
  - [Vue.js devtools](https://chromewebstore.google.com/detail/vuejs-devtools/nhdogjmejiglipccpnnnanhbledajbpd)
  - [Turn on Custom Object Formatter in Chrome DevTools](http://bit.ly/object-formatters)
- Firefox:
  - [Vue.js devtools](https://addons.mozilla.org/en-US/firefox/addon/vue-js-devtools/)
  - [Turn on Custom Object Formatter in Firefox DevTools](https://fxdx.dev/firefox-devtools-custom-object-formatters/)

## Customize configuration

See [Vite Configuration Reference](https://vite.dev/config/).

## Project Setup

```sh
npm install
```

### Backend local

O backend usa o `service_role` do Supabase para proteger o acesso ao banco.

```sh
npm run backend
```

### Frontend local

```sh
npm run dev
```

### Deploy no Railway

O backend está pronto para ser deployado via Docker.

1. No Railway, crie um novo projeto e escolha "Deploy from GitHub" ou "Deploy from Dockerfile".
2. No root do projeto, mantenha o `Dockerfile` criado aqui.
3. Configure as variáveis de ambiente em Railway:
   - `SUPABASE_URL` = `https://<seu-projeto>.supabase.co`
   - `SUPABASE_SERVICE_ROLE_KEY` = sua service role key do Supabase
   - `BACKEND_API_KEY` = se quiser proteger o backend com chave
   - `EVOLUTION_API_URL` = URL do seu serviço Evolution no Railway
   - `EVOLUTION_API_KEY` = token da API Evolution
4. Se usar chave de proteção, no frontend também configure `VITE_BACKEND_API_KEY`.

O servidor Railway deve expor a porta `3000` e iniciar com `npm start`.

### Environment

Crie um arquivo `.env` com os valores do seu projeto seguindo `.env.example`.

### Compile and Minify for Production

```sh
npm run build
```
