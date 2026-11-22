/**
 * BuscaSaúde · script.js  v2.0
 * ─────────────────────────────────────────────────────────────────────────────
 * Lógica completa: pesquisa, filtros, acessibilidade, dicas, Dra. Nina
 * Projeto Universitário · ODS 3 – Saúde e Bem-Estar · São Paulo
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

/* ═══════════════════════════════════════════════════════════════════
   1. DADOS MOCK – UBS e Medicamentos (simula dados_saude_sp.json)
   ═══════════════════════════════════════════════════════════════════ */
const DADOS_SAUDE_SP = {
  metadata: {
    fonte:      'Secretaria Municipal de Saúde – São Paulo (SMS-SP)',
    atualizacao:'2025-06-01',
    versao:     '2.0.0',
    descricao:  'Dados simulados para protótipo BuscaSaúde · ODS 3'
  },
  medicamentos: [
    {
      id: 'med001', nome: 'Amoxicilina',
      nome_generico: 'Amoxicilina Tri-hidratada',
      apresentacao: '500mg · Cápsula', categoria: 'Antibiótico',
      disponivel: true,
      ubs: [
        { id:'ubs001', zona:'Oeste',  nome:'UBS Dr. José Leão – Vila Madalena',
          endereco:'Rua Mourato Coelho, 872 – Vila Madalena, São Paulo – SP', cep:'05417-011',
          telefone:'(11) 3812-4400', horario:'Segunda a Sexta: 07h às 19h\nSábado: 07h às 13h',
          coordenadas:{lat:-23.5558,lng:-46.6975}, estoque_percentual:75,
          obs:'Documentos necessários: RG, CPF e cartão SUS.' },
        { id:'ubs002', zona:'Centro', nome:'UBS Jardim Paulista',
          endereco:'Alameda Joaquim Eugênio de Lima, 1400 – Jardim Paulista, São Paulo – SP', cep:'01403-001',
          telefone:'(11) 3255-5800', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.5715,lng:-46.6543}, estoque_percentual:90,
          obs:'Retirada na farmácia mediante receita médica.' },
        { id:'ubs005', zona:'Centro', nome:'UBS Bela Vista – Centro',
          endereco:'Av. Brigadeiro Luís Antônio, 2393 – Bela Vista, São Paulo – SP', cep:'01401-000',
          telefone:'(11) 3107-2200', horario:'Segunda a Sexta: 07h às 19h',
          coordenadas:{lat:-23.5618,lng:-46.6549}, estoque_percentual:55,
          obs:'Estoque moderado. Recomenda-se buscar nos próximos 5 dias.' },
        { id:'ubs007', zona:'Leste',  nome:'UBS Itaquera – Zona Leste',
          endereco:'Rua Mário Fonseca, 90 – Itaquera, São Paulo – SP', cep:'08230-010',
          telefone:'(11) 2074-5300', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.5342,lng:-46.4475}, estoque_percentual:40,
          obs:'Estoque baixo. Ligue antes de se deslocar.' }
      ]
    },
    {
      id: 'med002', nome: 'Dipirona',
      nome_generico: 'Dipirona Monoidratada',
      apresentacao: '500mg · Comprimido', categoria: 'Analgésico / Antitérmico',
      disponivel: true,
      ubs: [
        { id:'ubs001', zona:'Oeste', nome:'UBS Dr. José Leão – Vila Madalena',
          endereco:'Rua Mourato Coelho, 872 – Vila Madalena, São Paulo – SP', cep:'05417-011',
          telefone:'(11) 3812-4400', horario:'Segunda a Sexta: 07h às 19h\nSábado: 07h às 13h',
          coordenadas:{lat:-23.5558,lng:-46.6975}, estoque_percentual:95,
          obs:'Disponível sem receita médica.' },
        { id:'ubs003', zona:'Norte', nome:'UBS Santana – Zona Norte',
          endereco:'Rua Voluntários da Pátria, 1553 – Santana, São Paulo – SP', cep:'02011-001',
          telefone:'(11) 2973-5600', horario:'Segunda a Sexta: 07h às 17h\nSábado: 08h às 12h',
          coordenadas:{lat:-23.5014,lng:-46.6226}, estoque_percentual:80,
          obs:'Disponível no Programa Farmácia Popular.' },
        { id:'ubs006', zona:'Oeste', nome:'UBS Lapa – Zona Oeste',
          endereco:'Rua Catão, 428 – Lapa, São Paulo – SP', cep:'05049-000',
          telefone:'(11) 3641-7700', horario:'Segunda a Sexta: 07h às 19h',
          coordenadas:{lat:-23.5314,lng:-46.7008}, estoque_percentual:60,
          obs:'Verificar disponibilidade por telefone antes de se deslocar.' },
        { id:'ubs007', zona:'Leste', nome:'UBS Itaquera – Zona Leste',
          endereco:'Rua Mário Fonseca, 90 – Itaquera, São Paulo – SP', cep:'08230-010',
          telefone:'(11) 2074-5300', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.5342,lng:-46.4475}, estoque_percentual:88,
          obs:'Amplo estoque. Atendimento rápido.' }
      ]
    },
    {
      id: 'med003', nome: 'Losartana',
      nome_generico: 'Losartana Potássica',
      apresentacao: '50mg · Comprimido', categoria: 'Anti-hipertensivo',
      disponivel: true,
      ubs: [
        { id:'ubs002', zona:'Centro', nome:'UBS Jardim Paulista',
          endereco:'Alameda Joaquim Eugênio de Lima, 1400 – Jardim Paulista, São Paulo – SP', cep:'01403-001',
          telefone:'(11) 3255-5800', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.5715,lng:-46.6543}, estoque_percentual:70,
          obs:'Necessário receita médica e acompanhamento no HIPERDIA.' },
        { id:'ubs004', zona:'Sul', nome:'UBS Campo Limpo – Zona Sul',
          endereco:'Av. Franz Voegeli, 40 – Campo Limpo, São Paulo – SP', cep:'05755-000',
          telefone:'(11) 5841-9000', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.6485,lng:-46.7627}, estoque_percentual:85,
          obs:'Cadastrado no Programa de Hipertensão. Leve a receita.' },
        { id:'ubs008', zona:'Sul', nome:'UBS Santo Amaro – Zona Sul',
          endereco:'Rua Amador Bueno, 536 – Santo Amaro, São Paulo – SP', cep:'04752-005',
          telefone:'(11) 5681-3200', horario:'Segunda a Sexta: 07h às 19h',
          coordenadas:{lat:-23.6500,lng:-46.7100}, estoque_percentual:62,
          obs:'Programa HIPERDIA disponível. Levar documentos.' }
      ]
    },
    {
      id: 'med004', nome: 'Metformina',
      nome_generico: 'Cloridrato de Metformina',
      apresentacao: '850mg · Comprimido', categoria: 'Antidiabético',
      disponivel: true,
      ubs: [
        { id:'ubs003', zona:'Norte', nome:'UBS Santana – Zona Norte',
          endereco:'Rua Voluntários da Pátria, 1553 – Santana, São Paulo – SP', cep:'02011-001',
          telefone:'(11) 2973-5600', horario:'Segunda a Sexta: 07h às 17h\nSábado: 08h às 12h',
          coordenadas:{lat:-23.5014,lng:-46.6226}, estoque_percentual:65,
          obs:'Necessário cadastro no Programa de Diabetes.' },
        { id:'ubs004', zona:'Sul', nome:'UBS Campo Limpo – Zona Sul',
          endereco:'Av. Franz Voegeli, 40 – Campo Limpo, São Paulo – SP', cep:'05755-000',
          telefone:'(11) 5841-9000', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.6485,lng:-46.7627}, estoque_percentual:45,
          obs:'Estoque baixo. Procure se cadastrar o quanto antes.' },
        { id:'ubs009', zona:'Norte', nome:'UBS Jaçanã – Zona Norte',
          endereco:'Rua Jaçanã, 220 – Jaçanã, São Paulo – SP', cep:'02270-010',
          telefone:'(11) 2951-3300', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.4700,lng:-46.5900}, estoque_percentual:78,
          obs:'Boa disponibilidade. Verificar horários de retirada.' }
      ]
    },
    {
      id: 'med005', nome: 'Atenolol',
      nome_generico: 'Atenolol',
      apresentacao: '25mg · Comprimido', categoria: 'Betabloqueador / Anti-hipertensivo',
      disponivel: false, ubs: []
    },
    {
      id: 'med006', nome: 'Omeprazol',
      nome_generico: 'Omeprazol',
      apresentacao: '20mg · Cápsula', categoria: 'Protetor gástrico',
      disponivel: true,
      ubs: [
        { id:'ubs005', zona:'Centro', nome:'UBS Bela Vista – Centro',
          endereco:'Av. Brigadeiro Luís Antônio, 2393 – Bela Vista, São Paulo – SP', cep:'01401-000',
          telefone:'(11) 3107-2200', horario:'Segunda a Sexta: 07h às 19h',
          coordenadas:{lat:-23.5618,lng:-46.6549}, estoque_percentual:88,
          obs:'Disponível mediante receita simples.' },
        { id:'ubs006', zona:'Oeste', nome:'UBS Lapa – Zona Oeste',
          endereco:'Rua Catão, 428 – Lapa, São Paulo – SP', cep:'05049-000',
          telefone:'(11) 3641-7700', horario:'Segunda a Sexta: 07h às 19h',
          coordenadas:{lat:-23.5314,lng:-46.7008}, estoque_percentual:72, obs:'' },
        { id:'ubs007', zona:'Leste', nome:'UBS Itaquera – Zona Leste',
          endereco:'Rua Mário Fonseca, 90 – Itaquera, São Paulo – SP', cep:'08230-010',
          telefone:'(11) 2074-5300', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.5342,lng:-46.4475}, estoque_percentual:55, obs:'' }
      ]
    },
    {
      id: 'med007', nome: 'Captopril',
      nome_generico: 'Captopril',
      apresentacao: '25mg · Comprimido', categoria: 'Anti-hipertensivo (IECA)',
      disponivel: true,
      ubs: [
        { id:'ubs004', zona:'Sul', nome:'UBS Campo Limpo – Zona Sul',
          endereco:'Av. Franz Voegeli, 40 – Campo Limpo, São Paulo – SP', cep:'05755-000',
          telefone:'(11) 5841-9000', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.6485,lng:-46.7627}, estoque_percentual:92, obs:'' },
        { id:'ubs008', zona:'Sul', nome:'UBS Santo Amaro – Zona Sul',
          endereco:'Rua Amador Bueno, 536 – Santo Amaro, São Paulo – SP', cep:'04752-005',
          telefone:'(11) 5681-3200', horario:'Segunda a Sexta: 07h às 19h',
          coordenadas:{lat:-23.6500,lng:-46.7100}, estoque_percentual:67, obs:'Levar receita médica.' }
      ]
    },
    {
      id: 'med008', nome: 'Ibuprofeno',
      nome_generico: 'Ibuprofeno',
      apresentacao: '400mg · Comprimido', categoria: 'Anti-inflamatório',
      disponivel: false, ubs: []
    }
  ]
};

