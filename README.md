# Știri statice

Acest proiect este un site de știri static construit cu Next.js 14 (App Router) și TypeScript. Sunt folosite TailwindCSS și componente din biblioteca [shadcn/ui](https://ui.shadcn.com).

## Rulare locală

1. Instalează dependențele:

   ```bash
   pnpm i
   ```

2. Build al aplicației:

   ```bash
   pnpm build
   ```

3. Export static:

   ```bash
   pnpm export
   ```

Fișierele statice vor fi generate în directorul `out/` și pot fi încărcate pe hostingul tău (de exemplu, CyberFolks).

### Variabile de mediu

Aplicația folosește un endpoint WordPress GraphQL pentru a prelua articole. Pentru dezvoltare locală creează un fișier `.env.local` cu următoarele valori:

```
SITE_URL=http://localhost:3000
WP_GRAPHQL_ENDPOINT=https://cms.green-news.ro/wp/graphql
```

Un fișier `.env.production` este inclus pentru mediul de producție `green-news.ro`.
