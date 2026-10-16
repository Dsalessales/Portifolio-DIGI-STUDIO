# Portfólio STUDIO DIGI

Site estático do portfólio da STUDIO DIGI: HTML, CSS e JavaScript puros, sem etapa de build.

```
index.html      página
styles.css      estilos
main.js         menu, filtros, animações
images/         imagens otimizadas (WebP)
media/          vídeo do tema Kissa
_headers        cache no Cloudflare Pages
```

## Publicar no Cloudflare Pages

1. Cloudflare → Workers & Pages → Create → Pages → **Connect to Git** e escolha este repositório.
2. Framework preset: **None**. Build command: vazio. Build output directory: `/`.
3. Cada push na branch `main` publica o site de novo.

## Editar

- Textos e projetos: `index.html` (cada projeto é um `<article class="card">`, com `data-kind="site"` ou `data-kind="app"` para os filtros).
- Cores e fontes: variáveis no começo de `styles.css`.
- WhatsApp: procure `wa.me/5519990105959` no `index.html`.