/* ═══════════════════════════════════════════════════════════════════
   2. DICAS DO DIA (ODS 3 – Cuidados Preventivos)
   ═══════════════════════════════════════════════════════════════════ */
const DICAS_DO_DIA = [
  '💧 Beba pelo menos 2 litros de água por dia. A hidratação adequada ajuda a regular a pressão arterial e os rins.',
  '💉 Mantenha a carteira de vacinação atualizada! As vacinas protegem contra doenças graves e são gratuitas nas UBS.',
  '🩺 Meça sua pressão arterial regularmente. A hipertensão é silenciosa — detectá-la cedo salva vidas.',
  '🚶‍♂️ 30 minutos de caminhada por dia reduzem em 35% o risco de doenças cardiovasculares. Comece hoje!',
  '🍎 Reduza o consumo de sal e alimentos ultraprocessados. Priorize frutas, legumes e grãos integrais.',
  '😴 Durma pelo menos 7 horas por noite. O sono de qualidade fortalece o sistema imunológico.',
  '🧠 Cuide da saúde mental! Fale com alguém de confiança ou procure apoio no CAPS da sua região.',
  '🩸 Faça exames de glicemia anuais se tiver mais de 45 anos ou histórico familiar de diabetes.',
  '🚭 Parar de fumar melhora a saúde cardiovascular em apenas 20 minutos após o último cigarro.',
  '☀️ Aplique protetor solar diariamente. O câncer de pele é o mais comum no Brasil — e o mais evitável.'
];

