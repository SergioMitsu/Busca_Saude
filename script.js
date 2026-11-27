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
      nomes_comerciais: ['Amoxil', 'Novocilin', 'Velamox', 'Clavulin'],
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
      nomes_comerciais: ['Novalgina', 'Anador', 'Lisador', 'Magnopyrol', 'Baralgina'],
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
      nomes_comerciais: ['Cozaar', 'Aradois', 'Losatec', 'Corus', 'Torlos'],
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
      nomes_comerciais: ['Glifage', 'Dimefor', 'Glucoformin', 'Risidon'],
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
      nomes_comerciais: ['Atenol', 'Angipress', 'Plenacor', 'Ritmicord'],
      apresentacao: '25mg · Comprimido', categoria: 'Betabloqueador / Anti-hipertensivo',
      disponivel: false, ubs: []
    },
    {
      id: 'med006', nome: 'Omeprazol',
      nome_generico: 'Omeprazol',
      nomes_comerciais: ['Losec', 'Peprazol', 'Omepramix', 'Victor', 'Gaspiren'],
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
      nomes_comerciais: ['Capoten', 'Hipocat', 'Captocord'],
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
      nomes_comerciais: ['Alivium', 'Advil', 'Buscofem', 'Dalsy', 'Spidufen'],
      apresentacao: '400mg · Comprimido', categoria: 'Anti-inflamatório',
      disponivel: false, ubs: []
    },
    {
      id: 'med009', nome: 'Paracetamol',
      nome_generico: 'Paracetamol',
      nomes_comerciais: ['Tylenol', 'Parador', 'Dôrico', 'Tynefrin'],
      apresentacao: '500mg · Comprimido', categoria: 'Analgésico / Antitérmico',
      disponivel: true,
      ubs: [
        { id:'ubs001', zona:'Oeste', nome:'UBS Dr. José Leão – Vila Madalena',
          endereco:'Rua Mourato Coelho, 872 – Vila Madalena, São Paulo – SP', cep:'05417-011',
          telefone:'(11) 3812-4400', horario:'Segunda a Sexta: 07h às 19h\nSábado: 07h às 13h',
          coordenadas:{lat:-23.5558,lng:-46.6975}, estoque_percentual:94,
          obs:'Disponível sem receita médica.' },
        { id:'ubs003', zona:'Norte', nome:'UBS Santana – Zona Norte',
          endereco:'Rua Voluntários da Pátria, 1553 – Santana, São Paulo – SP', cep:'02011-001',
          telefone:'(11) 2973-5600', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.5014,lng:-46.6226}, estoque_percentual:82,
          obs:'Disponível para retirada imediata.' },
        { id:'ubs007', zona:'Leste', nome:'UBS Itaquera – Zona Leste',
          endereco:'Rua Mário Fonseca, 90 – Itaquera, São Paulo – SP', cep:'08230-010',
          telefone:'(11) 2074-5300', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.5342,lng:-46.4475}, estoque_percentual:76,
          obs:'Estoque regularizado.' }
      ]
    },
    {
      id: 'med010', nome: 'Sinvastatina',
      nome_generico: 'Sinvastatina',
      nomes_comerciais: ['Zocor', 'Sinvax', 'Vaslip', 'Sinvascor'],
      apresentacao: '20mg · Comprimido', categoria: 'Hipolipemiante (Colesterol)',
      disponivel: true,
      ubs: [
        { id:'ubs002', zona:'Centro', nome:'UBS Jardim Paulista',
          endereco:'Alameda Joaquim Eugênio de Lima, 1400 – Jardim Paulista, São Paulo – SP', cep:'01403-001',
          telefone:'(11) 3255-5800', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.5715,lng:-46.6543}, estoque_percentual:88,
          obs:'Necessário receita médica.' },
        { id:'ubs008', zona:'Sul', nome:'UBS Santo Amaro – Zona Sul',
          endereco:'Rua Amador Bueno, 536 – Santo Amaro, São Paulo – SP', cep:'04752-005',
          telefone:'(11) 5681-3200', horario:'Segunda a Sexta: 07h às 19h',
          coordenadas:{lat:-23.6500,lng:-46.7100}, estoque_percentual:69,
          obs:'Programa de prevenção cardiovascular.' }
      ]
    },
    {
      id: 'med011', nome: 'Salbutamol',
      nome_generico: 'Sulfato de Salbutamol',
      nomes_comerciais: ['Aerolin', 'Aerodini', 'Asmavent'],
      apresentacao: '100mcg/dose · Spray aerossol', categoria: 'Broncodilatador (Asma / DPOC)',
      disponivel: true,
      ubs: [
        { id:'ubs005', zona:'Centro', nome:'UBS Bela Vista – Centro',
          endereco:'Av. Brigadeiro Luís Antônio, 2393 – Bela Vista, São Paulo – SP', cep:'01401-000',
          telefone:'(11) 3107-2200', horario:'Segunda a Sexta: 07h às 19h',
          coordenadas:{lat:-23.5618,lng:-46.6549}, estoque_percentual:85,
          obs:'Retirada com receita e orientações sobre uso de espaçador.' },
        { id:'ubs004', zona:'Sul', nome:'UBS Campo Limpo – Zona Sul',
          endereco:'Av. Franz Voegeli, 40 – Campo Limpo, São Paulo – SP', cep:'05755-000',
          telefone:'(11) 5841-9000', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.6485,lng:-46.7627}, estoque_percentual:58,
          obs:'Acompanhamento do programa Respira São Paulo.' }
      ]
    },
    {
      id: 'med012', nome: 'Hidroclorotiazida',
      nome_generico: 'Hidroclorotiazida',
      nomes_comerciais: ['Clorana', 'Drenol', 'Moduretic'],
      apresentacao: '25mg · Comprimido', categoria: 'Diurético / Anti-hipertensivo',
      disponivel: true,
      ubs: [
        { id:'ubs001', zona:'Oeste', nome:'UBS Dr. José Leão – Vila Madalena',
          endereco:'Rua Mourato Coelho, 872 – Vila Madalena, São Paulo – SP', cep:'05417-011',
          telefone:'(11) 3812-4400', horario:'Segunda a Sexta: 07h às 19h',
          coordenadas:{lat:-23.5558,lng:-46.6975}, estoque_percentual:90,
          obs:'Integrado ao Programa HIPERDIA.' },
        { id:'ubs002', zona:'Centro', nome:'UBS Jardim Paulista',
          endereco:'Alameda Joaquim Eugênio de Lima, 1400 – Jardim Paulista, São Paulo – SP', cep:'01403-001',
          telefone:'(11) 3255-5800', horario:'Segunda a Sexta: 07h às 17h',
          coordenadas:{lat:-23.5715,lng:-46.6543}, estoque_percentual:75,
          obs:'Disponível mediante apresentação de receita médica.' }
      ]
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
const autocompleteDropdown = $('autocomplete-dropdown');
const alertaComercialSus   = $('alerta-comercial-sus');
const alertaComercialTexto = $('alerta-comercial-texto');

/* ═══════════════════════════════════════════════════════════════════
   5. ESTADO GLOBAL DA APLICAÇÃO
   ═══════════════════════════════════════════════════════════════════ */
const appState = {
  ultimaBusca:               '',
  marcaReferenciaPesquisada: null, // Guarda o nome comercial quando pesquisado
  resultados:                [],   // UBS filtradas pela zona atual
  resultadosTotal:           [],   // Todas as UBS do medicamento encontrado
  medicamentoAtual:          null,
  speaking:                  false,
  speechSynth:               window.speechSynthesis || null,
  speechSupported:          'speechSynthesis' in window,
  fontScale:                 1,    // 0.85 | 1 | 1.15 | 1.30
  highContrast:              false,
  tipIndex:                  0,
  tipTimer:                  null,
  sugestoesAtuais:           [],   // Sugestões ativas no autocomplete
  activeSuggestionIndex:     -1    // Índice da sugestão focada via teclado
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
   12. AUTOCOMPLETE INTELIGENTE & SUGESTÕES DINÂMICAS
   ═══════════════════════════════════════════════════════════════════ */

/**
 * Salva um termo no histórico local de pesquisas recentes (máx 5)
 */
function salvarBuscaRecente(termo) {
  if (!termo || !termo.trim()) return;
  const t = termo.trim();
  let historico = obterHistoricoRecente();
  historico = historico.filter(item => normalizar(item) !== normalizar(t));
  historico.unshift(t);
  if (historico.length > 5) historico = historico.slice(0, 5);
  try {
    localStorage.setItem('bs_recent_searches', JSON.stringify(historico));
  } catch (_) {}
}

/**
 * Recupera o histórico de pesquisas recentes
 */
function obterHistoricoRecente() {
  try {
    const raw = localStorage.getItem('bs_recent_searches');
    return raw ? JSON.parse(raw) : [];
  } catch (_) {
    return [];
  }
}

/**
 * Limpa o histórico de pesquisas
 */
function limparHistoricoRecente() {
  try {
    localStorage.removeItem('bs_recent_searches');
  } catch (_) {}
  fecharAutocomplete();
  anunciarAria('Histórico de pesquisas limpo com sucesso.');
}

/**
 * Destaca visualmente no texto a substring correspondente ao que foi digitado
 */
function destacarTermo(texto, termo) {
  if (!termo || !texto) return escapeHtml(texto);
  const textoLimpo = String(texto);
  const termoNorm  = normalizar(termo.trim());
  const textoNorm  = normalizar(textoLimpo);
  const idx        = textoNorm.indexOf(termoNorm);
  if (idx === -1) return escapeHtml(textoLimpo);

  const antes  = textoLimpo.substring(0, idx);
  const meio   = textoLimpo.substring(idx, idx + termo.trim().length);
  const depois = textoLimpo.substring(idx + termo.trim().length);

  return `${escapeHtml(antes)}<mark class="highlight-match">${escapeHtml(meio)}</mark>${escapeHtml(depois)}`;
}

/**
 * Realiza a busca em tempo real por medicamentos e marcas comerciais
 * @param {string} termo
 */
function buscarSugestoesAutocomplete(termo) {
  if (!termo || !termo.trim()) return [];
  const termoNorm = normalizar(termo.trim());
  const sugestoes = [];
  const medicamentos = DADOS_SAUDE_SP.medicamentos;

  medicamentos.forEach(med => {
    const nomeNorm = normalizar(med.nome);
    const genNorm  = normalizar(med.nome_generico);
    const catNorm  = normalizar(med.categoria);

    // 1. Match no Nome Oficial SUS (Princípio Ativo)
    let scorePrincipal = 0;
    if (nomeNorm === termoNorm) {
      scorePrincipal = 100;
    } else if (nomeNorm.startsWith(termoNorm)) {
      scorePrincipal = 85;
    } else if (nomeNorm.includes(termoNorm)) {
      scorePrincipal = 60;
    } else if (genNorm.includes(termoNorm)) {
      scorePrincipal = 45;
    } else if (catNorm.includes(termoNorm)) {
      scorePrincipal = 30;
    }

    if (scorePrincipal > 0) {
      sugestoes.push({
        tipo: 'generico',
        termoBusca: med.nome,
        nomeExibicao: med.nome,
        medicamento: med,
        score: scorePrincipal
      });
    }

    // 2. Match em Nomes Comerciais (Marcas de Referência / Populares)
    if (med.nomes_comerciais && Array.isArray(med.nomes_comerciais)) {
      med.nomes_comerciais.forEach(marca => {
        const marcaNorm = normalizar(marca);
        let scoreMarca = 0;
        if (marcaNorm === termoNorm) {
          scoreMarca = 95;
        } else if (marcaNorm.startsWith(termoNorm)) {
          scoreMarca = 80;
        } else if (marcaNorm.includes(termoNorm)) {
          scoreMarca = 50;
        }

        if (scoreMarca > 0) {
          sugestoes.push({
            tipo: 'comercial',
            termoBusca: marca,
            nomeExibicao: marca,
            nomeComercial: marca,
            medicamento: med,
            score: scoreMarca
          });
        }
      });
    }
  });

  // Ordena por relevância (pontuação mais alta primeiro)
  sugestoes.sort((a, b) => b.score - a.score);

  // Remove duplicatas mantendo a maior relevância e limita a 6 resultados
  const vistas = new Set();
  const unicas = [];
  for (const s of sugestoes) {
    const chave = `${s.tipo}-${s.nomeExibicao}-${s.medicamento.id}`;
    if (!vistas.has(chave)) {
      vistas.add(chave);
      unicas.push(s);
      if (unicas.length >= 6) break;
    }
  }

  return unicas;
}

/**
 * Renderiza o painel quando o usuário clica/foca no campo ainda vazio
 */
function renderizarPainelFocoInicial() {
  if (!autocompleteDropdown) return;
  const historico = obterHistoricoRecente();

  let html = '';
  if (historico.length > 0) {
    html = `
      <div class="autocomplete-header">
        <span><i class="bi bi-clock-history me-1" aria-hidden="true"></i>Pesquisas Recentes</span>
        <button type="button" class="btn-limpar-historico-autocomplete" id="btn-limpar-hist" title="Limpar histórico de buscas">Limpar histórico</button>
      </div>
      <ul class="autocomplete-list" role="listbox">
    `;
    historico.forEach((item, idx) => {
      html += `
        <li class="autocomplete-item autocomplete-recent-item" role="option" data-termo="${escapeHtml(item)}" tabindex="0">
          <div class="autocomplete-item-content">
            <div class="d-flex align-items-center gap-2">
              <i class="bi bi-clock text-muted" aria-hidden="true"></i>
              <strong class="autocomplete-item-name" style="font-size:var(--fs-sm);">${escapeHtml(item)}</strong>
            </div>
          </div>
          <i class="bi bi-arrow-up-left text-muted" aria-hidden="true"></i>
        </li>
      `;
    });
    html += `</ul>`;
  } else {
    // Sugestões populares se o histórico estiver vazio
    html = `
      <div class="autocomplete-header">
        <span><i class="bi bi-lightning-charge-fill me-1" aria-hidden="true"></i>Sugestões Rápidas (Genéricos e Marcas)</span>
      </div>
      <ul class="autocomplete-list" role="listbox">
        <li class="autocomplete-item autocomplete-recent-item" role="option" data-termo="Dipirona" tabindex="0">
          <div class="autocomplete-item-content">
            <div class="autocomplete-item-top">
              <strong class="autocomplete-item-name">Dipirona</strong>
              <span class="badge-tag-generico">Genérico SUS</span>
            </div>
            <span class="autocomplete-item-sub">Marca de referência: Novalgina, Anador</span>
          </div>
        </li>
        <li class="autocomplete-item autocomplete-recent-item" role="option" data-termo="Novalgina" tabindex="0">
          <div class="autocomplete-item-content">
            <div class="autocomplete-item-top">
              <strong class="autocomplete-item-name">Novalgina</strong>
              <span class="badge-tag-comercial"><i class="bi bi-tag-fill me-1"></i>Marca Comercial</span>
            </div>
            <span class="autocomplete-item-sub">Dispensado no SUS como: <strong>Dipirona (500mg)</strong></span>
          </div>
        </li>
        <li class="autocomplete-item autocomplete-recent-item" role="option" data-termo="Glifage" tabindex="0">
          <div class="autocomplete-item-content">
            <div class="autocomplete-item-top">
              <strong class="autocomplete-item-name">Glifage</strong>
              <span class="badge-tag-comercial"><i class="bi bi-tag-fill me-1"></i>Marca Comercial</span>
            </div>
            <span class="autocomplete-item-sub">Dispensado no SUS como: <strong>Metformina (850mg)</strong></span>
          </div>
        </li>
        <li class="autocomplete-item autocomplete-recent-item" role="option" data-termo="Amoxicilina" tabindex="0">
          <div class="autocomplete-item-content">
            <div class="autocomplete-item-top">
              <strong class="autocomplete-item-name">Amoxicilina</strong>
              <span class="badge-tag-generico">Genérico SUS</span>
            </div>
            <span class="autocomplete-item-sub">Marca de referência: Amoxil (500mg)</span>
          </div>
        </li>
      </ul>
    `;
  }

  html += `
    <div class="autocomplete-footer">
      <span><i class="bi bi-search me-1" aria-hidden="true"></i>Digite um remédio ou marca comercial</span>
      <span>BuscaSaúde · ODS 3</span>
    </div>
  `;

  autocompleteDropdown.innerHTML = html;
  autocompleteDropdown.hidden = false;
  if (inputMed) inputMed.setAttribute('aria-expanded', 'true');

  const btnLimpar = autocompleteDropdown.querySelector('#btn-limpar-hist');
  btnLimpar?.addEventListener('click', (e) => {
    e.stopPropagation();
    limparHistoricoRecente();
  });

  const itens = autocompleteDropdown.querySelectorAll('.autocomplete-recent-item');
  itens.forEach(item => {
    item.addEventListener('click', () => {
      const termo = item.dataset.termo;
      if (inputMed) inputMed.value = termo;
      fecharAutocomplete();
      pesquisarMedicamento(termo);
    });
  });
}

/**
 * Renderiza as sugestões dinâmicas conforme a digitação do usuário
 */
function renderizarAutocomplete(sugestoes, termo) {
  if (!autocompleteDropdown) return;
  appState.sugestoesAtuais = sugestoes;
  appState.activeSuggestionIndex = -1;

  if (inputMed) {
    inputMed.setAttribute('aria-expanded', 'true');
    inputMed.removeAttribute('aria-activedescendant');
  }

  if (sugestoes.length === 0) {
    autocompleteDropdown.innerHTML = `
      <div class="autocomplete-empty">
        <span class="autocomplete-empty-icon" aria-hidden="true">🔍</span>
        <p class="autocomplete-empty-title">Nenhum medicamento encontrado para "${escapeHtml(termo)}"</p>
        <p class="autocomplete-empty-tip">Tente buscar pelo princípio ativo (ex: Dipirona) ou marca conhecida (ex: Novalgina, Glifage, Advil).</p>
      </div>
    `;
    autocompleteDropdown.hidden = false;
    return;
  }

  let html = `
    <div class="autocomplete-header">
      <span><i class="bi bi-stars me-1" aria-hidden="true"></i>Sugestões Inteligentes (${sugestoes.length})</span>
      <span class="d-none d-sm-inline text-muted" style="font-weight:600;font-size:11px;">Use ↑↓ para navegar · Enter para escolher</span>
    </div>
    <ul class="autocomplete-list" role="listbox">
  `;

  sugestoes.forEach((sug, idx) => {
    const med = sug.medicamento;
    const temEstoque = med.disponivel && med.ubs && med.ubs.length > 0;
    const badgeEstoque = temEstoque
      ? `<span class="badge-stock-sim"><i class="bi bi-check-circle-fill" aria-hidden="true"></i> Disponível nas UBS</span>`
      : `<span class="badge-stock-nao"><i class="bi bi-x-circle-fill" aria-hidden="true"></i> Em falta</span>`;

    if (sug.tipo === 'comercial') {
      // Sugestão identificada por Nome Comercial
      html += `
        <li id="sugestao-${idx}" class="autocomplete-item" role="option" aria-selected="false" data-index="${idx}" tabindex="0">
          <div class="autocomplete-item-content">
            <div class="autocomplete-item-top">
              <span class="autocomplete-item-name">${destacarTermo(sug.nomeComercial, termo)}</span>
              <span class="badge-tag-comercial"><i class="bi bi-tag-fill me-1" aria-hidden="true"></i>Nome Comercial</span>
            </div>
            <div class="autocomplete-item-sub">
              <strong>Princípio Ativo SUS:</strong> ${escapeHtml(med.nome)} · ${escapeHtml(med.apresentacao)}
            </div>
            <div class="autocomplete-item-sub text-muted">
              ${escapeHtml(med.categoria)}
            </div>
          </div>
          <div class="autocomplete-item-badge">
            ${badgeEstoque}
          </div>
        </li>
      `;
    } else {
      // Sugestão pelo Princípio Ativo (Genérico Oficial)
      const nomesComerciaisStr = med.nomes_comerciais && med.nomes_comerciais.length
        ? `<div class="autocomplete-item-brands"><i class="bi bi-tag me-1" aria-hidden="true"></i>Marcas: ${escapeHtml(med.nomes_comerciais.slice(0, 3).join(', '))}${med.nomes_comerciais.length > 3 ? '...' : ''}</div>`
        : '';

      html += `
        <li id="sugestao-${idx}" class="autocomplete-item" role="option" aria-selected="false" data-index="${idx}" tabindex="0">
          <div class="autocomplete-item-content">
            <div class="autocomplete-item-top">
              <span class="autocomplete-item-name">${destacarTermo(med.nome, termo)}</span>
              <span class="badge-tag-generico"><i class="bi bi-capsule me-1" aria-hidden="true"></i>Genérico SUS</span>
            </div>
            <div class="autocomplete-item-sub">
              ${escapeHtml(med.apresentacao)} · ${escapeHtml(med.categoria)}
            </div>
            ${nomesComerciaisStr}
          </div>
          <div class="autocomplete-item-badge">
            ${badgeEstoque}
          </div>
        </li>
      `;
    }
  });

  html += `
    </ul>
    <div class="autocomplete-footer">
      <span><i class="bi bi-shield-check me-1" aria-hidden="true"></i>Base oficial SUS · São Paulo</span>
      <span>Clique ou aperte Enter</span>
    </div>
  `;

  autocompleteDropdown.innerHTML = html;
  autocompleteDropdown.hidden = false;

  // Eventos de clique nas opções
  const itens = autocompleteDropdown.querySelectorAll('.autocomplete-item');
  itens.forEach(item => {
    item.addEventListener('click', () => {
      const idx = parseInt(item.dataset.index, 10);
      selecionarSugestao(idx);
    });
  });
}

/**
 * Trata a seleção de uma sugestão do autocomplete
 */
function selecionarSugestao(index) {
  const sugestao = appState.sugestoesAtuais[index];
  if (!sugestao) return;

  fecharAutocomplete();

  if (sugestao.tipo === 'comercial') {
    appState.marcaReferenciaPesquisada = sugestao.nomeComercial;
    if (inputMed) inputMed.value = sugestao.nomeComercial;
    pesquisarMedicamento(sugestao.nomeComercial);
  } else {
    appState.marcaReferenciaPesquisada = null;
    if (inputMed) inputMed.value = sugestao.medicamento.nome;
    pesquisarMedicamento(sugestao.medicamento.nome);
  }
}

/**
 * Fecha o dropdown do autocomplete e redefine estados
 */
function fecharAutocomplete() {
  if (autocompleteDropdown) {
    autocompleteDropdown.hidden = true;
    autocompleteDropdown.innerHTML = '';
  }
  if (inputMed) {
    inputMed.setAttribute('aria-expanded', 'false');
    inputMed.removeAttribute('aria-activedescendant');
  }
  appState.sugestoesAtuais = [];
  appState.activeSuggestionIndex = -1;
}

/**
 * Atualiza visualmente a sugestão ativa durante a navegação por teclado (ArrowUp / ArrowDown)
 */
function atualizarItemAtivo(items) {
  items.forEach((item, idx) => {
    const isActive = idx === appState.activeSuggestionIndex;
    item.classList.toggle('active', isActive);
    item.setAttribute('aria-selected', isActive ? 'true' : 'false');
    if (isActive) {
      item.scrollIntoView({ block: 'nearest' });
      inputMed?.setAttribute('aria-activedescendant', `sugestao-${idx}`);
    }
  });
}

/* ═══════════════════════════════════════════════════════════════════
   13. LÓGICA PRINCIPAL DE PESQUISA
   ═══════════════════════════════════════════════════════════════════ */
async function pesquisarMedicamento(termo) {
  if (!termo || !termo.trim()) {
    atualizarNina(NINA_MSGS.campoVazio, 'error');
    setNinaEstado('neutra');
    inputMed?.focus();
    return;
  }

  const termoLimpo = termo.trim();
  const termoBusca = normalizar(termoLimpo);
  appState.ultimaBusca = termoLimpo;

  // Salva no histórico de buscas
  salvarBuscaRecente(termoLimpo);

  fecharAutocomplete();
  pararFala();
  mostrarLoading(true);
  ocultarResultados();
  if (alertaComercialSus) alertaComercialSus.hidden = true;

  atualizarNina(NINA_MSGS.buscando(termoLimpo), 'typing');
  setNinaEstado('neutra');
  if (window.NinaAnimation) NinaAnimation.setState('thinking');

  // Simula latência de rede realista
  await new Promise(r => setTimeout(r, 450));

  const medicamentos = DADOS_SAUDE_SP.medicamentos;

  // 1. Busca inteligente: verifica correspondência por marca comercial ou nome oficial
  let marcaEncontrada = null;
  let encontrado = null;

  // Primeiro tenta identificar se é um nome comercial cadastrado
  for (const m of medicamentos) {
    if (m.nomes_comerciais && Array.isArray(m.nomes_comerciais)) {
      const mc = m.nomes_comerciais.find(marca => {
        const marcaNorm = normalizar(marca);
        return marcaNorm === termoBusca || marcaNorm.startsWith(termoBusca) || termoBusca.includes(marcaNorm);
      });
      if (mc) {
        marcaEncontrada = mc;
        encontrado = m;
        break;
      }
    }
  }

  // Se não foi por marca comercial, busca pelo princípio ativo, genérico ou categoria
  if (!encontrado) {
    encontrado = medicamentos.find(m => {
      const n = normalizar(m.nome);
      const g = normalizar(m.nome_generico);
      const c = normalizar(m.categoria);
      return n.includes(termoBusca) || g.includes(termoBusca) ||
             termoBusca.includes(n) || c.includes(termoBusca);
    });
  }

  mostrarLoading(false);

  if (!encontrado || !encontrado.disponivel || !encontrado.ubs.length) {
    atualizarNina(NINA_MSGS.naoEncontrado, 'error');
    setNinaEstado('sad');
    ninaComecarAFalar(NINA_MSGS.naoEncontrado);
    appState.resultados      = [];
    appState.resultadosTotal = [];
    appState.medicamentoAtual = null;
    appState.marcaReferenciaPesquisada = null;
    mostrarNaoEncontrado();
    return;
  }

  appState.medicamentoAtual = encontrado;
  appState.resultadosTotal  = encontrado.ubs;
  appState.marcaReferenciaPesquisada = marcaEncontrada;

  // Aplica filtro de zona e renderiza os resultados
  aplicarFiltroZona();
}

/** Aplica (ou reaplica) o filtro de zona aos resultados atuais */
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
  if (appState.marcaReferenciaPesquisada) {
    const marca = appState.marcaReferenciaPesquisada;
    const msgSucesso = `Você buscou pela marca ${marca}. No SUS, esse medicamento é fornecido pelo princípio ativo ${med.nome} (${med.apresentacao}). Encontrei disponível em ${filtradas.length} UBS próxima${filtradas.length > 1 ? 's' : ''}! 🎉`;
    atualizarNina(msgSucesso, 'success');
    setNinaEstado('happy');
    ninaComecarAFalar(`Você pesquisou pela marca comercial ${marca}. No SUS, esse medicamento é distribuído gratuitamente como ${med.nome}. Encontrei disponível em ${filtradas.length} unidades de saúde!`);

    if (alertaComercialSus && alertaComercialTexto) {
      alertaComercialTexto.innerHTML = `
        Você pesquisou pela marca comercial <strong>${escapeHtml(marca)}</strong>.
        Nas farmácias das UBS de São Paulo, o medicamento é distribuído sob a denominação genérica oficial de <strong>${escapeHtml(med.nome)} (${escapeHtml(med.nome_generico)} - ${escapeHtml(med.apresentacao)})</strong>, com idêntica eficácia, segurança e qualidade atestadas pela ANVISA.
      `;
      alertaComercialSus.hidden = false;
    }
  } else {
    const msgSucesso = NINA_MSGS.encontrado(med.nome, filtradas.length);
    atualizarNina(msgSucesso, 'success');
    setNinaEstado('happy');
    ninaComecarAFalar(msgSucesso);

    if (alertaComercialSus && alertaComercialTexto) {
      if (med.nomes_comerciais && med.nomes_comerciais.length) {
        alertaComercialTexto.innerHTML = `
          <strong>Atenção farmacêutica:</strong> <strong>${escapeHtml(med.nome)}</strong> é o princípio ativo oficial do SUS.
          Marcas comerciais de referência populares com a mesma substância: <strong>${escapeHtml(med.nomes_comerciais.join(', '))}</strong>.
        `;
        alertaComercialSus.hidden = false;
      } else {
        alertaComercialSus.hidden = true;
      }
    }
  }

  // Renderiza cards
  listaUbs.innerHTML = '';
  filtradas.forEach(ubs => listaUbs.appendChild(criarCardUbs(ubs, med.nome, med.apresentacao)));

  // Meta info
  if (resultsTitleEl) {
    if (appState.marcaReferenciaPesquisada) {
      resultsTitleEl.innerHTML = `${escapeHtml(med.nome)} · ${escapeHtml(med.apresentacao)} <span class="badge-tag-comercial ms-2"><i class="bi bi-tag-fill me-1"></i>Ref: ${escapeHtml(appState.marcaReferenciaPesquisada)}</span>`;
    } else {
      resultsTitleEl.textContent = `${med.nome} · ${med.apresentacao}`;
    }
  }
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
   14. CONTROLO DA UI
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
  fecharAutocomplete();
  ocultarResultados();
  if (alertaComercialSus) alertaComercialSus.hidden = true;
  atualizarNina(NINA_MSGS.inicial, 'default');
  setNinaEstado('neutra');
  if (window.NinaAnimation) NinaAnimation.setState('idle');
  if (inputMed) inputMed.value  = '';
  if (selectZona) selectZona.value = 'todas';
  appState.ultimaBusca      = '';
  appState.marcaReferenciaPesquisada = null;
  appState.resultados       = [];
  appState.resultadosTotal  = [];
  appState.medicamentoAtual = null;
  window.scrollTo({top:0, behavior:'smooth'});
  setTimeout(() => inputMed?.focus(), 500);
}

/* ═══════════════════════════════════════════════════════════════════
   15. EVENTOS
   ═══════════════════════════════════════════════════════════════════ */

// Formulário de pesquisa
formPesquisa?.addEventListener('submit', e => {
  e.preventDefault();
  fecharAutocomplete();
  pesquisarMedicamento(inputMed?.value || '');
});

// Autocomplete: digitação em tempo real (input event)
inputMed?.addEventListener('input', () => {
  const termo = inputMed.value;
  if (!termo.trim()) {
    renderizarPainelFocoInicial();
    return;
  }
  const sugestoes = buscarSugestoesAutocomplete(termo);
  renderizarAutocomplete(sugestoes, termo);
});

// Autocomplete: foco no input (exibe histórico ou sugestões)
inputMed?.addEventListener('focus', () => {
  const termo = inputMed.value;
  if (!termo.trim()) {
    renderizarPainelFocoInicial();
  } else {
    const sugestoes = buscarSugestoesAutocomplete(termo);
    renderizarAutocomplete(sugestoes, termo);
  }
});

// Autocomplete: navegação por teclado (ArrowDown, ArrowUp, Enter, Escape)
inputMed?.addEventListener('keydown', (e) => {
  if (!autocompleteDropdown || autocompleteDropdown.hidden || !appState.sugestoesAtuais.length) {
    if (e.key === 'ArrowDown' && inputMed.value.trim() === '') {
      renderizarPainelFocoInicial();
      e.preventDefault();
    }
    return;
  }

  const total = appState.sugestoesAtuais.length;
  const items = autocompleteDropdown.querySelectorAll('.autocomplete-item');

  if (e.key === 'ArrowDown') {
    e.preventDefault();
    appState.activeSuggestionIndex = (appState.activeSuggestionIndex + 1) % total;
    atualizarItemAtivo(items);
  } else if (e.key === 'ArrowUp') {
    e.preventDefault();
    appState.activeSuggestionIndex = (appState.activeSuggestionIndex - 1 + total) % total;
    atualizarItemAtivo(items);
  } else if (e.key === 'Enter') {
    if (appState.activeSuggestionIndex >= 0 && appState.activeSuggestionIndex < total) {
      e.preventDefault();
      selecionarSugestao(appState.activeSuggestionIndex);
    }
  } else if (e.key === 'Escape') {
    fecharAutocomplete();
  }
});

// Fecha o autocomplete ao clicar fora
document.addEventListener('click', (e) => {
  if (!formPesquisa?.contains(e.target) && !autocompleteDropdown?.contains(e.target)) {
    fecharAutocomplete();
  }
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
    fecharAutocomplete();
    pesquisarMedicamento(med);
  });
});

// Botão de comando de voz (microfone)
btnMic?.addEventListener('click', () => {
  fecharAutocomplete();
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

// Tecla Escape — limpa fala, microfone e autocomplete
document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    pararFala();
    pararComandoDeVoz();
    fecharAutocomplete();
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
   16. INICIALIZAÇÃO
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
