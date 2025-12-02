import { Html, Head, Main, NextScript } from 'next/document'

export default function Document() {
  return (
    <Html lang="pt-BR">
      <Head>
        {/* Aqui você pode adicionar meta tags, ícones ou links globais */}
        <meta name="description" content="Restaurador de Fotos com IA em Next.js e Replicate" />
      </Head>
      <body>
        {/* Onde todo o conteúdo de pages/index.js será injetado */}
        <Main /> 
        <NextScript />
      </body>
    </Html>
  )
}