/* ═══════════════════════════════════════════════════════════════════
   3. MENSAGENS DA DRA. NINA
   ═══════════════════════════════════════════════════════════════════ */
const NINA_MSGS = {
  inicial:        'Olá! Sou a Dra. Nina. Que medicamento procura hoje? Escreva em baixo e eu ajudo a encontrar a UBS mais próxima.',
  buscando:  (m) => `Deixa eu verificar se "${m}" está disponível nas UBS próximas…`,
  encontrado:(m,n)=> `Ótima notícia! Encontrei ${m} disponível em ${n} UBS próxima${n>1?'s':''}! 🎉`,
  semZona:   (m,z)=> `${m} está disponível, mas não na Zona ${z}. Veja nas outras zonas!`,
  naoEncontrado:  'Puxa, parece que este medicamento está em falta nas UBS próximas no momento. Por favor, consulte o seu médico. 😿',
  campoVazio:     'Por favor, escreva o nome de um medicamento para eu poder ajudar!',
  semSuporteVoz:  'Seu dispositivo não suporta leitura em voz alta. Tente usar o Chrome ou Safari.',
};

/* ═══════════════════════════════════════════════════════════════════
   4. REFERÊNCIAS DO DOM
   ═══════════════════════════════════════════════════════════════════ */
const $  = (id) => document.getElementById(id);
const $$ = (sel) => document.querySelectorAll(sel);

const formPesquisa      = $('form-pesquisa');
const inputMed          = $('input-medicamento');
const selectZona        = $('select-zona');
const ninaBalloon       = $('dra-nina-balao');
const balloonText       = ninaBalloon?.querySelector('.balloon-text');
const resultadosSection = $('resultados-section');
const loadingState      = $('loading-state');
const listaUbs          = $('lista-ubs');
const notFoundState     = $('not-found-state');
const filterEmpty       = $('filter-empty');
const btnVoz            = $('btn-voz');
const btnMic            = $('btn-mic');
const voiceBadge        = $('voice-listening-badge');
const btnNovaBusca      = $('btn-nova-busca');
const btnLimparFiltro   = $('btn-limpar-filtro');
const resultsTitleEl    = $('results-title-text');
const resultsSubtitleEl = $('results-subtitle');
const toastVoz          = $('toast-voz');
const toastVozMsg       = $('toast-voz-msg');
const btnPararToast     = $('btn-parar-toast');
const ninaContainer     = $('nina-svg-fallback');
const btnFontIncrease   = $('btn-font-increase');
const btnFontDecrease   = $('btn-font-decrease');
const btnFontReset      = $('btn-font-reset');
const btnContrast       = $('btn-contrast');
const btnVozGlobal      = $('btn-voz-global');
const btnNarrarNina     = $('btn-narrar-nina');
const tipTexto          = $('tip-texto');
const tipCounter        = $('tip-counter');
const btnTipNext        = $('btn-tip-next');
const btnTipPrev        = $('btn-tip-prev');
const chips             = $$('.suggestion-chip');

/* ═══════════════════════════════════════════════════════════════════
   5. ESTADO GLOBAL DA APLICAÇÃO
   ═══════════════════════════════════════════════════════════════════ */
const appState = {
  ultimaBusca:      '',
  resultados:       [],       // UBS filtradas pelo zona atual
  resultadosTotal:  [],       // Todas as UBS do medicamento encontrado
  medicamentoAtual: null,
  speaking:         false,
  speechSynth:      window.speechSynthesis || null,
  speechSupported: 'speechSynthesis' in window,
  fontScale:        1,        // 0.85 | 1 | 1.15 | 1.30
  highContrast:     false,
  tipIndex:         0,
  tipTimer:         null,
};

/* ═══════════════════════════════════════════════════════════════════
   6. UTILIDADES
   ═══════════════════════════════════════════════════════════════════ */
function normalizar(txt) {
  return txt.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
}

function escapeHtml(txt) {
  const d = document.createElement('div');
  d.appendChild(document.createTextNode(String(txt)));
  return d.innerHTML;
}

