/**
 * BuscaSaúde · script.js
 * -------------------------------------------------------
 * Lógica de pesquisa de medicamentos nas UBS de São Paulo
 * Projeto Universitário · ODS 3 – Saúde e Bem-Estar
 * -------------------------------------------------------
 * Tecnologias: Vanilla JS ES6+, Web Speech API
 * Dados: Mock JSON embutido (pronto para Fetch API)
 * -------------------------------------------------------
 */

'use strict';

/* ═══════════════════════════════════════════════════════
   1. MOCK JSON – Dados das UBS e Medicamentos
   (Simula resposta de dados_saude_sp.json)
   ═══════════════════════════════════════════════════════ */
const DADOS_SAUDE_SP = {
  metadata: {
    fonte: "Secretaria Municipal de Saúde – São Paulo",
    atualizacao: "2025-06-01",
    versao: "1.0.0",
    descricao: "Dados simulados para protótipo BuscaSaúde · ODS 3"
  },
  medicamentos: [
    {
      id: "med001",
      nome: "Amoxicilina",
      nome_generico: "Amoxicilina Tri-hidratada",
      apresentacao: "500mg · Cápsula",
      categoria: "Antibiótico",
      disponivel: true,
      ubs: [
        {
          id: "ubs001",
          nome: "UBS Dr. José Leão – Vila Madalena",
          endereco: "Rua Mourato Coelho, 872 – Vila Madalena, São Paulo – SP",
          cep: "05417-011",
          telefone: "(11) 3812-4400",
          horario: "Segunda a Sexta: 07h às 19h\nSábado: 07h às 13h",
          coordenadas: { lat: -23.5558, lng: -46.6975 },
          estoque_percentual: 75,
          obs: "Documentos necessários: RG, CPF e cartão SUS."
        },
        {
          id: "ubs002",
          nome: "UBS Jardim Paulista",
          endereco: "Alameda Joaquim Eugênio de Lima, 1400 – Jardim Paulista, São Paulo – SP",
          cep: "01403-001",
          telefone: "(11) 3255-5800",
          horario: "Segunda a Sexta: 07h às 17h",
          coordenadas: { lat: -23.5715, lng: -46.6543 },
          estoque_percentual: 90,
          obs: "Retirada na farmácia mediante apresentação de receita médica."
        },
        {
          id: "ubs005",
          nome: "UBS Bela Vista – Centro",
          endereco: "Av. Brigadeiro Luís Antônio, 2393 – Bela Vista, São Paulo – SP",
          cep: "01401-000",
          telefone: "(11) 3107-2200",
          horario: "Segunda a Sexta: 07h às 19h",
          coordenadas: { lat: -23.5618, lng: -46.6549 },
          estoque_percentual: 55,
          obs: "Estoque moderado. Recomenda-se buscar nos próximos 5 dias."
        }
      ]
    },
    {
      id: "med002",
      nome: "Dipirona",
      nome_generico: "Dipirona Monoidratada",
      apresentacao: "500mg · Comprimido",
      categoria: "Analgésico / Antitérmico",
      disponivel: true,
      ubs: [
        {
          id: "ubs001",
          nome: "UBS Dr. José Leão – Vila Madalena",
          endereco: "Rua Mourato Coelho, 872 – Vila Madalena, São Paulo – SP",
          cep: "05417-011",
          telefone: "(11) 3812-4400",
          horario: "Segunda a Sexta: 07h às 19h\nSábado: 07h às 13h",
          coordenadas: { lat: -23.5558, lng: -46.6975 },
          estoque_percentual: 95,
          obs: "Medicamento disponível sem receita médica."
        },
        {
          id: "ubs003",
          nome: "UBS Santana – Zona Norte",
          endereco: "Rua Voluntários da Pátria, 1553 – Santana, São Paulo – SP",
          cep: "02011-001",
          telefone: "(11) 2973-5600",
          horario: "Segunda a Sexta: 07h às 17h\nSábado: 08h às 12h",
          coordenadas: { lat: -23.5014, lng: -46.6226 },
          estoque_percentual: 80,
          obs: "Disponível no Programa Farmácia Popular."
        },
        {
          id: "ubs006",
          nome: "UBS Lapa – Zona Oeste",
          endereco: "Rua Catão, 428 – Lapa, São Paulo – SP",
          cep: "05049-000",
          telefone: "(11) 3641-7700",
          horario: "Segunda a Sexta: 07h às 19h",
          coordenadas: { lat: -23.5314, lng: -46.7008 },
          estoque_percentual: 60,
          obs: "Verificar disponibilidade por telefone antes de se deslocar."
        }
      ]
    },
    {
      id: "med003",
      nome: "Losartana",
      nome_generico: "Losartana Potássica",
      apresentacao: "50mg · Comprimido",
      categoria: "Anti-hipertensivo",
      disponivel: true,
      ubs: [
        {
          id: "ubs002",
          nome: "UBS Jardim Paulista",
          endereco: "Alameda Joaquim Eugênio de Lima, 1400 – Jardim Paulista, São Paulo – SP",
          cep: "01403-001",
          telefone: "(11) 3255-5800",
          horario: "Segunda a Sexta: 07h às 17h",
          coordenadas: { lat: -23.5715, lng: -46.6543 },
          estoque_percentual: 70,
          obs: "Necessário receita médica e acompanhamento no HIPERDIA."
        },
        {
          id: "ubs004",
          nome: "UBS Campo Limpo – Zona Sul",
          endereco: "Av. Franz Voegeli, 40 – Campo Limpo, São Paulo – SP",
          cep: "05755-000",
          telefone: "(11) 5841-9000",
          horario: "Segunda a Sexta: 07h às 17h",
          coordenadas: { lat: -23.6485, lng: -46.7627 },
          estoque_percentual: 85,
          obs: "Cadastrado no Programa de Hipertensão. Leve a receita médica."
        }
      ]
    },
    {
      id: "med004",
      nome: "Metformina",
      nome_generico: "Cloridrato de Metformina",
      apresentacao: "850mg · Comprimido",
      categoria: "Antidiabético",
      disponivel: true,
      ubs: [
        {
          id: "ubs003",
          nome: "UBS Santana – Zona Norte",
          endereco: "Rua Voluntários da Pátria, 1553 – Santana, São Paulo – SP",
          cep: "02011-001",
          telefone: "(11) 2973-5600",
          horario: "Segunda a Sexta: 07h às 17h\nSábado: 08h às 12h",
          coordenadas: { lat: -23.5014, lng: -46.6226 },
          estoque_percentual: 65,
          obs: "Necessário cadastro no Programa de Diabetes."
        },
        {
          id: "ubs004",
          nome: "UBS Campo Limpo – Zona Sul",
          endereco: "Av. Franz Voegeli, 40 – Campo Limpo, São Paulo – SP",
          cep: "05755-000",
          telefone: "(11) 5841-9000",
          horario: "Segunda a Sexta: 07h às 17h",
          coordenadas: { lat: -23.6485, lng: -46.7627 },
          estoque_percentual: 45,
          obs: "Estoque baixo. Procure se cadastrar o quanto antes."
        }
      ]
    },
    {
      id: "med005",
      nome: "Atenolol",
      nome_generico: "Atenolol",
      apresentacao: "25mg · Comprimido",
      categoria: "Betabloqueador / Anti-hipertensivo",
      disponivel: false,
      ubs: []
    },
    {
      id: "med006",
      nome: "Omeprazol",
      nome_generico: "Omeprazol",
      apresentacao: "20mg · Cápsula",
      categoria: "Protetor gástrico",
      disponivel: true,
      ubs: [
        {
          id: "ubs005",
          nome: "UBS Bela Vista – Centro",
          endereco: "Av. Brigadeiro Luís Antônio, 2393 – Bela Vista, São Paulo – SP",
          cep: "01401-000",
          telefone: "(11) 3107-2200",
          horario: "Segunda a Sexta: 07h às 19h",
          coordenadas: { lat: -23.5618, lng: -46.6549 },
          estoque_percentual: 88,
          obs: "Disponível mediante apresentação de receita simples."
        },
        {
          id: "ubs006",
          nome: "UBS Lapa – Zona Oeste",
          endereco: "Rua Catão, 428 – Lapa, São Paulo – SP",
          cep: "05049-000",
          telefone: "(11) 3641-7700",
          horario: "Segunda a Sexta: 07h às 19h",
          coordenadas: { lat: -23.5314, lng: -46.7008 },
          estoque_percentual: 72,
          obs: ""
        }
      ]
    }
  ]
};

