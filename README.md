# Charlie Telecom

Landing page para a Charlie Telecom, instaladora de segurança eletrônica e telecom em Bauru, SP, atendendo num raio de cerca de 200km. O site cobre câmeras CFTV/IP, sistemas de alarme, automação de portões e infraestrutura de rede, com o WhatsApp como principal canal de conversão.

Foco do projeto: rápido, mobile-first e construído para converter um visitante em pedido de orçamento.

## Stack

- HTML estático, sem framework ou runtime de servidor
- [Tailwind CSS v4](https://tailwindcss.com/) (configuração via CSS, sem `tailwind.config.js`)
- JavaScript vanilla para os scroll reveals, os cards de fotos de produto com rotação automática e o menu mobile
- Google Fonts: [Sora](https://fonts.google.com/specimen/Sora) para títulos, [Manrope](https://fonts.google.com/specimen/Manrope) para o corpo do texto

Não é preciso nenhum build para visualizar a página, apenas para regerar o CSS compilado depois de editar `src/input.css` ou alterar classes Tailwind no `index.html`.

## Como rodar

```bash
npm install
npm run build:css
```

Depois sirva a raiz do projeto com qualquer servidor de arquivos estáticos (a página usa caminhos relativos à raiz, como `/assets/css/styles.css`, então precisa ser servida a partir da raiz do projeto, não aberta diretamente como um `file://`):

```bash
python -m http.server 5500
```

Abra `http://localhost:5500`.

Durante a edição dos estilos, rode o watcher em vez de recompilar manualmente:

```bash
npm run watch:css
```

## Estrutura do projeto

```
index.html              Página única, todas as seções
src/input.css            Fonte do Tailwind (tokens do tema, componentes customizados)
assets/css/styles.css    CSS compilado (gerado, não editar à mão)
assets/js/main.js        Scroll reveals, rotação de fotos, comportamento da navegação
assents/                 Imagens e logos usadas na página
scripts/                 Scripts pontuais em Node para preparar imagens
                         (remoção de fundo, recorte) durante o desenvolvimento
```

## Seções

Header, hero, barra de marcas, serviços, por que a Charlie, bio e linha do tempo de carreira do fundador, certificações, e mais por vir (como funciona, FAQ, CTA final, rodapé).

## Tratamento de imagem

Várias imagens de origem (logos, diplomas) vêm de arquivos reais com fundos ou formatação que precisaram de limpeza antes de entrar num layout escuro e mobile-first. Os scripts em `scripts/` cuidam disso com Node puro (`jpeg-js` e `pngjs`, sem binários nativos de imagem), rodando em qualquer lugar sem dependências extras do sistema:

- `white-to-transparent.mjs` / `logo-to-transparent.mjs`: remove um fundo branco e recorta rente ao conteúdo
- `trim-dark-bg.mjs`: recorta rente ao conteúdo um logo com fundo escuro
- `floodfill-transparent.mjs`: remove um fundo por flood-fill a partir das bordas da imagem, funcionando mesmo quando o fundo e parte da arte compartilham uma cor escura parecida
- `crop-png.mjs` / `crop-and-trim-dark.mjs`: recortes manuais de região com auto-trim

Digitalizações de diploma e documentos que expõem dados pessoais (CPF, RG, data de nascimento) são propositalmente mantidas fora deste repositório e nunca usadas como imagens no site. Onde essa informação importa, ela é apresentada como cartões de credencial em texto simples.

## Licença

MIT, veja [LICENSE](LICENSE).
