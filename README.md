# ☕️ Just Another API Doc

A modern and fast API documentation portal built with Next.js App Router and React Server Components. Designed to provide a premium developer experience with interactive features, deep MDX integration, and stunning TailwindCSS + Shadcn UI.

> **Live demo : [https://just-another-api-doc.pages.dev/](https://just-another-api-doc.pages.dev/)**

## ✨ Features

- **OpenAPI / Swagger Parsing**: Automatically generates comprehensive documentation pages from your `openapi.json` or `swagger.json` specs.
- **Interactive "Try it out"**: Test API endpoints directly from the browser!
  - Fully responsive, native-feeling Input forms.
  - Persistent `Authorization` headers (Bearer tokens) saved in `localStorage`.
  - Editable base URL domains to seamlessly test against `localhost`, staging, or production.
- **Rich MDX Support**: 
  - Override API overview pages with custom `.mdx` content.
  - Inject custom `.mdx` documentation directly into endpoint detail pages.
- **Syntax Highlighting**: Beautiful code examples (cURL, JS, Python) and MDX code blocks powered by `shiki` and `rehype-pretty-code` (`dark-plus` theme).
- **Fast Search**: Instant `Cmd+K` fuzzy search across all endpoints, paths, tags, and methods.
- **Responsive & Accessible Design**: Crafted meticulously with Tailwind CSS and Shadcn UI. Looks gorgeous on desktop and mobile.

## 🚀 Getting Started

1. **Install dependencies**
   ```sh
   pnpm install
   ```

2. **Run the development server**
   ```sh
   pnpm dev
   ```

3. **Configure your API**
   - Place your Swagger/OpenAPI JSON file in `api-docs/swagger.json`.
   - Update `api-docs/config.json` to configure sidebar groups, tag names, and metadata.
   - Add `{HTTP_METHOD}-{operationId}.mdx` files in the `api-docs/` folder to enrich specific endpoints with custom markdown guides.
   - Add `overview.mdx` in the `api-docs/` folder to customize the API Reference landing page.

## 📁 Project Structure

```
api-docs/           # Swagger spec, config.json, and custom MDX overrides
app/                # Next.js App Router (pages, layouts)
  docs/             # API Reference and documentation routes
components/         # React components
  api-docs/         # Specific components for OpenAPI rendering (TryItOut, Sidebar, etc.)
  ui/               # Reusable Shadcn UI components
lib/                # Utilities, Swagger parser functions
```

## 🛠️ Tech Stack

- **Framework**: Next.js 15 (React 19)
- **Styling**: Tailwind CSS v4 + Shadcn UI
- **Icons**: Lucide React & React Icons
- **Markdown**: `next-mdx-remote`, `rehype-pretty-code`, `shiki`
- **Quality**: Biome (Linter/Formatter), Husky (Git Hooks)

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!
Feel free to check [issues page](#) if you want to contribute.

## 📄 License

MIT
