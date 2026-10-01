import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ViteImageOptimizer } from 'vite-plugin-image-optimizer'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    // Comprime toda imagem de src/assets e public/ no `npm run build` (não no
    // `dev`, que precisa ser rápido). Sem isto, o arquivo ia para o site do
    // jeito que foi salvo, e a qualidade de celular dependia de alguém
    // lembrar de comprimir à mão antes de cada commit.
    //
    // Qualidade 75 no JPEG/WebP é o ponto em que a diferença some a olho nu
    // numa tela de celular, e o arquivo cai para uma fração do original.
    ViteImageOptimizer({
      jpeg: { quality: 75, progressive: true },
      jpg: { quality: 75, progressive: true },
      png: { quality: 80 },
      webp: { quality: 75 },
    }),
  ],
  server: {
    // Em desenvolvimento, o navegador chama `/api` no PRÓPRIO Vite, e o Vite
    // repassa para o backend de dentro do Mac. Com isso:
    // · nenhum IP fica escrito em arquivo. O celular acessa o Vite pelo IP
    //   da rede, e o Vite fala com o backend por `localhost`, que nunca muda;
    // · para o navegador é a mesma origem, então não existe CORS no caminho.
    // Só vale para `npm run dev`; o build de produção usa a URL do
    // `.env.production`.
    proxy: {
      '/api': 'http://localhost:8080',
    },
  },
})