/* ═══════════════════════════════════════════════════════
   2. SELEÇÃO DOS ELEMENTOS DO DOM
   ═══════════════════════════════════════════════════════ */
const $ = (id) => document.getElementById(id);

const formPesquisa        = $('form-pesquisa');
const inputMedicamento    = $('input-medicamento');
const ninaBalloon         = $('dra-nina-balao');
const balloonText         = ninaBalloon?.querySelector('.balloon-text');
const resultadosSection   = $('resultados-section');
const loadingState        = $('loading-state');
const listaUbs            = $('lista-ubs');
const notFoundState       = $('not-found-state');
const btnVoz              = $('btn-voz');
const btnNovaBusca        = $('btn-nova-busca');
const resultsTitleEl      = $('results-title-text');
const resultsSubtitleEl   = $('results-subtitle');
const toastVoz            = $('toast-voz');
const toastVozMsg         = $('toast-voz-msg');
const suggestionChips     = document.querySelectorAll('.suggestion-chip');

/* ═══════════════════════════════════════════════════════
   3. ESTADO DA APLICAÇÃO
   ═══════════════════════════════════════════════════════ */
let appState = {
  ultimaBusca: '',
  resultados: [],
  speaking: false,
  speechSynth: window.speechSynthesis || null,
  speechSupported: 'speechSynthesis' in window,
  currentUtterance: null,
};

