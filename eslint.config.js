import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

/*
 * Configuração do ESLint.
 *
 * ---------------------------------------------------------------------------
 * O QUE ESTAVA ERRADO ANTES
 * ---------------------------------------------------------------------------
 * Faltava o `eslint-plugin-react`. Sem ele, o ESLint NÃO ENTENDE JSX: para o
 * analisador, `<Button />` é só uma tag desconhecida, e a variável `Button`
 * importada no topo do arquivo parece nunca ser usada.
 *
 * Isso estava disfarçado por esta regra:
 *
 *     'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }]
 *
 * "ignore tudo que começa com maiúscula" — ou seja, ignore TODO componente
 * React. O efeito colateral é duplo e ruim nas duas direções:
 *
 *  · FALSO NEGATIVO: um import de componente que ninguém usa nunca é
 *    apontado, e vira peso morto no arquivo final.
 *  · FALSO POSITIVO: um componente recebido como PARÂMETRO (`{ as: Tag }`) é
 *    tratado como argumento, não como variável, então o padrão não o cobre —
 *    e ele era acusado de "nunca usado" mesmo aparecendo no JSX logo abaixo.
 *
 * Com o plugin instalado, a regra `react/jsx-uses-vars` marca como usada
 * qualquer variável que apareça no JSX. Aí o `no-unused-vars` pode voltar a
 * ser honesto, sem exceção nenhuma.
 */
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    plugins: { react },
    languageOptions: {
      ecmaVersion: 'latest',
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: 'detect' } },
    rules: {
      // Faz o ESLint contar o uso de uma variável dentro do JSX.
      'react/jsx-uses-vars': 'error',
      // Sem exceção por maiúscula: import não usado agora é erro de verdade.
      // `_` na frente continua sendo a forma de dizer "sei que não uso".
      'no-unused-vars': ['error', {
        varsIgnorePattern: '^_',
        argsIgnorePattern: '^_',
      }],
    },
  },
])
