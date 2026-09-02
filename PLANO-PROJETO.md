# Plano — Landing Page Charlie Segurança Eletrônica

## 1. Objetivo do site
Landing page única (one-page ou poucas seções-âncora), premium, focada em:
- Geração de leads qualificados → pedido de orçamento (CTA principal)
- Reforçar autoridade técnica (marcas parceiras: PPA, Garen, Ubiquiti, Nice, Furukawa, Intelbras, Hikvision)
- SEO local (a empresa provavelmente atende uma região/cidade — confirmar)

## 2. Estrutura de seções (ordem sugerida)
1. **Hero** — promessa clara + CTA acima da dobra ("Solicitar orçamento grátis" / WhatsApp)
   - Título forte (dor + solução: "Segurança eletrônica para sua casa ou empresa, com quem instala as marcas líderes do mercado")
   - Imagem/vídeo de fundo com instalação real (câmeras, alarme, portão)
   - Selo de confiança: "Instalador autorizado" das marcas
2. **Barra de logos das marcas** (PPA, Garen, Ubiquiti, Nice, Furukawa, Intelbras, Hikvision) — carrossel ou grid, reforça autoridade imediatamente
3. **Serviços / Soluções** (cards, 1 por linha de produto)
   - CFTV / Câmeras IP (Hikvision, Intelbras)
   - Alarmes e monitoramento (Intelbras)
   - Automação de portões (PPA, Garen, Nice)
   - Redes e infraestrutura (Ubiquiti, Furukawa)
   Cada card com ícone, 1 frase de benefício e micro-CTA ("Ver mais" / "Pedir orçamento")
4. **Por que a Charlie** (diferenciais: técnicos certificados, garantia, atendimento, prazo)
5. **Prova social** — depoimentos de clientes, casos, avaliações Google (se houver)
6. **Galeria de projetos/instalações** (usar fotos reais em assents/)
7. **Como funciona** (3-4 passos: contato → visita técnica/orçamento → instalação → suporte) — reduz fricção e ansiedade do lead
8. **FAQ** (bom para SEO + objeções: prazo, preço, garantia, atendimento em domicílio)
9. **CTA final + formulário de orçamento** (nome, telefone/WhatsApp, tipo de serviço, cidade/bairro)
10. **Rodapé** — contato, endereço (NAP consistente p/ SEO local), redes sociais, horário

CTA deve reaparecer no mínimo 3-4 vezes ao longo da página (hero, meio, final) + botão flutuante de WhatsApp fixo.

## 3. Conversão / CTA
- CTA principal: WhatsApp (o canal que mais converte nesse nicho) + formulário como alternativa
- Copy orientada a benefício, não a feature: "Peça seu orçamento em 1 minuto" em vez de "Contato"
- Prova de resposta rápida ("Respondemos em até 30 minutos úteis")
- Sem popups agressivos — pode prejudicar conversão e Core Web Vitals/SEO
- Formulário curto (poucos campos) — cada campo extra reduz conversão

## 4. SEO técnico
- HTML semântico, um único H1 por seção relevante, hierarquia clara de headings
- Meta title/description únicos e otimizados por intenção local ("Câmeras de segurança em [cidade] | Charlie Segurança Eletrônica")
- Schema.org: LocalBusiness (ou HomeAndConstructionBusiness) + FAQPage
- Core Web Vitals: imagens em WebP/AVIF, lazy loading, sem frameworks pesados desnecessários
- Sitemap.xml, robots.txt, Open Graph para compartilhamento
- Google Meu Negócio integrado/linkado (fundamental para segurança eletrônica local)
- Site rápido e mobile-first (maioria do tráfego de busca local é mobile)

## 5. Stack técnica recomendada (para pedir ao Claude Code)
Para um site estático, rápido, ótimo em SEO e fácil de hospedar (Vercel/Netlify/GitHub Pages):
- HTML + Tailwind CSS + JS vanilla (ou Astro, se quiser componentização mantendo saída estática)
- Evitar SPA client-side pesado (React puro sem SSR/SSG) — prejudica SEO e LCP
- Formulário conectado a um serviço simples (Formspree, ou WhatsApp deep link `https://wa.me/55...`)
- Otimizar automaticamente as imagens da pasta assents/ (converter para WebP, redimensionar)

## 6. Sites de referência (inspiração real)
Nenhum concorrente brasileiro direto do nicho tem um design realmente "premium" — a maioria (ABC Alarmes, Segmas, CFTV Monitoramento) é informacional e datada, o que é uma oportunidade: um design premium já destaca a Charlie da concorrência.
Melhores referências de padrão visual/CTA para adaptar ao nicho:
- **ui.com** (site institucional da própria Ubiquiti) — ótimo uso de imagens de produto, grid limpo, hierarquia visual forte
- **verkada.com** (segurança eletrônica corporativa/CFTV) — referência direta de como apresentar câmeras/alarmes de forma premium, com CTA de demonstração/orçamento bem posicionado
- **ring.com** ou **simplisafe.com** — bons exemplos de landing page consumer-friendly com forte CTA e prova social
- Land-book.com e Awwwards.com (buscar por "security" ou "home services") para inspiração geral de layout premium

## 7. Prompt pronto para colar no Claude Code
"""
Quero que você crie uma landing page premium para uma empresa de segurança eletrônica chamada Charlie, que trabalha com CFTV, alarmes, automação de portões e redes, e é instaladora autorizada das marcas PPA, Garen, Ubiquiti, Nice, Furukawa, Intelbras e Hikvision.

Objetivo: gerar o máximo de pedidos de orçamento (conversão), com forte foco em CTA (WhatsApp + formulário curto) e SEO local.

Use as imagens e o logo da pasta assents/ (ajuste/otimize conforme necessário, convertendo para WebP quando fizer sentido).

Estrutura da página (siga esta ordem): hero com CTA acima da dobra, barra de logos das marcas parceiras, seção de serviços/soluções em cards, seção "por que a Charlie", depoimentos/prova social, galeria de projetos, como funciona (passo a passo), FAQ, CTA final com formulário de orçamento, rodapé com contato e redes sociais. Adicione um botão flutuante de WhatsApp fixo.

Stack: HTML + Tailwind CSS + JS vanilla, site estático, mobile-first, rápido (otimizado para Core Web Vitals), com meta tags de SEO, schema.org LocalBusiness + FAQPage, sitemap.xml e robots.txt.

Design: premium, moderno, cores que transmitam segurança e confiança (tons escuros/azul/grafite com um accent color de destaque para os CTAs), tipografia forte, bastante espaço em branco, sem excesso de poluição visual.

Comece perguntando quais informações de contato (telefone/WhatsApp, cidade, endereço) e depoimentos reais eu tenho disponíveis antes de gerar o conteúdo final, e me mostre um plano de seções antes de começar a codar.
"""

## 8. Informações que faltam (levantar com o cliente antes de começar)
- Cidade(s)/região de atuação (essencial para SEO local)
- Telefone/WhatsApp oficial
- Endereço (se atende presencialmente/tem loja física)
- Depoimentos reais de clientes ou avaliações do Google
- Fotos adicionais de instalações reais (a pasta assents/ tem produtos genéricos das marcas, mas fotos de trabalhos do próprio cliente convertem muito mais)
- Diferenciais concretos (anos de mercado, nº de instalações, garantia oferecida)
- Domínio e onde será hospedado