/* ═══════════════════════════════════════════════════════
   4. MENSAGENS DA DRA. NINA
   ═══════════════════════════════════════════════════════ */
const NINA_MSGS = {
  inicial: 'Olá! Sou a Dra. Nina. Que medicamento procura hoje? Escreva em baixo e eu ajudo a encontrar a UBS mais próxima.',
  buscando: (med) => `Deixa eu verificar se "${med}" está disponível nas UBS próximas…`,
  encontrado: (med) => `Ótima notícia! Encontrei ${med} nas seguintes unidades:`,
  encontradoDetalhe: (med, n) => `Ótima notícia! Encontrei ${med} disponível em ${n} UBS próxima${n > 1 ? 's' : ''}!`,
  naoEncontrado: 'Puxa, parece que este medicamento está em falta nas UBS próximas no momento. Por favor, consulte o seu médico.',
  campoVazio: 'Por favor, escreva o nome de um medicamento para eu poder ajudar!',
  semSuporteVoz: 'Seu dispositivo não suporta leitura em voz alta. Tente usar o Chrome ou Safari.',
};

/* ═══════════════════════════════════════════════════════
   5. UTILITÁRIOS
   ═══════════════════════════════════════════════════════ */

/**
 * Normaliza texto: remove acentos e converte para minúsculas
 * para comparação de busca case/accent-insensitive.
 */
