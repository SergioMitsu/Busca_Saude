# 🏥 Busca Saúde - MVP Acadêmico

[![HTML](https://img.shields.io/badge/HTML-5-orange.svg)](https://developer.mozilla.org/pt-BR/docs/Web/HTML)
[![CSS](https://img.shields.io/badge/CSS-3-blue.svg)](https://developer.mozilla.org/pt-BR/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-yellow.svg)](https://developer.mozilla.org/pt-BR/docs/Web/JavaScript)
[![Bootstrap](https://img.shields.io/badge/Bootstrap-5.3-purple.svg)](https://getbootstrap.com/)
[![Status](https://img.shields.io/badge/Status-Acadêmico-yellow.svg)]()

> Um protótipo web de impacto social desenvolvido para localizar medicamentos essenciais nas Unidades Básicas de Saúde (UBS) de São Paulo, alinhado aos Objetivos de Desenvolvimento Sustentável (ODS 3 — Saúde e Bem-Estar) da ONU.


## 📌 Visão Geral do Projeto
O Busca Saúde é uma aplicação web desenvolvida como projeto universitário com foco em acessibilidade digital (WCAG 2.1 Nível AA), usabilidade Mobile First e inclusão social. O sistema ajuda cidadãos a verificarem rapidamente a disponibilidade de medicamentos da rede pública municipal de saúde antes de se deslocarem até uma UBS.


## ✨ Principais Funcionalidades
 * Dra. Nina (Mascote Virtual Interativa): Assistente virtual em forma de gata calico com jaleco médico que interage dinamicamente com o usuário através de sprites e balões de diálogo contextuais.
 * Pesquisa por Comando de Voz & Sintetizador de Fala: Integração com a SpeechRecognition e a SpeechSynthesis API do navegador, permitindo pesquisar por voz e ouvir a leitura dos resultados e orientações em voz alta (com seleção inteligente de voz feminina natural).
 * Filtro Geográfico por Zonas de SP: Permite filtrar os resultados por Zona (Norte, Sul, Leste, Oeste, Centro) com links diretos para rota via Google Maps e chamadas telefônicas diretas.
 * Ferramentas de Acessibilidade Avançadas:
   * Barra de redimensionamento de fontes (A-, A, A+).
   * Modo Alto Contraste integrado via CSS tokens.
   * Skip Link para navegação por teclado.
   * Compatibilidade com leitores de tela e marcações ARIA dinâmicas.
 * Dicas de Saúde Diárias: Sistema rotativo de dicas de prevenção e cuidados básicos alinhados ao ODS 3.
 * Guia de Documentação: Orientações claras sobre os documentos obrigatórios para retirada de medicamentos nas UBSs (RG, Cartão do SUS, Receita e Comprovante de Residência).


## 🛠️ Tecnologias Utilizadas
O projeto foi construído de forma enxuta, sem dependências de frameworks pesados, garantindo alta performance e carregamento instantâneo:
 * HTML5 Semantic: Estrutura acessível com tags semânticas e atributos ARIA robustos.
 * CSS3 Moderno:
   * Design Tokens (:root) para cores, espaçamentos e escalas tipográficas.
   * Layout responsivo com Flexbox e CSS Grid (Mobile First).
   * Animações fluidas otimizadas com @keyframes.
 * JavaScript (ES6+ Modular):
   * Manipulação assíncrona do DOM.
   * Integração nativa com a Web Speech API (reconhecimento e síntese de voz).
   * Gerenciamento de estado local (localStorage).
 * Bootstrap 5.3 & Bootstrap Icons: Estilização base de componentes utilitários e ícones vetoriais.
 * Google Fonts (Nunito): Tipografia limpa e altamente legível para públicos de todas as idades.


## 📁 Estrutura de Arquivos do Repositório
index.html        # Estrutura principal da página (SPA) e marcação semântica
style.css         # Estilos, tokens, media queries e modo de alto contraste
script.js         # Lógica da aplicação, base de dados mock e Web Speech API
nina_neutra.png         # Sprite estático/neutro da Dra. Nina
nina_falando.png        # Sprite de fala da Dra. Nina
nina_gesticulando.png   # Sprite de gestão/movimento da Dra. Nina
nina_piscando.png       # Sprite de expressão orgânica da Dra. Nina


## 🚀 Como Executar o Projeto Localmente
Por se tratar de uma aplicação puramente front-end baseada em arquivos estáticos (HTML, CSS, JS e imagens), você pode executá-la de duas maneiras simples:

Opção 1: Abertura Direta
 * Baixe ou clone este repositório em sua máquina.
 * Dê um duplo clique no arquivo index.html para abri-lo diretamente no seu navegador padrão (Google Chrome ou Microsoft Edge recomendados para suporte completo à voz).

Opção 2: Servidor Local (Recomendado para recursos de áudio e microfone)
Caso utilize o VS Code, instancie um servidor de desenvolvimento local:
 * Abra a pasta do projeto no VS Code.
 * Instale a extensão Live Server (por Ritwick Dey).
 * Clique com o botão direito em index.html e selecione "Open with Live Server".


## 🌍 Alinhamento com o ODS 3 da ONU
O BuscaSaúde atua diretamente em pilares fundamentais dos Objetivos de Desenvolvimento Sustentável:
 * Meta 3.8: Alcançar a cobertura universal de saúde e o acesso a serviços de saúde essencial de qualidade.
 * Meta 3.b: Apoiar a pesquisa e o desenvolvimento de vacinas e medicamentos para doenças transmissíveis e não transmissíveis, proporcionando acesso a medicamentos essenciais acessíveis.
 * Meta 3.d: Reforçar a capacidade de alerta precoce e gestão de riscos para a saúde nacional e global.


## 🔍 Transparência de Dados
Nota: As informações de estoque e disponibilidade exibidas neste sistema tratam-se de dados simulados para fins de prototipagem acadêmica e validação de interface, estruturados com base nos parâmetros oficiais da Secretaria Municipal de Saúde de São Paulo (SMS-SP). Para dados reais e em tempo real, consulte sempre o portal oficial da Prefeitura ou a unidade de saúde da sua região.


## 🛡️ Licença e Autoria
Desenvolvido com dedicação como projeto universitário voltado à inovação social e cidadania digital em São Paulo, SP.
 * Ano: 2026
 * Público-alvo: Cidadãos de São Paulo, pacientes do SUS, idosos e estudantes de tecnologia focados em impacto social.