function linkMaps(endereco) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(endereco)}`;
}

function linkTel(telefone) {
  return `tel:+55${telefone.replace(/\D/g,'')}`;
}

function corEstoque(pct) {
  if (pct >= 70) return 'linear-gradient(90deg,#43A047,#2E7D32)';
  if (pct >= 40) return 'linear-gradient(90deg,#FF8F00,#E65100)';
  return 'linear-gradient(90deg,#E53935,#C62828)';
}

function classeStatusCard(pct) {
  if (pct >= 70) return 'status-alto';
  if (pct >= 40) return 'status-medio';
  return 'status-baixo';
}

/* ═══════════════════════════════════════════════════════════════════
   7. DRA. NINA — SISTEMA DE SPRITES E ANIMAÇÃO (FMU TECH)
   ═══════════════════════════════════════════════════════════════════ */

// Passo 1: Variações de imagem da Dra. Nina (Sprites)
const NINA_SPRITES = {
  neutra:       'nina_neutra.png',
  falando:      'nina_falando.png',
  gesticulando: 'nina_gesticulando.png',
  piscando:     'nina_piscando.png'
};

// Pré-carregamento dos sprites em memória para alternância instantânea
Object.values(NINA_SPRITES).forEach(src => {
  const img = new Image();
  img.src = src;
});

let ninaIntervalFala = null;
let ninaTimeoutPiscar = null;
let ninaFalando = false;
let ninaSpriteAtual = 'neutra';

/**
 * Troca o sprite exibido na tag <img id="dra-nina-img">
 * @param {'neutra'|'falando'|'gesticulando'|'piscando'} tipo
 */
function ninaTrocarSprite(tipo) {
  const imgEl = $('dra-nina-img');
  if (!imgEl || !NINA_SPRITES[tipo]) return;
  imgEl.src = NINA_SPRITES[tipo];
  ninaSpriteAtual = tipo;
}

/**
 * Executa um piscar espontâneo da Dra. Nina (Sprite: piscando -> neutra)
 */
function ninaPiscar() {
  if (ninaFalando) return; // não pisca no meio de uma fala ativa
  ninaTrocarSprite('piscando');
  setTimeout(() => {
    if (!ninaFalando) {
      ninaTrocarSprite('neutra');
    }
  }, 170);
}

/**
 * Ciclo contínuo de piscar espontâneo enquanto o usuário navega
 */
function ninaIniciarCicloPiscar() {
  clearTimeout(ninaTimeoutPiscar);
  // Intervalo aleatório entre 2.8s e 5.5s para aspecto natural
  const intervalo = 2800 + Math.random() * 2700;
  ninaTimeoutPiscar = setTimeout(() => {
    ninaPiscar();
    // 25% de chance de piscar duplo (orgânico e expressivo)
    if (Math.random() < 0.25) {
      setTimeout(ninaPiscar, 370);
    }
    ninaIniciarCicloPiscar();
  }, intervalo);
}

/**
 * Localiza a melhor voz feminina em português para a Dra. Nina
 * Prioriza vozes neurais e naturais femininas (Francisca, Maria, Luciana, Thalita, etc.)
 */
function obterVozDraNina() {
  if (!('speechSynthesis' in window)) return null;
  const vozes = window.speechSynthesis.getVoices();
  if (!vozes || !vozes.length) return null;

  // Filtra vozes em português (pt-BR ou pt)
  const vozesPt = vozes.filter(v => v.lang === 'pt-BR' || v.lang.startsWith('pt'));
  if (!vozesPt.length) return null;

  // Lista de padrões de nomes de vozes femininas conhecidas em diferentes SOs e navegadores
  const nomesFemininos = [
    /francisca/i,   // Microsoft Francisca Online (Natural) - excelente
    /maria/i,       // Microsoft Maria (Windows pt-BR nativa)
    /thalita/i,     // Microsoft Thalita Online
    /leticia|letícia/i, // Microsoft Leticia
    /heloisa|heloísa/i, // Microsoft Heloisa
    /luciana/i,     // Apple / Chrome Luciana
    /yara/i,        // Windows Yara
    /fernanda/i,    // Fernanda
    /camila/i,      // Camila
    /vitoria|vitória/i, // Vitória
    /joana/i,       // Apple Joana
    /raquel/i,      // Raquel
    /female/i,      // Identificada como Female
    /mulher/i,
    /google português do brasil/i // Voz padrão feminina do Chrome
  ];

  // 1. Tenta voz feminina com alta qualidade (Natural / Online)
  for (const regex of nomesFemininos) {
    const encontrada = vozesPt.find(v => regex.test(v.name) && /natural|online/i.test(v.name));
    if (encontrada) return encontrada;
  }

  // 2. Tenta qualquer voz feminina pelo nome
  for (const regex of nomesFemininos) {
    const encontrada = vozesPt.find(v => regex.test(v.name));
    if (encontrada) return encontrada;
  }

  // 3. Descarta vozes explicitamente masculinas conhecidas
  const semMasculino = vozesPt.filter(v => !/daniel|antonio|antônio|felipe|ricardo|male|homem/i.test(v.name));
  if (semMasculino.length) return semMasculino[0];

  return vozesPt[0];
}

/**
 * Passo 2: Função central de animação de fala e voz (Web Speech API + Sprites)
 * @param {string} texto - Mensagem que a Dra. Nina vai dizer
 */
function ninaComecarAFalar(texto) {
  if (!texto || !texto.trim()) return;

  // Interrompe qualquer fala ou áudio em andamento
  ninaPararDeFalar();

  ninaFalando = true;
  appState.speaking = true;

  const imgEl = $('dra-nina-img');
  if (imgEl) {
    imgEl.classList.remove('dra-nina-happy', 'dra-nina-sad');
    imgEl.classList.add('dra-nina-falando');
  }

  // Alterna dinamicamente entre os sprites de fala e gesticulação (~185ms)
  const cicloFala = ['falando', 'gesticulando', 'falando', 'neutra'];
  let frameFala = 0;
  ninaIntervalFala = setInterval(() => {
    frameFala = (frameFala + 1) % cicloFala.length;
    ninaTrocarSprite(cicloFala[frameFala]);
  }, 300);

  // Dispara a Web Speech API com voz feminina configurada
  if (appState.speechSupported) {
    try {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(texto);
      utterance.lang = 'pt-BR';
      utterance.rate = 0.94;   // cadência natural e clara
      utterance.pitch = 1.18;  // tom mais suave e agudo característico de voz feminina
      utterance.volume = 1;

      // Seleciona a melhor voz feminina disponível no navegador
      const vozFeminina = obterVozDraNina();
      if (vozFeminina) {
        utterance.voice = vozFeminina;
      }

      utterance.onstart = () => {
        if (btnVoz) { btnVoz.classList.add('speaking'); const sp = btnVoz.querySelector('span'); if (sp) sp.textContent = 'Parar'; }
        if (btnVozGlobal) { btnVozGlobal.classList.add('narrating'); const sp = btnVozGlobal.querySelector('span'); if (sp) sp.textContent = 'Parar'; }
        exibirToast('A Dra. Nina está falando… clique para parar.');
      };

      utterance.onend = () => {
        ninaPararDeFalar();
      };

      utterance.onerror = () => {
        ninaPararDeFalar();
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn('Erro ao reproduzir voz:', err);
      simularTempoDeFala(texto);
    }
  } else {
    simularTempoDeFala(texto);
  }
}

/** Fallback de tempo de animação se o navegador não emitir áudio */
function simularTempoDeFala(texto) {
  const duracao = Math.max(2200, texto.length * 70);
  setTimeout(() => {
    if (ninaFalando) ninaPararDeFalar();
  }, duracao);
}

/**
 * Encerra a fala e restaura o sprite neutro da Dra. Nina
 */
function ninaPararDeFalar() {
  ninaFalando = false;
  appState.speaking = false;

  clearInterval(ninaIntervalFala);
  ninaIntervalFala = null;

  if (appState.speechSupported) {
    try { window.speechSynthesis.cancel(); } catch (_) {}
  }

  const imgEl = $('dra-nina-img');
  if (imgEl) {
    imgEl.classList.remove('dra-nina-falando');
  }
  ninaTrocarSprite('neutra');

  if (btnVoz) { btnVoz.classList.remove('speaking'); const sp = btnVoz.querySelector('span'); if (sp) sp.textContent = 'Ouvir'; }
  if (btnVozGlobal) { btnVozGlobal.classList.remove('narrating'); const sp = btnVozGlobal.querySelector('span'); if (sp) sp.textContent = 'Narrar'; }
  exibirToast(null);
}

/**
 * Atualiza o balão de fala da Dra. Nina com transição visual
 * @param {string} msg
 * @param {'default'|'success'|'error'|'typing'} estado
 */
function atualizarNina(msg, estado = 'default') {
  if (!ninaBalloon || !balloonText) return;
  ninaBalloon.classList.remove('state-success','state-error','typing');
  if (estado === 'success') ninaBalloon.classList.add('state-success');
  if (estado === 'error')   ninaBalloon.classList.add('state-error');
  if (estado === 'typing')  ninaBalloon.classList.add('typing');

  balloonText.style.opacity   = '0';
  balloonText.style.transform = 'translateY(4px)';
  setTimeout(() => {
    balloonText.textContent        = msg;
    balloonText.style.transition   = 'opacity .3s ease, transform .3s ease';
    balloonText.style.opacity      = '1';
    balloonText.style.transform    = 'translateY(0)';
  }, 150);
}

/**
 * Mantida para retrocompatibilidade de estados de reações
 */
function setNinaEstado(estado) {
  const imgEl = $('dra-nina-img');
  if (imgEl) {
    imgEl.classList.remove('dra-nina-happy', 'dra-nina-sad');
    if (estado === 'happy' || estado === 'piscando') {
      imgEl.classList.add('dra-nina-happy');
      ninaPiscar();
      setTimeout(() => imgEl.classList.remove('dra-nina-happy'), 1600);
    } else if (estado === 'sad') {
      imgEl.classList.add('dra-nina-sad');
    }
  }
}

/* ═══════════════════════════════════════════════════════════════════
   8. DICAS DO DIA
   ═══════════════════════════════════════════════════════════════════ */
function renderTip(idx) {
  if (!tipTexto || !tipCounter) return;
  appState.tipIndex = ((idx % DICAS_DO_DIA.length) + DICAS_DO_DIA.length) % DICAS_DO_DIA.length;
  tipTexto.style.opacity   = '0';
  tipTexto.style.transform = 'translateY(4px)';
  setTimeout(() => {
    tipTexto.textContent = DICAS_DO_DIA[appState.tipIndex];
    tipCounter.textContent = `${appState.tipIndex + 1}/${DICAS_DO_DIA.length}`;
    tipTexto.style.transition = 'opacity .3s ease, transform .3s ease';
    tipTexto.style.opacity   = '1';
    tipTexto.style.transform = 'translateY(0)';
  }, 120);
}

function iniciarRotacaoTips() {
  // Escolhe dica aleatória do dia baseada na data
  const diaDoAno = Math.floor((Date.now() - new Date(new Date().getFullYear(),0,0)) / 86400000);
  renderTip(diaDoAno % DICAS_DO_DIA.length);

  // Rotação automática a cada 12s
  appState.tipTimer = setInterval(() => renderTip(appState.tipIndex + 1), 12000);
}

/* ═══════════════════════════════════════════════════════════════════
   9. ACESSIBILIDADE — Fonte e Contraste
   ═══════════════════════════════════════════════════════════════════ */
const FONT_SCALES   = [0.85, 1, 1.15, 1.30];
const FONT_LABELS   = ['Muito pequena','Normal','Grande','Muito grande'];

function aplicarFontScale(scale) {
  appState.fontScale = scale;
  document.documentElement.style.setProperty('--font-scale', scale);
  // Salva preferência
  try { localStorage.setItem('bs_fontScale', scale); } catch(_){}
  // ARIA feedback
  const idx  = FONT_SCALES.indexOf(scale);
  const label = FONT_LABELS[idx] || 'Ajustada';
  anunciarAria(`Tamanho de fonte: ${label}`);
}

function aumentarFonte() {
  const idx = FONT_SCALES.indexOf(appState.fontScale);
  if (idx < FONT_SCALES.length - 1) aplicarFontScale(FONT_SCALES[idx + 1]);
}
function diminuirFonte() {
  const idx = FONT_SCALES.indexOf(appState.fontScale);
  if (idx > 0) aplicarFontScale(FONT_SCALES[idx - 1]);
}
function resetarFonte() { aplicarFontScale(1); }

function toggleContraste() {
  appState.highContrast = !appState.highContrast;
  document.body.classList.toggle('high-contrast', appState.highContrast);
  if (btnContrast) {
    btnContrast.setAttribute('aria-pressed', appState.highContrast);
    btnContrast.classList.toggle('active', appState.highContrast);
  }
  try { localStorage.setItem('bs_highContrast', appState.highContrast); } catch(_){}
  anunciarAria(appState.highContrast ? 'Modo alto contraste ativado.' : 'Modo alto contraste desativado.');
}

/** Anuncia mensagem para leitores de tela via elemento aria-live oculto */
function anunciarAria(msg) {
  let el = $('aria-announcer');
  if (!el) {
    el = document.createElement('div');
    el.id = 'aria-announcer';
    el.setAttribute('role','status');
    el.setAttribute('aria-live','polite');
    el.setAttribute('aria-atomic','true');
    el.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;';
    document.body.appendChild(el);
  }
  el.textContent = '';
  setTimeout(() => { el.textContent = msg; }, 50);
}

/* ═══════════════════════════════════════════════════════════════════
   10. WEB SPEECH API (Síntese e Reconhecimento de Voz)
   ═══════════════════════════════════════════════════════════════════ */

let recognition = null;
let isListening = false;

/**
 * Inicia a pesquisa por comando de voz usando a SpeechRecognition API
 */
function iniciarComandoDeVoz() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

  if (!SpeechRecognition) {
    atualizarNina('Seu navegador não suporta pesquisa por voz. Tente usar o Google Chrome!', 'error');
    ninaComecarAFalar('Seu navegador não suporta pesquisa por voz. Tente usar o Google Chrome no computador ou celular.');
    return;
  }

  // Se já estiver escutando, para a gravação
  if (isListening) {
    pararComandoDeVoz();
    return;
  }

  // Interrompe qualquer áudio da Dra. Nina para o microfone não captar a própria voz do sistema
  ninaPararDeFalar();

  try {
    recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      isListening = true;
      if (btnMic) {
        btnMic.classList.add('listening');
        btnMic.setAttribute('aria-pressed', 'true');
        btnMic.setAttribute('title', 'Clique para cancelar escuta');
      }
      if (voiceBadge) voiceBadge.hidden = false;

      atualizarNina('Estou ouvindo! Diga o nome do medicamento...', 'typing');
      anunciarAria('Microfone ativado. Fale o nome do medicamento agora.');
    };

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      console.log('Comando de voz recebido:', transcript);

      // Tratamento inteligente: limpa pontuação e termos comuns
      let termo = transcript
        .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '')
        .replace(/^(pesquisar|buscar|encontrar|ver|tem|quero|o remédio|medicamento|remédio)\s+/i, '')
        .trim();

      if (!termo) termo = transcript.trim();

      if (inputMed) {
        inputMed.value = termo;
      }

      pararComandoDeVoz();

      // Executa a busca automaticamente com o termo reconhecido
      pesquisarMedicamento(termo);
    };

    recognition.onerror = (event) => {
      console.warn('Erro no comando de voz:', event.error);
      pararComandoDeVoz();

      if (event.error === 'not-allowed') {
        atualizarNina('Permissão de microfone negada. Permita o microfone no navegador.', 'error');
        ninaComecarAFalar('Permissão de microfone negada. Por favor, ative o microfone no navegador.');
      } else if (event.error === 'no-speech') {
        atualizarNina('Não ouvi nenhum medicamento. Clique no microfone e tente falar novamente!', 'error');
      } else {
        atualizarNina('Não foi possível reconhecer o áudio. Tente novamente.', 'error');
      }
    };

    recognition.onend = () => {
      pararComandoDeVoz();
    };

    recognition.start();
  } catch (err) {
    console.error('Falha ao iniciar comando de voz:', err);
    pararComandoDeVoz();
  }
}

/**
 * Encerra a escuta do comando de voz
 */
function pararComandoDeVoz() {
  isListening = false;
  if (recognition) {
    try { recognition.stop(); } catch (_) {}
    recognition = null;
  }
  if (btnMic) {
    btnMic.classList.remove('listening');
    btnMic.setAttribute('aria-pressed', 'false');
    btnMic.setAttribute('title', 'Falar nome do remédio (Pesquisa por Voz)');
  }
  if (voiceBadge) voiceBadge.hidden = true;
}

function gerarTextoVoz(medicamento, ubsList) {
  if (!ubsList.length) {
    return `Atenção. ${NINA_MSGS.naoEncontrado}`;
  }
  let txt = `${medicamento} está disponível em ${ubsList.length} unidade${ubsList.length>1?'s':''} básica${ubsList.length>1?'s':''} de saúde. `;
  ubsList.forEach((ubs, i) => {
    txt += `Opção ${i+1}: ${ubs.nome}. Endereço: ${ubs.endereco}. Horário: ${ubs.horario.replace(/\n/g,'. ')}. `;
    if (ubs.obs) txt += `Observação: ${ubs.obs}. `;
  });
  return txt;
}

function pararFala() {
  ninaPararDeFalar();
}

function lerEmVozAlta(textoCustom) {
  if (appState.speaking) {
    pararFala();
    return;
  }
  const texto = textoCustom || gerarTextoVoz(appState.ultimaBusca, appState.resultados);
  ninaComecarAFalar(texto);
}

function exibirToast(msg) {
  if (!toastVoz) return;
  if (!msg) { toastVoz.hidden = true; return; }
  if (toastVozMsg) toastVozMsg.textContent = msg;
  toastVoz.hidden = false;
}

/* ═══════════════════════════════════════════════════════════════════
   11. RENDERIZAÇÃO DOS CARDS DE UBS
   ═══════════════════════════════════════════════════════════════════ */
function criarCardUbs(ubs, nomeMed, apresentacao) {
  const card = document.createElement('article');
  card.className = `ubs-card ${classeStatusCard(ubs.estoque_percentual)}`;
  card.setAttribute('role','listitem');
  card.setAttribute('aria-label',`UBS: ${ubs.nome} — estoque ${ubs.estoque_percentual}%`);

  const linhasHor = ubs.horario.split('\n').map(l=>`<span class="d-block">${escapeHtml(l)}</span>`).join('');
  const cor       = corEstoque(ubs.estoque_percentual);
  const dispBadge = ubs.estoque_percentual > 0
    ? `<span class="badge-disponivel" aria-label="Disponível"><i class="bi bi-check-circle-fill" aria-hidden="true"></i> Disponível</span>`
    : `<span class="badge-falta" aria-label="Em falta"><i class="bi bi-x-circle-fill" aria-hidden="true"></i> Em falta</span>`;
  const zonaBadge = `<span class="badge-zona" aria-label="Zona ${escapeHtml(ubs.zona)}"><i class="bi bi-geo-alt" aria-hidden="true"></i> Zona ${escapeHtml(ubs.zona)}</span>`;

  card.innerHTML = `
    <div class="ubs-card-header">
      <div class="ubs-card-icon" aria-hidden="true"><i class="bi bi-hospital-fill"></i></div>
      <div class="ubs-card-name">${escapeHtml(ubs.nome)}</div>
      <div class="ubs-card-badges">${dispBadge}${zonaBadge}</div>
    </div>
    <div class="ubs-card-info">
      <div class="ubs-info-row">
        <i class="bi bi-capsule-pill info-icon" aria-hidden="true"></i>
        <div><div class="ubs-info-label">Medicamento</div>
        <div class="ubs-info-value">${escapeHtml(nomeMed)} · ${escapeHtml(apresentacao)}</div></div>
      </div>
      <div class="ubs-info-row">
        <i class="bi bi-geo-alt-fill info-icon" aria-hidden="true"></i>
        <div><div class="ubs-info-label">Endereço</div>
        <div class="ubs-info-value">${escapeHtml(ubs.endereco)}</div></div>
      </div>
      <div class="ubs-info-row">
        <i class="bi bi-clock-fill info-icon" aria-hidden="true"></i>
        <div><div class="ubs-info-label">Horário</div>
        <div class="ubs-info-value">${linhasHor}</div></div>
      </div>
      ${ubs.telefone?`
      <div class="ubs-info-row">
        <i class="bi bi-telephone-fill info-icon" aria-hidden="true"></i>
        <div><div class="ubs-info-label">Telefone</div>
        <div class="ubs-info-value">${escapeHtml(ubs.telefone)}</div></div>
      </div>`:''}
      ${ubs.obs?`
      <div class="ubs-info-row">
        <i class="bi bi-info-circle-fill info-icon" aria-hidden="true"></i>
        <div><div class="ubs-info-label">Observação</div>
        <div class="ubs-info-value">${escapeHtml(ubs.obs)}</div></div>
      </div>`:''}
    </div>
    <div class="ubs-stock-bar" aria-label="Estoque: ${ubs.estoque_percentual}%">
      <div class="stock-label">Nível de Estoque — ${ubs.estoque_percentual}%</div>
      <div class="stock-bar-track" role="progressbar"
        aria-valuenow="${ubs.estoque_percentual}" aria-valuemin="0" aria-valuemax="100">
        <div class="stock-bar-fill"
          style="width:${ubs.estoque_percentual}%;background:${cor};"></div>
      </div>
    </div>
    <div class="ubs-card-actions">
      <a href="${linkMaps(ubs.endereco)}" target="_blank" rel="noopener noreferrer"
        class="btn-mapa" aria-label="Ver ${escapeHtml(ubs.nome)} no Google Maps (nova aba)">
        <i class="bi bi-map-fill me-2" aria-hidden="true"></i>Ver no Mapa
      </a>
      ${ubs.telefone?`
      <a href="${linkTel(ubs.telefone)}" class="btn-ligar"
        aria-label="Ligar para ${escapeHtml(ubs.nome)}: ${escapeHtml(ubs.telefone)}">
        <i class="bi bi-telephone-fill me-2" aria-hidden="true"></i>Ligar
      </a>`:''}
    </div>
  `;
  return card;
}

/* ═══════════════════════════════════════════════════════════════════
   12. LÓGICA PRINCIPAL DE PESQUISA
   ═══════════════════════════════════════════════════════════════════ */
async function pesquisarMedicamento(termo) {
  if (!termo.trim()) {
    atualizarNina(NINA_MSGS.campoVazio, 'error');
    setNinaEstado('neutra');
    inputMed?.focus();
    return;
  }

  const termoBusca = normalizar(termo.trim());
  appState.ultimaBusca = termo.trim();

  pararFala();
  mostrarLoading(true);
  ocultarResultados();
  atualizarNina(NINA_MSGS.buscando(termo), 'typing');
  setNinaEstado('neutra');
  if (window.NinaAnimation) NinaAnimation.setState('thinking');

  // Simula latência de rede
  await new Promise(r => setTimeout(r, 450));

  /* ── Para produção: descomente o fetch ─────────────────────────
  let dados;
  try {
    const res = await fetch('dados_saude_sp.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    dados = await res.json();
  } catch(e) {
    console.error('Fetch error:', e);
    atualizarNina('Erro ao carregar dados. Tente novamente.', 'error');
    setNinaEstado('neutra');
    mostrarLoading(false);
    return;
  }
  const medicamentos = dados.medicamentos;
  ──────────────────────────────────────────────────────────────── */
  const medicamentos = DADOS_SAUDE_SP.medicamentos;

  // Busca fuzzy por nome, genérico ou categoria
  const encontrado = medicamentos.find(m => {
    const n = normalizar(m.nome);
    const g = normalizar(m.nome_generico);
    const c = normalizar(m.categoria);
    return n.includes(termoBusca) || g.includes(termoBusca) ||
           termoBusca.includes(n) || c.includes(termoBusca);
  });

  mostrarLoading(false);

  if (!encontrado || !encontrado.disponivel || !encontrado.ubs.length) {
    atualizarNina(NINA_MSGS.naoEncontrado, 'error');
    setNinaEstado('sad');
    ninaComecarAFalar(NINA_MSGS.naoEncontrado);
    appState.resultados      = [];
    appState.resultadosTotal = [];
    appState.medicamentoAtual = null;
    mostrarNaoEncontrado();
    return;
  }

  appState.medicamentoAtual = encontrado;
  appState.resultadosTotal  = encontrado.ubs;

  // Aplica filtro de zona
  aplicarFiltroZona();
}

/** Aplica (ou reaaplica) o filtro de zona aos resultados actuais */
function aplicarFiltroZona() {
  if (!appState.medicamentoAtual) return;

  const zona       = selectZona?.value || 'todas';
  const todas      = appState.resultadosTotal;
  const filtradas  = zona === 'todas' ? todas : todas.filter(u => u.zona === zona);

  appState.resultados = filtradas;

  const med = appState.medicamentoAtual;

  if (filtradas.length === 0) {
    // Medicamento existe mas não nesta zona
    const msg = NINA_MSGS.semZona(med.nome, zona);
    atualizarNina(msg, 'error');
    setNinaEstado('sad');
    ninaComecarAFalar(msg);
    mostrarFiltroVazio();
    return;
  }

  // Sucesso na localização do medicamento
  const msgSucesso = NINA_MSGS.encontrado(med.nome, filtradas.length);
  atualizarNina(msgSucesso, 'success');
  setNinaEstado('happy');
  ninaComecarAFalar(msgSucesso);

  // Renderiza cards
  listaUbs.innerHTML = '';
  filtradas.forEach(ubs => listaUbs.appendChild(criarCardUbs(ubs, med.nome, med.apresentacao)));

  // Meta info
  if (resultsTitleEl) resultsTitleEl.textContent = `${med.nome} · ${med.apresentacao}`;
  if (resultsSubtitleEl) {
    const zonaLabel = zona === 'todas' ? 'Todas as Zonas' : `Zona ${zona}`;
    resultsSubtitleEl.textContent = `${filtradas.length} UBS · ${med.categoria} · ${zonaLabel}`;
  }

  resultadosSection.hidden = false;
  if (notFoundState)  notFoundState.hidden  = true;
  if (filterEmpty)    filterEmpty.hidden    = true;

  setTimeout(() => resultadosSection.scrollIntoView({behavior:'smooth', block:'start'}), 100);
}

/* ═══════════════════════════════════════════════════════════════════
   13. CONTROLO DA UI
   ═══════════════════════════════════════════════════════════════════ */
function mostrarLoading(show) { if (loadingState) loadingState.hidden = !show; }

function ocultarResultados() {
  if (resultadosSection) resultadosSection.hidden = true;
  if (listaUbs)          listaUbs.innerHTML       = '';
  if (notFoundState)     notFoundState.hidden     = true;
  if (filterEmpty)       filterEmpty.hidden       = true;
}

function mostrarNaoEncontrado() {
  if (resultadosSection) resultadosSection.hidden = false;
  if (listaUbs)          listaUbs.innerHTML       = '';
  if (notFoundState)     notFoundState.hidden     = false;
  if (filterEmpty)       filterEmpty.hidden       = true;
}

function mostrarFiltroVazio() {
  if (resultadosSection) resultadosSection.hidden = false;
  if (listaUbs)          listaUbs.innerHTML       = '';
  if (notFoundState)     notFoundState.hidden     = true;
  if (filterEmpty)       filterEmpty.hidden       = false;
}

function resetarBusca() {
  pararFala();
  ocultarResultados();
  atualizarNina(NINA_MSGS.inicial, 'default');
  setNinaEstado('neutra');
  if (window.NinaAnimation) NinaAnimation.setState('idle');
  if (inputMed) inputMed.value  = '';
  if (selectZona) selectZona.value = 'todas';
  appState.ultimaBusca      = '';
  appState.resultados       = [];
  appState.resultadosTotal  = [];
  appState.medicamentoAtual = null;
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(() => inputMed?.focus(), 500);
}

/* ═══════════════════════════════════════════════════════════════════
   14. EVENTOS
   ═══════════════════════════════════════════════════════════════════ */

// Formulário de pesquisa
formPesquisa?.addEventListener('submit', e => {
  e.preventDefault();
  pesquisarMedicamento(inputMed?.value || '');
});

// Filtro de zona — dispara nova renderização sem pesquisar de novo
selectZona?.addEventListener('change', () => {
  if (appState.medicamentoAtual) aplicarFiltroZona();
});

// Chips de sugestão
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    const med = chip.dataset.med;
    if (inputMed) inputMed.value = med;
    pesquisarMedicamento(med);
  });
});

// Botão de comando de voz (microfone)
btnMic?.addEventListener('click', () => {
  iniciarComandoDeVoz();
});

// Botão voz (resultados)
btnVoz?.addEventListener('click', () => lerEmVozAlta());

// Botão voz global (a11y bar)
btnVozGlobal?.addEventListener('click', () => {
  if (appState.resultados.length) lerEmVozAlta();
  else lerEmVozAlta(NINA_MSGS.inicial);
});

// Botão narrar Nina (balão)
btnNarrarNina?.addEventListener('click', () => {
  const msg = balloonText?.textContent || NINA_MSGS.inicial;
  if (appState.speaking) { pararFala(); return; }
  lerEmVozAlta(msg);
});

// Parar fala (toast)
btnPararToast?.addEventListener('click', pararFala);

// Nova pesquisa
btnNovaBusca?.addEventListener('click', resetarBusca);

// Limpar filtro de zona
btnLimparFiltro?.addEventListener('click', () => {
  if (selectZona) selectZona.value = 'todas';
  aplicarFiltroZona();
});

// Tecla Escape — limpa fala e microfone
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    pararFala();
    pararComandoDeVoz();
  }
});

// Acessibilidade: fonte
btnFontIncrease?.addEventListener('click', aumentarFonte);
btnFontDecrease?.addEventListener('click', diminuirFonte);
btnFontReset?.addEventListener('click', resetarFonte);

// Alto contraste
btnContrast?.addEventListener('click', toggleContraste);

// Dicas
btnTipNext?.addEventListener('click', () => renderTip(appState.tipIndex + 1));
btnTipPrev?.addEventListener('click', () => renderTip(appState.tipIndex - 1));

// Dicas: pausa ao hover/focus
const tipCard = document.querySelector('.tip-card');
tipCard?.addEventListener('mouseenter', () => clearInterval(appState.tipTimer));
tipCard?.addEventListener('mouseleave', () => { appState.tipTimer = setInterval(()=>renderTip(appState.tipIndex+1),12000); });

// Limpeza ao sair
window.addEventListener('beforeunload', () => {
  pararFala();
  pararComandoDeVoz();
  clearTimeout(ninaTimeoutPiscar);
  clearInterval(appState.tipTimer);
  window.NinaAnimation?.destroy?.();
});

/* ═══════════════════════════════════════════════════════════════════
   15. INICIALIZAÇÃO
   ═══════════════════════════════════════════════════════════════════ */
function init() {
  // Restaura preferências salvas
  try {
    const savedScale    = parseFloat(localStorage.getItem('bs_fontScale'));
    const savedContrast = localStorage.getItem('bs_highContrast') === 'true';
    if (FONT_SCALES.includes(savedScale)) aplicarFontScale(savedScale);
    if (savedContrast) toggleContraste();
  } catch(_) {}

  // Mensagem inicial e sprite neutro
  atualizarNina(NINA_MSGS.inicial, 'default');
  ninaTrocarSprite('neutra');

  // Inicia o ciclo de piscar espontâneo da Dra. Nina
  ninaIniciarCicloPiscar();

  // Motor de animação SVG (contingência)
  if (window.NinaAnimation) {
    NinaAnimation.init();
    setNinaEstado('neutra');
  }

  // Dicas do dia
  iniciarRotacaoTips();

  // Foco inicial (evita zoom em mobile)
  if (!window.matchMedia('(max-width:768px)').matches) {
    inputMed?.focus();
  }

  // Carregamento e seleção da voz feminina da Dra. Nina
  if ('speechSynthesis' in window) {
    obterVozDraNina();
    window.speechSynthesis.onvoiceschanged = () => {
      const voz = obterVozDraNina();
      if (voz) console.info('Voz feminina da Dra. Nina configurada:', voz.name);
    };
  }

  console.info('%c BuscaSaúde FMU TECH 🏥 ','background:#1565C0;color:#fff;font-size:14px;padding:4px 10px;border-radius:6px;font-weight:bold;',
    '\nODS 3 · Dra. Nina com Voz Feminina e Sprites ativados!');
}

// Aguarda DOM
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