function normalizarTexto(texto) {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Atualiza o balão de fala da Dra. Nina com animação.
 * @param {string} mensagem - Texto a exibir
 * @param {'default'|'success'|'error'|'typing'} estado - Estado visual
 */
function atualizarNina(mensagem, estado = 'default') {
  if (!ninaBalloon || !balloonText) return;

  // Remove estados anteriores
  ninaBalloon.classList.remove('state-success', 'state-error', 'typing');

  // Aplica novo estado
  if (estado === 'success') ninaBalloon.classList.add('state-success');
  if (estado === 'error')   ninaBalloon.classList.add('state-error');
  if (estado === 'typing')  ninaBalloon.classList.add('typing');

  // Animação de saída e entrada do texto
  balloonText.style.opacity = '0';
  balloonText.style.transform = 'translateY(4px)';

  setTimeout(() => {
    balloonText.textContent = mensagem;
    balloonText.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    balloonText.style.opacity = '1';
    balloonText.style.transform = 'translateY(0)';
  }, 150);
}

/**
 * Exibe ou oculta o toast de voz.
 * @param {string|null} msg - Mensagem do toast; null para ocultar.
 */
function exibirToastVoz(msg) {
  if (!toastVoz) return;
  if (msg === null) {
    toastVoz.hidden = true;
    return;
  }
  if (toastVozMsg) toastVozMsg.textContent = msg;
  toastVoz.hidden = false;
}

/**
 * Gera o link do Google Maps para um endereço.
 */
function linkMaps(endereco) {
  const query = encodeURIComponent(endereco);
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}

/**
 * Gera o link de ligação para o número de telefone.
 */
function linkTelefone(telefone) {
  const numero = telefone.replace(/\D/g, '');
  return `tel:+55${numero}`;
}

/**
 * Retorna a classe de cor da barra de estoque.
 */
function classeEstoque(percentual) {
  if (percentual >= 70) return 'var(--color-secondary)';
  if (percentual >= 40) return 'var(--color-warning)';
  return 'var(--color-danger)';
}

/* ═══════════════════════════════════════════════════════
   6. RENDERIZAÇÃO DOS CARDS DE UBS
   ═══════════════════════════════════════════════════════ */

/**
 * Cria e retorna o HTML de um card de UBS.
 * @param {Object} ubs - Dados da UBS
 * @param {string} nomeMedicamento - Nome do medicamento
 * @param {string} apresentacao - Apresentação do medicamento
 * @returns {HTMLElement}
 */
function criarCardUbs(ubs, nomeMedicamento, apresentacao) {
  const card = document.createElement('article');
  card.className = 'ubs-card';
  card.setAttribute('role', 'listitem');
  card.setAttribute('aria-label', `UBS: ${ubs.nome}`);

  const linhasHorario = ubs.horario.split('\n');
  const horarioHtml = linhasHorario.map(l => `<span class="d-block">${l}</span>`).join('');

  const corBarra = classeEstoque(ubs.estoque_percentual);

  card.innerHTML = `
    <div class="ubs-card-header">
      <div class="ubs-card-icon" aria-hidden="true">
        <i class="bi bi-hospital-fill"></i>
      </div>
      <div class="ubs-card-name">${escapeHtml(ubs.nome)}</div>
      <span class="badge-disponivel" aria-label="Medicamento disponível">
        <i class="bi bi-check-circle-fill" aria-hidden="true"></i>
        Disponível
      </span>
    </div>

    <div class="ubs-card-info">
      <div class="ubs-info-row">
        <i class="bi bi-capsule-pill info-icon" aria-hidden="true"></i>
        <div>
          <div class="ubs-info-label">Medicamento</div>
          <div class="ubs-info-value">${escapeHtml(nomeMedicamento)} · ${escapeHtml(apresentacao)}</div>
        </div>
      </div>

      <div class="ubs-info-row">
        <i class="bi bi-geo-alt-fill info-icon" aria-hidden="true"></i>
        <div>
          <div class="ubs-info-label">Endereço</div>
          <div class="ubs-info-value">${escapeHtml(ubs.endereco)}</div>
        </div>
      </div>

      <div class="ubs-info-row">
        <i class="bi bi-clock-fill info-icon" aria-hidden="true"></i>
        <div>
          <div class="ubs-info-label">Horário de Funcionamento</div>
          <div class="ubs-info-value">${horarioHtml}</div>
        </div>
      </div>

      ${ubs.telefone ? `
      <div class="ubs-info-row">
        <i class="bi bi-telephone-fill info-icon" aria-hidden="true"></i>
        <div>
          <div class="ubs-info-label">Telefone</div>
          <div class="ubs-info-value">${escapeHtml(ubs.telefone)}</div>
        </div>
      </div>` : ''}

      ${ubs.obs ? `
      <div class="ubs-info-row">
        <i class="bi bi-info-circle-fill info-icon" aria-hidden="true"></i>
        <div>
          <div class="ubs-info-label">Observação</div>
          <div class="ubs-info-value">${escapeHtml(ubs.obs)}</div>
        </div>
      </div>` : ''}
    </div>

    <div class="ubs-stock-bar" aria-label="Nível de estoque: ${ubs.estoque_percentual}%">
      <div class="stock-label">Nível de Estoque: ${ubs.estoque_percentual}%</div>
      <div class="stock-bar-track" role="progressbar"
           aria-valuenow="${ubs.estoque_percentual}"
           aria-valuemin="0" aria-valuemax="100"
           aria-label="Estoque em ${ubs.estoque_percentual}%">
        <div class="stock-bar-fill"
             style="width: ${ubs.estoque_percentual}%; background: linear-gradient(90deg, ${corBarra} 0%, ${corBarra} 100%);">
        </div>
      </div>
    </div>

    <div class="ubs-card-actions">
      <a
        href="${linkMaps(ubs.endereco)}"
        target="_blank"
        rel="noopener noreferrer"
        class="btn-mapa"
        aria-label="Abrir localização de ${ubs.nome} no Google Maps (abre em nova aba)"
      >
        <i class="bi bi-map-fill me-2" aria-hidden="true"></i>
        Ver no Mapa
      </a>
      ${ubs.telefone ? `
      <a
        href="${linkTelefone(ubs.telefone)}"
        class="btn-ligar"
        aria-label="Ligar para ${ubs.nome}: ${ubs.telefone}"
      >
        <i class="bi bi-telephone-fill me-2" aria-hidden="true"></i>
        Ligar
      </a>` : ''}
    </div>
  `;

  return card;
}

/**
 * Escapa caracteres HTML para evitar XSS.
 */
function escapeHtml(texto) {
  const div = document.createElement('div');
  div.appendChild(document.createTextNode(String(texto)));
  return div.innerHTML;
}

/* ═══════════════════════════════════════════════════════
   7. WEB SPEECH API – Leitura em Voz Alta
   ═══════════════════════════════════════════════════════ */

/**
 * Gera o texto narrativo para leitura em voz alta.
 */
function gerarTextoParaVoz(medicamento, ubsList) {
  if (ubsList.length === 0) {
    return `Atenção. ${NINA_MSGS.naoEncontrado}`;
  }

  let texto = `${medicamento} está disponível em ${ubsList.length} unidade${ubsList.length > 1 ? 's' : ''} básica${ubsList.length > 1 ? 's' : ''} de saúde. `;

  ubsList.forEach((ubs, idx) => {
    texto += `Opção ${idx + 1}: ${ubs.nome}. Endereço: ${ubs.endereco}. Horário: ${ubs.horario.replace(/\n/g, '. ')}. `;
    if (ubs.obs) texto += `Observação: ${ubs.obs}. `;
  });

  return texto;
}

/**
 * Para qualquer fala em andamento.
 */
function pararFala() {
  if (!appState.speechSynth) return;
  appState.speechSynth.cancel();
  appState.speaking = false;
  if (btnVoz) btnVoz.classList.remove('speaking');
  exibirToastVoz(null);
}

/**
 * Inicia a leitura em voz alta.
 */
function lerEmVozAlta() {
  if (!appState.speechSupported) {
    atualizarNina(NINA_MSGS.semSuporteVoz, 'error');
    return;
  }

  // Se já está lendo, para
  if (appState.speaking) {
    pararFala();
    return;
  }

  const textoVoz = gerarTextoParaVoz(appState.ultimaBusca, appState.resultados);

  const utterance = new SpeechSynthesisUtterance(textoVoz);
  utterance.lang = 'pt-BR';
  utterance.rate = 0.9;    // velocidade levemente reduzida para idosos
  utterance.pitch = 1.05;
  utterance.volume = 1;

  // Tenta usar uma voz em português brasileiro
  const vozes = appState.speechSynth.getVoices();
  const vozPtBR = vozes.find(v => v.lang === 'pt-BR') ||
                  vozes.find(v => v.lang.startsWith('pt')) ||
                  null;
  if (vozPtBR) utterance.voice = vozPtBR;

  utterance.onstart = () => {
    appState.speaking = true;
    if (btnVoz) {
      btnVoz.classList.add('speaking');
      btnVoz.querySelector('span').textContent = 'Parar Leitura';
      btnVoz.setAttribute('aria-label', 'Parar leitura em voz alta');
    }
    exibirToastVoz('A ler os resultados em voz alta…');
  };

  utterance.onend = utterance.onerror = () => {
    appState.speaking = false;
    if (btnVoz) {
      btnVoz.classList.remove('speaking');
      btnVoz.querySelector('span').textContent = 'Ler em voz alta';
      btnVoz.setAttribute('aria-label', 'Ler resultados em voz alta');
    }
    exibirToastVoz(null);
  };

  appState.currentUtterance = utterance;
  appState.speechSynth.speak(utterance);
}

/* ═══════════════════════════════════════════════════════
   8. LÓGICA PRINCIPAL DE PESQUISA
   ═══════════════════════════════════════════════════════ */

/**
 * Realiza a busca de um medicamento nos dados mock.
 * Suporte a Fetch API: basta substituir a constante
 * DADOS_SAUDE_SP por: await fetch('dados_saude_sp.json').then(r=>r.json())
 * @param {string} termo - Nome do medicamento buscado
 */
async function pesquisarMedicamento(termo) {
  if (!termo.trim()) {
    atualizarNina(NINA_MSGS.campoVazio, 'error');
    inputMedicamento.focus();
    return;
  }

  const termoBusca = normalizarTexto(termo.trim());
  appState.ultimaBusca = termo.trim();

  // ---- UI: Estado de loading ----
  pararFala();
  mostrarLoading(true);
  atualizarNina(NINA_MSGS.buscando(termo), 'typing');
  ocultarResultados();

  // Simula latência de rede (200ms) para UX mais realista
  await new Promise(res => setTimeout(res, 400));

  /* ── Fetch API (descomente para produção) ──────────────
  let dados;
  try {
    const response = await fetch('dados_saude_sp.json');
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    dados = await response.json();
  } catch (err) {
    console.error('Erro ao carregar dados:', err);
    atualizarNina('Erro ao carregar os dados. Tente novamente mais tarde.', 'error');
    mostrarLoading(false);
    return;
  }
  const medicamentos = dados.medicamentos;
  ─────────────────────────────────────────────────────── */

  // ── Mock local ──────────────────────────────────────
  const medicamentos = DADOS_SAUDE_SP.medicamentos;
  // ────────────────────────────────────────────────────

  // Busca por nome ou nome genérico (fuzzy por substring)
  const encontrado = medicamentos.find(med => {
    const nomeNorm    = normalizarTexto(med.nome);
    const genNorm     = normalizarTexto(med.nome_generico);
    const categNorm   = normalizarTexto(med.categoria);
    return nomeNorm.includes(termoBusca) ||
           genNorm.includes(termoBusca) ||
           termoBusca.includes(nomeNorm) ||
           categNorm.includes(termoBusca);
  });

  mostrarLoading(false);

  // ---- Medicamento não encontrado na base ----
  if (!encontrado) {
    atualizarNina(NINA_MSGS.naoEncontrado, 'error');
    appState.resultados = [];
    mostrarNaoEncontrado();
    return;
  }

  // ---- Medicamento encontrado mas indisponível ----
  if (!encontrado.disponivel || encontrado.ubs.length === 0) {
    atualizarNina(NINA_MSGS.naoEncontrado, 'error');
    appState.resultados = [];
    mostrarNaoEncontrado();
    return;
  }

  // ---- Medicamento disponível ----
  appState.resultados = encontrado.ubs;
  const n = encontrado.ubs.length;

  atualizarNina(NINA_MSGS.encontradoDetalhe(encontrado.nome, n), 'success');

  // Renderiza os cards
  listaUbs.innerHTML = '';
  encontrado.ubs.forEach(ubs => {
    const card = criarCardUbs(ubs, encontrado.nome, encontrado.apresentacao);
    listaUbs.appendChild(card);
  });

  // Atualiza títulos
  if (resultsTitleEl) {
    resultsTitleEl.textContent = `${encontrado.nome} · ${encontrado.apresentacao}`;
  }
  if (resultsSubtitleEl) {
    resultsSubtitleEl.textContent = `${n} UBS encontrada${n > 1 ? 's' : ''} · ${encontrado.categoria}`;
  }

  // Mostra seção de resultados
  resultadosSection.hidden = false;
  notFoundState.hidden = true;

  // Scroll suave para os resultados
  setTimeout(() => {
    resultadosSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, 100);
}

/* ═══════════════════════════════════════════════════════
   9. FUNÇÕES DE CONTROLO DA UI
   ═══════════════════════════════════════════════════════ */

function mostrarLoading(mostrar) {
  if (!loadingState) return;
  loadingState.hidden = !mostrar;
}

function ocultarResultados() {
  if (resultadosSection) resultadosSection.hidden = true;
  if (listaUbs) listaUbs.innerHTML = '';
  if (notFoundState) notFoundState.hidden = true;
}

function mostrarNaoEncontrado() {
  if (resultadosSection) resultadosSection.hidden = false;
  if (listaUbs) listaUbs.innerHTML = '';
  if (notFoundState) notFoundState.hidden = false;
}

function resetarParaInicio() {
  pararFala();
  ocultarResultados();
  atualizarNina(NINA_MSGS.inicial, 'default');
  inputMedicamento.value = '';
  appState.ultimaBusca = '';
  appState.resultados = [];

  // Scroll para o topo
  window.scrollTo({ top: 0, behavior: 'smooth' });

  setTimeout(() => {
    inputMedicamento.focus();
  }, 500);
}

/* ═══════════════════════════════════════════════════════
   10. EVENTOS
   ═══════════════════════════════════════════════════════ */

// Envio do formulário
if (formPesquisa) {
  formPesquisa.addEventListener('submit', (e) => {
    e.preventDefault();
    pesquisarMedicamento(inputMedicamento.value);
  });
}

// Chips de sugestão rápida
suggestionChips.forEach(chip => {
  chip.addEventListener('click', () => {
    const med = chip.dataset.med;
    if (inputMedicamento) inputMedicamento.value = med;
    pesquisarMedicamento(med);
  });
});

// Botão "Ler em voz alta"
if (btnVoz) {
  btnVoz.addEventListener('click', lerEmVozAlta);
}

// Botão "Nova Pesquisa" (no estado não encontrado)
if (btnNovaBusca) {
  btnNovaBusca.addEventListener('click', resetarParaInicio);
}

// Input: limpa resultados ao digitar novamente
if (inputMedicamento) {
  inputMedicamento.addEventListener('input', () => {
    if (appState.resultados.length > 0 || !resultadosSection?.hidden) {
      // Não esconde automaticamente para evitar UX abrupta
    }
  });

  // Tecla Escape cancela a leitura em voz alta
  inputMedicamento.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      pararFala();
      resetarParaInicio();
    }
  });
}

// Cancela fala ao sair da página
window.addEventListener('beforeunload', () => pararFala());

// Carrega vozes disponíveis (Web Speech API)
if (appState.speechSupported) {
  speechSynthesis.addEventListener('voiceschanged', () => {
    // Vozes carregadas – prontas para uso
  });
}

/* ═══════════════════════════════════════════════════════
   11. INICIALIZAÇÃO
   ═══════════════════════════════════════════════════════ */
function init() {
  // Mensagem de boas-vindas inicial
  atualizarNina(NINA_MSGS.inicial, 'default');

  // Foca no input ao carregar (mobile: evitar zoom indesejado)
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (!isMobile && inputMedicamento) {
    inputMedicamento.focus();
  }

  // Log de inicialização (desenvolvimento)
  console.info(
    '%c BuscaSaúde 🏥 ',
    'background:#1565C0;color:#fff;font-size:14px;padding:4px 10px;border-radius:6px;font-weight:bold;',
    '\nProjeto MVP iniciado · ODS 3 · São Paulo'
  );
  console.info(`Medicamentos no catálogo: ${DADOS_SAUDE_SP.medicamentos.length}`);
  console.info(`Web Speech API suportada: ${appState.speechSupported}`);
}

// Aguarda o DOM estar pronto
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
