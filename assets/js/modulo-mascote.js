/**
 * BuscaSaúde · js/modulo-mascote.js
 * ─────────────────────────────────────────────────────────────────────────────
 * - Estado Idle: estática piscando naturalmente (nina_neutra <-> nina_piscando)
 * - Estado Falando: alterna sprites (nina_falando / nina_gesticulando) na
 *   introdução e nas respostas de medicamentos encontrados ou indisponíveis
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const ModuloMascote = {
  SPRITES: {
    neutra:       'assets/images/nina_neutra.png',
    falando:      'assets/images/nina_falando.png',
    gesticulando: 'assets/images/nina_gesticulando.png',
    piscando:     'assets/images/nina_piscando.png'
  },

  MSGS: {
    inicial:       'Olá! Sou a Dra. Nina. Que medicamento procura hoje? Escreva abaixo e eu ajudo a encontrar a UBS mais próxima.',
    buscando:      (m) => `Consultando estoque de "${m}" nas UBSs de São Paulo…`,
    encontrado:    (m, n) => `Ótima notícia! Encontrei ${m} disponível em ${n} UBS próxima${n > 1 ? 's' : ''}! 🎉`,
    semZona:       (m, z) => `${m} está disponível, mas não na Zona ${z}. Tente ver em outras zonas!`,
    naoEncontrado: 'Puxa, este medicamento não foi encontrado ou está em falta no momento. Por favor, consulte sua UBS ou médico. 😿',
    campoVazio:    'Por favor, escreva o nome de um medicamento ou princípio ativo para eu pesquisar!'
  },

  DICAS_DO_DIA: [
    '💧 Beba pelo menos 2 litros de água por dia. A hidratação adequada regula a pressão arterial e apoia a função renal.',
    '💉 Mantenha sua carteira de vacinação atualizada! As vacinas protegem contra doenças graves e são gratuitas no SUS.',
    '🩺 Meça sua pressão arterial regularmente. A hipertensão é silenciosa — detectá-la cedo salva vidas (ODS 3).',
    '🚶‍♂️ 30 minutos de caminhada diária reduzem em até 35% o risco de doenças cardiovasculares.',
    '🍎 Reduza o consumo de sal e alimentos ultraprocessados. Priorize frutas, legumes e grãos integrais.',
    '😴 Durma de 7 a 8 horas por noite. O sono de qualidade revigora a imunidade e o equilíbrio metabólico.',
    '💊 Antibióticos devem ser tomados rigorosamente nos horários e prazo prescrito para evitar resistência bacteriana.'
  ],

  estado: {
    falando: false,
    intervaloFala: null,
    timeoutPiscar: null,
    tipIndex: 0,
    tipTimer: null,
    speechSupported: 'speechSynthesis' in window
  },

  init() {
    this.preCarregarSprites();
    this.trocarSprite('neutra');
    this.iniciarCicloPiscar();
    this.iniciarDicas();
    this.vincularEventos();
    this.atualizarBalao(this.MSGS.inicial);

    if (this.estado.speechSupported) {
      window.speechSynthesis.onvoiceschanged = () => this.obterVozFeminina();
    }
  },

  preCarregarSprites() {
    Object.values(this.SPRITES).forEach(src => {
      const img = new Image();
      img.src = src;
    });
  },

  obterTextoCaixaResposta() {
    const txt = document.getElementById('dra-nina-balao')?.querySelector('.balloon-text')?.textContent?.trim();
    return txt || this.MSGS.inicial;
  },

  vincularEventos() {
    // Botão "Narrar" da barra superior: narra a caixa de resposta com animação de fala
    document.getElementById('btn-voz-global')?.addEventListener('click', () => {
      if (this.estado.falando) this.pararFala();
      else this.falar(this.obterTextoCaixaResposta());
    });

    // Botão de áudio interno do balão da Dra. Nina
    document.getElementById('btn-narrar-nina')?.addEventListener('click', () => {
      if (this.estado.falando) this.pararFala();
      else this.falar(this.obterTextoCaixaResposta());
    });

    document.getElementById('btn-parar-toast')?.addEventListener('click', () => this.pararFala());

    document.getElementById('btn-tip-next')?.addEventListener('click', () => this.trocarDica(this.estado.tipIndex + 1));
    document.getElementById('btn-tip-prev')?.addEventListener('click', () => this.trocarDica(this.estado.tipIndex - 1));

    const tipCard = document.querySelector('.tip-card');
    tipCard?.addEventListener('mouseenter', () => clearInterval(this.estado.tipTimer));
    tipCard?.addEventListener('mouseleave', () => {
      this.estado.tipTimer = setInterval(() => this.trocarDica(this.estado.tipIndex + 1), 12000);
    });
  },

  trocarSprite(tipo) {
    const imgEl = document.getElementById('dra-nina-img');
    if (!imgEl || !this.SPRITES[tipo]) return;
    if (!imgEl.src.endsWith(this.SPRITES[tipo])) {
      imgEl.src = this.SPRITES[tipo];
    }
  },

  piscar() {
    if (this.estado.falando) return;
    this.trocarSprite('piscando');
    setTimeout(() => {
      if (!this.estado.falando) this.trocarSprite('neutra');
    }, 180);
  },

  iniciarCicloPiscar() {
    clearTimeout(this.estado.timeoutPiscar);
    const intervalo = 3000 + Math.random() * 2500;
    this.estado.timeoutPiscar = setTimeout(() => {
      this.piscar();
      this.iniciarCicloPiscar();
    }, intervalo);
  },

  obterVozFeminina() {
    if (!this.estado.speechSupported) return null;
    const vozes = window.speechSynthesis.getVoices();
    if (!vozes || !vozes.length) return null;

    const vozesPt = vozes.filter(v => v.lang === 'pt-BR' || v.lang.startsWith('pt'));
    if (!vozesPt.length) return null;

    const nomesFemininos = [
      /francisca/i, /maria/i, /thalita/i, /leticia|letícia/i,
      /heloisa|heloísa/i, /luciana/i, /yara/i, /fernanda/i,
      /camila/i, /vitoria|vitória/i, /female/i, /mulher/i,
      /google português do brasil/i
    ];

    for (const regex of nomesFemininos) {
      const encontrada = vozesPt.find(v => regex.test(v.name));
      if (encontrada) return encontrada;
    }

    const semMasculino = vozesPt.filter(v => !/daniel|antonio|antônio|felipe|ricardo|male|homem/i.test(v.name));
    return semMasculino.length ? semMasculino[0] : vozesPt[0];
  },

  atualizarEstadoBotaoNarrar(ativo) {
    const btnGlobal = document.getElementById('btn-voz-global');
    if (btnGlobal) {
      btnGlobal.classList.toggle('narrating', ativo);
      btnGlobal.setAttribute('aria-pressed', String(ativo));
      const span = btnGlobal.querySelector('span');
      if (span) span.textContent = ativo ? 'Parar' : 'Narrar';
    }
  },

  falar(texto) {
    if (!texto || !texto.trim()) return;
    this.pararFala();

    // Pausa o piscar idle enquanto fala para não haver conflito de frames
    clearTimeout(this.estado.timeoutPiscar);

    this.estado.falando = true;
    this.atualizarEstadoBotaoNarrar(true);
    this.exibirToast('A Dra. Nina está falando… clique para parar.');

    const imgEl = document.getElementById('dra-nina-img');
    imgEl?.classList.add('dra-nina-falando');

    // Inicia imediatamente no frame falando e alterna com gesticulando
    const cicloFala = ['falando', 'gesticulando', 'falando', 'neutra'];
    let frame = 0;
    this.trocarSprite(cicloFala[0]);

    this.estado.intervaloFala = setInterval(() => {
      if (!this.estado.falando) return;
      frame = (frame + 1) % cicloFala.length;
      this.trocarSprite(cicloFala[frame]);
    }, 320);

    if (this.estado.speechSupported) {
      try {
        window.speechSynthesis.cancel();
        const textoLimpo = texto.replace(/[\u{1F300}-\u{1FAFF}]/gu, '').trim();
        const utterance = new SpeechSynthesisUtterance(textoLimpo);
        utterance.lang = 'pt-BR';
        utterance.rate = 0.96;
        utterance.pitch = 1.1;

        const voz = this.obterVozFeminina();
        if (voz) utterance.voice = voz;

        utterance.onend = () => this.pararFala();
        utterance.onerror = () => this.pararFala();

        window.speechSynthesis.speak(utterance);
      } catch (_) {
        this.simularFala(texto);
      }
    } else {
      this.simularFala(texto);
    }
  },

  simularFala(texto) {
    const duracao = Math.max(2200, texto.length * 60);
    setTimeout(() => {
      if (this.estado.falando) this.pararFala();
    }, duracao);
  },

  pararFala() {
    this.estado.falando = false;
    clearInterval(this.estado.intervaloFala);
    this.estado.intervaloFala = null;

    if (this.estado.speechSupported) {
      try { window.speechSynthesis.cancel(); } catch (_) {}
    }

    const imgEl = document.getElementById('dra-nina-img');
    imgEl?.classList.remove('dra-nina-falando');
    this.trocarSprite('neutra');
    this.exibirToast(null);
    this.atualizarEstadoBotaoNarrar(false);

    const btnVoz = document.getElementById('btn-voz');
    if (btnVoz) {
      btnVoz.classList.remove('speaking');
      const sp = btnVoz.querySelector('span');
      if (sp) sp.textContent = 'Ouvir';
    }

    // Retoma o ciclo idle de piscar
    this.iniciarCicloPiscar();
  },

  reagirResultado(tipo) {
    const imgEl = document.getElementById('dra-nina-img');
    if (!imgEl) return;
    imgEl.classList.remove('dra-nina-happy', 'dra-nina-sad');

    if (tipo === 'sucesso') {
      imgEl.classList.add('dra-nina-happy');
      setTimeout(() => imgEl.classList.remove('dra-nina-happy'), 2500);
    } else if (tipo === 'falta') {
      imgEl.classList.add('dra-nina-sad');
      setTimeout(() => imgEl.classList.remove('dra-nina-sad'), 2500);
    }
  },

  atualizarBalao(msg, estado = 'default') {
    const balao = document.getElementById('dra-nina-balao');
    const textoEl = balao?.querySelector('.balloon-text');
    if (!balao || !textoEl) return;

    balao.classList.remove('state-success', 'state-error');
    if (estado === 'success') balao.classList.add('state-success');
    if (estado === 'error')   balao.classList.add('state-error');

    textoEl.textContent = msg;
  },

  iniciarDicas() {
    const diaDoAno = Math.floor((Date.now() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    this.trocarDica(diaDoAno % this.DICAS_DO_DIA.length);
    this.estado.tipTimer = setInterval(() => this.trocarDica(this.estado.tipIndex + 1), 12000);
  },

  trocarDica(idx) {
    const tipTexto = document.getElementById('tip-texto');
    const tipCounter = document.getElementById('tip-counter');
    if (!tipTexto || !tipCounter) return;

    const total = this.DICAS_DO_DIA.length;
    this.estado.tipIndex = ((idx % total) + total) % total;

    tipTexto.textContent = this.DICAS_DO_DIA[this.estado.tipIndex];
    tipCounter.textContent = `${this.estado.tipIndex + 1}/${total}`;
  },

  exibirToast(msg) {
    const toast = document.getElementById('toast-voz');
    const msgEl = document.getElementById('toast-voz-msg');
    if (!toast) return;
    if (!msg) {
      toast.hidden = true;
      return;
    }
    if (msgEl) msgEl.textContent = msg;
    toast.hidden = false;
  }
};
