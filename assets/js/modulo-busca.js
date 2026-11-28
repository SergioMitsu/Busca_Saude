/**
 * BuscaSaúde · js/modulo-busca.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Módulo de Busca Inteligente de Medicamentos (usando dados/dados_saude.js)
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const ModuloBusca = {
  dados: {
    metadata: {},
    medicamentos: []
  },

  estado: {
    medicamentoAtual: null,
    marcaPesquisada: null,
    resultadosFiltrados: [],
    todasUbs: [],
    sugestoesAtuais: [],
    activeSuggestionIndex: -1,
    gravandoVoz: false,
    recognition: null
  },

  init() {
    this.carregarDados();
    this.vincularElementos();
    this.vincularEventos();
  },

  carregarDados() {
    if (window.DADOS_SAUDE && Array.isArray(window.DADOS_SAUDE.medicamentos)) {
      this.dados = window.DADOS_SAUDE;
    }
  },

  vincularElementos() {
    this.el = {
      form: document.getElementById('form-pesquisa'),
      input: document.getElementById('input-medicamento'),
      selectZona: document.getElementById('select-zona'),
      dropdown: document.getElementById('autocomplete-dropdown'),
      loading: document.getElementById('loading-state'),
      resultadosSection: document.getElementById('resultados-section'),
      listaUbs: document.getElementById('lista-ubs'),
      notFound: document.getElementById('not-found-state'),
      filterEmpty: document.getElementById('filter-empty'),
      alertaComercial: document.getElementById('alerta-comercial-sus'),
      alertaComercialTexto: document.getElementById('alerta-comercial-texto'),
      resultsTitle: document.getElementById('results-title-text'),
      resultsSubtitle: document.getElementById('results-subtitle'),
      btnMic: document.getElementById('btn-mic'),
      voiceBadge: document.getElementById('voice-listening-badge'),
      btnNovaBusca: document.getElementById('btn-nova-busca'),
      btnLimparFiltro: document.getElementById('btn-limpar-filtro'),
      btnVozResultados: document.getElementById('btn-voz'),
      chips: document.querySelectorAll('.suggestion-chip')
    };
  },

  vincularEventos() {
    this.el.form?.addEventListener('submit', (e) => {
      e.preventDefault();
      this.fecharAutocomplete();
      this.executarBusca(this.el.input?.value || '');
    });

    this.el.input?.addEventListener('input', () => {
      const termo = this.el.input.value;
      if (!termo.trim()) {
        this.renderizarPainelFoco();
        return;
      }
      const sugestoes = this.buscarSugestoes(termo);
      this.renderizarAutocomplete(sugestoes, termo);
    });

    this.el.input?.addEventListener('focus', () => {
      const termo = this.el.input.value;
      if (!termo.trim()) {
        this.renderizarPainelFoco();
      } else {
        const sugestoes = this.buscarSugestoes(termo);
        this.renderizarAutocomplete(sugestoes, termo);
      }
    });

    this.el.input?.addEventListener('keydown', (e) => this.tratarNavegacaoTeclado(e));

    document.addEventListener('click', (e) => {
      if (!this.el.form?.contains(e.target) && !this.el.dropdown?.contains(e.target)) {
        this.fecharAutocomplete();
      }
    });

    this.el.selectZona?.addEventListener('change', () => {
      if (this.estado.medicamentoAtual) this.aplicarFiltroZona();
    });

    this.el.chips.forEach(chip => {
      chip.addEventListener('click', () => {
        const med = chip.dataset.med;
        if (this.el.input) this.el.input.value = med;
        this.fecharAutocomplete();
        this.executarBusca(med);
      });
    });

    this.el.btnMic?.addEventListener('click', () => this.toggleComandoVoz());
    this.el.btnNovaBusca?.addEventListener('click', () => this.resetar());
    this.el.btnLimparFiltro?.addEventListener('click', () => {
      if (this.el.selectZona) this.el.selectZona.value = 'todas';
      this.aplicarFiltroZona();
    });

    this.el.btnVozResultados?.addEventListener('click', () => {
      if (ModuloMascote.estado.falando) {
        ModuloMascote.pararFala();
        return;
      }
      this.el.btnVozResultados.classList.add('speaking');
      const sp = this.el.btnVozResultados.querySelector('span');
      if (sp) sp.textContent = 'Parar';
      ModuloMascote.falar(this.gerarResumoVoz());
    });
  },

  normalizar(txt) {
    return (txt || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  },

  escapeHtml(txt) {
    const d = document.createElement('div');
    d.appendChild(document.createTextNode(String(txt || '')));
    return d.innerHTML;
  },

  destacarTermo(texto, termo) {
    if (!termo || !texto) return this.escapeHtml(texto);
    const textoLimpo = String(texto);
    const termoNorm = this.normalizar(termo.trim());
    const textoNorm = this.normalizar(textoLimpo);
    const idx = textoNorm.indexOf(termoNorm);
    if (idx === -1) return this.escapeHtml(textoLimpo);

    const antes = textoLimpo.substring(0, idx);
    const meio = textoLimpo.substring(idx, idx + termo.trim().length);
    const depois = textoLimpo.substring(idx + termo.trim().length);

    return `${this.escapeHtml(antes)}<mark class="highlight-match">${this.escapeHtml(meio)}</mark>${this.escapeHtml(depois)}`;
  },

  buscarSugestoes(termo) {
    if (!termo || !termo.trim()) return [];
    const tNorm = this.normalizar(termo.trim());
    const sugestoesPrincipais = [];
    const sugestoesMarcas = [];

    this.dados.medicamentos.forEach(med => {
      const nomeNorm = this.normalizar(med.nome);
      const genNorm = this.normalizar(med.nome_generico);

      let scoreAtivo = 0;
      if (nomeNorm === tNorm) scoreAtivo = 100;
      else if (nomeNorm.startsWith(tNorm)) scoreAtivo = 85;
      else if (nomeNorm.includes(tNorm)) scoreAtivo = 50;
      else if (genNorm.includes(tNorm)) scoreAtivo = 40;

      if (scoreAtivo > 0) {
        sugestoesPrincipais.push({
          tipo: 'principio_ativo',
          termoBusca: med.nome,
          nomeExibicao: med.nome,
          medicamento: med,
          score: scoreAtivo
        });
      }

      if (med.nomes_comerciais && Array.isArray(med.nomes_comerciais)) {
        med.nomes_comerciais.forEach(marca => {
          const mNorm = this.normalizar(marca);
          let scoreMarca = 0;
          if (mNorm === tNorm) scoreMarca = 90;
          else if (tNorm.length >= 3 && mNorm.startsWith(tNorm)) scoreMarca = 70;
          else if (tNorm.length >= 4 && mNorm.includes(tNorm)) scoreMarca = 30;

          if (scoreMarca > 0) {
            sugestoesMarcas.push({
              tipo: 'marca_comercial',
              termoBusca: marca,
              nomeExibicao: marca,
              marcaNome: marca,
              medicamento: med,
              score: scoreMarca
            });
          }
        });
      }
    });

    sugestoesPrincipais.sort((a, b) => b.score - a.score);
    sugestoesMarcas.sort((a, b) => b.score - a.score);

    const unificadas = [...sugestoesPrincipais, ...sugestoesMarcas];
    const vistas = new Set();
    const resultado = [];

    for (const item of unificadas) {
      const chave = `${item.tipo}-${item.termoBusca}-${item.medicamento.id}`;
      if (!vistas.has(chave)) {
        vistas.add(chave);
        resultado.push(item);
        if (resultado.length >= 6) break;
      }
    }

    return resultado;
  },

  renderizarAutocomplete(sugestoes, termo) {
    if (!this.el.dropdown) return;
    this.estado.sugestoesAtuais = sugestoes;
    this.estado.activeSuggestionIndex = -1;

    if (this.el.input) {
      this.el.input.setAttribute('aria-expanded', 'true');
      this.el.input.removeAttribute('aria-activedescendant');
    }

    if (sugestoes.length === 0) {
      this.el.dropdown.innerHTML = `
        <div class="autocomplete-empty">
          <span class="autocomplete-empty-icon" aria-hidden="true">🔍</span>
          <p class="autocomplete-empty-title">Nenhum medicamento encontrado para "${this.escapeHtml(termo)}"</p>
          <p class="autocomplete-empty-tip">Busque pelo princípio ativo (ex: Dipirona, Losartana) ou marca de referência.</p>
        </div>
      `;
      this.el.dropdown.hidden = false;
      return;
    }

    let html = `
      <div class="autocomplete-header">
        <span><i class="bi bi-stars me-1" aria-hidden="true"></i>Sugestões de Busca</span>
        <span class="d-none d-sm-inline" style="font-weight:600;font-size:11px;">↑↓ navegar · Enter selecionar</span>
      </div>
      <ul class="autocomplete-list" role="listbox">
    `;

    sugestoes.forEach((sug, idx) => {
      const med = sug.medicamento;
      const temEstoque = med.disponivel && med.ubs && med.ubs.length > 0;
      const badgeEstoque = temEstoque
        ? `<span class="badge-stock-sim"><i class="bi bi-check-circle-fill"></i> Disponível nas UBS</span>`
        : `<span class="badge-stock-nao"><i class="bi bi-x-circle-fill"></i> Em falta</span>`;

      if (sug.tipo === 'marca_comercial') {
        html += `
          <li id="sugestao-${idx}" class="autocomplete-item" role="option" aria-selected="false" data-index="${idx}" tabindex="0">
            <div class="autocomplete-item-content">
              <div class="autocomplete-item-top">
                <span class="autocomplete-item-name">${this.destacarTermo(sug.marcaNome, termo)}</span>
                <span class="badge-tag-comercial"><i class="bi bi-tag-fill me-1"></i>Nome Comercial</span>
              </div>
              <div class="autocomplete-item-sub">
                <strong>Princípio Ativo SUS:</strong> ${this.escapeHtml(med.nome)} · ${this.escapeHtml(med.apresentacao)}
              </div>
            </div>
            <div class="autocomplete-item-badge">${badgeEstoque}</div>
          </li>
        `;
      } else {
        const marcaHint = med.nomes_comerciais?.length
          ? `<div class="autocomplete-item-brands"><i class="bi bi-tag me-1"></i>Exemplos comerciais: ${this.escapeHtml(med.nomes_comerciais.slice(0, 3).join(', '))}</div>`
          : '';

        const badgeTipo = med.tipo_registro === 'composto'
          ? `<span class="badge-tag-comercial"><i class="bi bi-exclamation-triangle-fill me-1"></i>Associação / Composto</span>`
          : `<span class="badge-tag-generico"><i class="bi bi-capsule me-1"></i>Princípio Ativo</span>`;

        html += `
          <li id="sugestao-${idx}" class="autocomplete-item" role="option" aria-selected="false" data-index="${idx}" tabindex="0">
            <div class="autocomplete-item-content">
              <div class="autocomplete-item-top">
                <span class="autocomplete-item-name">${this.destacarTermo(med.nome, termo)}</span>
                ${badgeTipo}
              </div>
              <div class="autocomplete-item-sub">
                ${this.escapeHtml(med.apresentacao)} · ${this.escapeHtml(med.categoria)}
              </div>
              ${marcaHint}
            </div>
            <div class="autocomplete-item-badge">${badgeEstoque}</div>
          </li>
        `;
      }
    });

    html += `
      </ul>
      <div class="autocomplete-footer">
        <span><i class="bi bi-info-circle me-1" aria-hidden="true"></i>Pesquisa de Medicamentos · Dados Simulados</span>
        <span>Aperte Enter para buscar</span>
      </div>
    `;

    this.el.dropdown.innerHTML = html;
    this.el.dropdown.hidden = false;

    this.el.dropdown.querySelectorAll('.autocomplete-item').forEach(el => {
      el.addEventListener('click', () => {
        const idx = parseInt(el.dataset.index, 10);
        this.selecionarSugestao(idx);
      });
    });
  },

  selecionarSugestao(index) {
    const sug = this.estado.sugestoesAtuais[index];
    if (!sug) return;
    this.fecharAutocomplete();

    if (sug.tipo === 'marca_comercial') {
      this.estado.marcaPesquisada = sug.marcaNome;
      if (this.el.input) this.el.input.value = sug.marcaNome;
      this.executarBusca(sug.marcaNome);
    } else {
      this.estado.marcaPesquisada = null;
      if (this.el.input) this.el.input.value = sug.medicamento.nome;
      this.executarBusca(sug.medicamento.nome);
    }
  },

  fecharAutocomplete() {
    if (this.el.dropdown) {
      this.el.dropdown.hidden = true;
      this.el.dropdown.innerHTML = '';
    }
    if (this.el.input) {
      this.el.input.setAttribute('aria-expanded', 'false');
      this.el.input.removeAttribute('aria-activedescendant');
    }
    this.estado.sugestoesAtuais = [];
    this.estado.activeSuggestionIndex = -1;
  },

  tratarNavegacaoTeclado(e) {
    if (!this.el.dropdown || this.el.dropdown.hidden || !this.estado.sugestoesAtuais.length) {
      if (e.key === 'ArrowDown' && this.el.input?.value.trim() === '') {
        this.renderizarPainelFoco();
        e.preventDefault();
      }
      return;
    }

    const total = this.estado.sugestoesAtuais.length;
    const items = this.el.dropdown.querySelectorAll('.autocomplete-item');

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      this.estado.activeSuggestionIndex = (this.estado.activeSuggestionIndex + 1) % total;
      this.atualizarItemAtivo(items);
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      this.estado.activeSuggestionIndex = (this.estado.activeSuggestionIndex - 1 + total) % total;
      this.atualizarItemAtivo(items);
    } else if (e.key === 'Enter') {
      if (this.estado.activeSuggestionIndex >= 0 && this.estado.activeSuggestionIndex < total) {
        e.preventDefault();
        this.selecionarSugestao(this.estado.activeSuggestionIndex);
      }
    } else if (e.key === 'Escape') {
      this.fecharAutocomplete();
    }
  },

  atualizarItemAtivo(items) {
    items.forEach((item, idx) => {
      const active = idx === this.estado.activeSuggestionIndex;
      item.classList.toggle('active', active);
      item.setAttribute('aria-selected', String(active));
      if (active) {
        item.scrollIntoView({ block: 'nearest' });
        this.el.input?.setAttribute('aria-activedescendant', `sugestao-${idx}`);
      }
    });
  },

  renderizarPainelFoco() {
    if (!this.el.dropdown) return;
    const historico = this.obterHistorico();

    let html = '';
    if (historico.length > 0) {
      html = `
        <div class="autocomplete-header">
          <span><i class="bi bi-clock-history me-1" aria-hidden="true"></i>Pesquisas Recentes</span>
          <button type="button" class="btn-limpar-historico-autocomplete" id="btn-limpar-hist">Limpar</button>
        </div>
        <ul class="autocomplete-list" role="listbox">
      `;
      historico.forEach(item => {
        html += `
          <li class="autocomplete-item autocomplete-recent-item" role="option" data-termo="${this.escapeHtml(item)}" tabindex="0">
            <div class="autocomplete-item-content">
              <div class="d-flex align-items-center gap-2">
                <i class="bi bi-clock" aria-hidden="true"></i>
                <strong class="autocomplete-item-name" style="font-size:var(--fs-sm);">${this.escapeHtml(item)}</strong>
              </div>
            </div>
            <i class="bi bi-arrow-up-left" aria-hidden="true"></i>
          </li>
        `;
      });
      html += `</ul>`;
    } else {
      html = `
        <div class="autocomplete-header">
          <span><i class="bi bi-lightning-charge-fill me-1" aria-hidden="true"></i>Exemplos de Medicamentos</span>
        </div>
        <ul class="autocomplete-list" role="listbox">
          <li class="autocomplete-item autocomplete-recent-item" role="option" data-termo="Dipirona" tabindex="0">
            <div class="autocomplete-item-content"><strong>Dipirona</strong> <span>(Princípio Ativo SUS)</span></div>
          </li>
          <li class="autocomplete-item autocomplete-recent-item" role="option" data-termo="Amoxicilina" tabindex="0">
            <div class="autocomplete-item-content"><strong>Amoxicilina</strong> <span>(Antibiótico - Receita 10 dias)</span></div>
          </li>
          <li class="autocomplete-item autocomplete-recent-item" role="option" data-termo="Lisador" tabindex="0">
            <div class="autocomplete-item-content"><strong>Lisador</strong> <span class="badge-tag-comercial">Associação Composta</span></div>
          </li>
        </ul>
      `;
    }

    html += `
      <div class="autocomplete-footer">
        <span>Pesquisa de Medicamentos · Dados Simulados</span>
        <span>BuscaSaúde</span>
      </div>
    `;

    this.el.dropdown.innerHTML = html;
    this.el.dropdown.hidden = false;
    this.el.input?.setAttribute('aria-expanded', 'true');

    this.el.dropdown.querySelector('#btn-limpar-hist')?.addEventListener('click', (e) => {
      e.stopPropagation();
      this.limparHistorico();
    });

    this.el.dropdown.querySelectorAll('.autocomplete-recent-item').forEach(el => {
      el.addEventListener('click', () => {
        const t = el.dataset.termo;
        if (this.el.input) this.el.input.value = t;
        this.fecharAutocomplete();
        this.executarBusca(t);
      });
    });
  },

  salvarHistorico(termo) {
    if (!termo || !termo.trim()) return;
    const t = termo.trim();
    let hist = this.obterHistorico().filter(i => this.normalizar(i) !== this.normalizar(t));
    hist.unshift(t);
    if (hist.length > 5) hist = hist.slice(0, 5);
    try { localStorage.setItem('bs_recent_searches', JSON.stringify(hist)); } catch (_) {}
  },

  obterHistorico() {
    try {
      const raw = localStorage.getItem('bs_recent_searches');
      return raw ? JSON.parse(raw) : [];
    } catch (_) {
      return [];
    }
  },

  limparHistorico() {
    try { localStorage.removeItem('bs_recent_searches'); } catch (_) {}
    this.fecharAutocomplete();
  },

  async executarBusca(termo) {
    if (!termo || !termo.trim()) {
      ModuloMascote.atualizarBalao(ModuloMascote.MSGS.campoVazio, 'error');
      this.el.input?.focus();
      return;
    }

    const termoLimpo = termo.trim();
    const tNorm = this.normalizar(termoLimpo);
    this.salvarHistorico(termoLimpo);

    this.fecharAutocomplete();
    ModuloMascote.pararFala();
    this.mostrarLoading(true);
    this.ocultarResultados();
    if (this.el.alertaComercial) this.el.alertaComercial.hidden = true;

    ModuloMascote.atualizarBalao(ModuloMascote.MSGS.buscando(termoLimpo), 'default');

    await new Promise(r => setTimeout(r, 350));

    let encontrado = null;
    let marcaEncontrada = null;

    encontrado = this.dados.medicamentos.find(m => {
      const n = this.normalizar(m.nome);
      const g = this.normalizar(m.nome_generico);
      return n === tNorm || n.startsWith(tNorm) || tNorm.startsWith(n) || g.includes(tNorm);
    });

    if (!encontrado) {
      for (const m of this.dados.medicamentos) {
        if (m.nomes_comerciais && Array.isArray(m.nomes_comerciais)) {
          const mc = m.nomes_comerciais.find(marca => {
            const mcn = this.normalizar(marca);
            return mcn === tNorm || (tNorm.length >= 3 && mcn.startsWith(tNorm));
          });
          if (mc) {
            marcaEncontrada = mc;
            encontrado = m;
            break;
          }
        }
      }
    }

    if (!encontrado) {
      encontrado = this.dados.medicamentos.find(m => this.normalizar(m.categoria).includes(tNorm));
    }

    this.mostrarLoading(false);

    if (!encontrado || !encontrado.disponivel || !encontrado.ubs?.length) {
      ModuloMascote.atualizarBalao(ModuloMascote.MSGS.naoEncontrado, 'error');
      ModuloMascote.reagirResultado('falta');
      ModuloMascote.falar(ModuloMascote.MSGS.naoEncontrado);
      this.estado.medicamentoAtual = null;
      this.estado.todasUbs = [];
      this.estado.resultadosFiltrados = [];
      this.mostrarNaoEncontrado();
      return;
    }

    this.estado.medicamentoAtual = encontrado;
    this.estado.todasUbs = encontrado.ubs;
    this.estado.marcaPesquisada = marcaEncontrada;

    this.aplicarFiltroZona();
  },

  aplicarFiltroZona() {
    const med = this.estado.medicamentoAtual;
    if (!med) return;

    const zona = this.el.selectZona?.value || 'todas';
    const filtradas = zona === 'todas'
      ? this.estado.todasUbs
      : this.estado.todasUbs.filter(u => u.zona === zona);

    this.estado.resultadosFiltrados = filtradas;

    if (filtradas.length === 0) {
      const msg = ModuloMascote.MSGS.semZona(med.nome, zona);
      ModuloMascote.atualizarBalao(msg, 'error');
      ModuloMascote.reagirResultado('falta');
      ModuloMascote.falar(msg);
      this.mostrarFiltroVazio();
      return;
    }

    let msgBalao = '';
    if (this.estado.marcaPesquisada) {
      const marca = this.estado.marcaPesquisada;
      msgBalao = `Você buscou pela marca ${marca}. No SUS, esse medicamento é dispensado pelo princípio ativo ${med.nome} (${med.apresentacao}). Encontrei disponível em ${filtradas.length} UBS próxima${filtradas.length > 1 ? 's' : ''}! 🎉`;
    } else {
      msgBalao = ModuloMascote.MSGS.encontrado(med.nome, filtradas.length);
    }

    ModuloMascote.atualizarBalao(msgBalao, 'success');
    ModuloMascote.reagirResultado('sucesso');
    ModuloMascote.falar(msgBalao);

    if (this.el.alertaComercial && this.el.alertaComercialTexto) {
      let alertaHtml = '';

      if (med.tipo_registro === 'composto') {
        alertaHtml += `
          <div class="mb-1 fw-bold">
            <i class="bi bi-shield-exclamation me-1"></i>ALERTA DE SEGURANÇA E ALERGIA (MEDICAMENTO COMPOSTO)
          </div>
          <div>${this.escapeHtml(med.alerta_seguranca)}</div>
          <div class="mt-1 small"><strong>Componentes da associação:</strong> ${this.escapeHtml(med.componentes.join(' + '))}</div>
        `;
      } else if (this.estado.marcaPesquisada) {
        alertaHtml += `
          <div><strong>Equivalência SUS:</strong> Você pesquisou pela marca <strong>${this.escapeHtml(this.estado.marcaPesquisada)}</strong>.
          Nas farmácias das UBS, o medicamento é fornecido pelo princípio ativo oficial <strong>${this.escapeHtml(med.nome)} (${this.escapeHtml(med.nome_generico)} - ${this.escapeHtml(med.apresentacao)})</strong> com idêntica bioequivalência aprovada pela Anvisa.</div>
        `;
      } else if (med.nomes_comerciais?.length) {
        alertaHtml += `
          <div><strong>Orientação Farmacêutica:</strong> <strong>${this.escapeHtml(med.nome)}</strong> é o princípio ativo oficial fornecido pelo SUS.
          Exemplos comerciais de referência: <em>${this.escapeHtml(med.nomes_comerciais.join(', '))}</em>.</div>
        `;
      }

      if (med.validade_receita_dias) {
        alertaHtml += `
          <div class="mt-2 pt-2 border-top small">
            <i class="bi bi-file-earmark-medical me-1"></i>Validade legal da receita médica: <strong>${med.validade_receita_dias} dias</strong>
            ${med.validade_receita_dias === 10 ? ' (Antibiótico sujeito a controle especial - RDC 471/2021 da Anvisa)' : ''}.
          </div>
        `;
      }

      this.el.alertaComercialTexto.innerHTML = alertaHtml;
      this.el.alertaComercial.hidden = false;
    }

    if (this.el.listaUbs) {
      this.el.listaUbs.innerHTML = '';
      filtradas.forEach(ubs => {
        this.el.listaUbs.appendChild(this.criarCardUbs(ubs, med.nome, med.apresentacao));
      });
    }

    if (this.el.resultsTitle) {
      if (this.estado.marcaPesquisada) {
        this.el.resultsTitle.innerHTML = `${this.escapeHtml(med.nome)} · ${this.escapeHtml(med.apresentacao)} <span class="badge-tag-comercial ms-2">Ref: ${this.escapeHtml(this.estado.marcaPesquisada)}</span>`;
      } else {
        this.el.resultsTitle.textContent = `${med.nome} · ${med.apresentacao}`;
      }
    }

    if (this.el.resultsSubtitle) {
      const zonaLabel = zona === 'todas' ? 'Todas as Zonas' : `Zona ${zona}`;
      this.el.resultsSubtitle.textContent = `${filtradas.length} UBS · ${med.categoria} · ${zonaLabel}`;
    }

    if (this.el.resultadosSection) this.el.resultadosSection.hidden = false;
    if (this.el.notFound) this.el.notFound.hidden = true;
    if (this.el.filterEmpty) this.el.filterEmpty.hidden = true;

    setTimeout(() => this.el.resultadosSection?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 100);
  },

  criarCardUbs(ubs, nomeMed, apresentacao) {
    const card = document.createElement('article');
    const classeStatus = ubs.estoque_percentual >= 70 ? 'status-alto' : (ubs.estoque_percentual >= 40 ? 'status-medio' : 'status-baixo');
    card.className = `ubs-card ${classeStatus}`;
    card.setAttribute('role', 'listitem');
    card.setAttribute('aria-label', `UBS: ${ubs.nome} — estoque ${ubs.estoque_percentual}%`);

    const cor = ubs.estoque_percentual >= 70
      ? 'linear-gradient(90deg,#43A047,#2E7D32)'
      : (ubs.estoque_percentual >= 40 ? 'linear-gradient(90deg,#FF8F00,#E65100)' : 'linear-gradient(90deg,#E53935,#C62828)');

    const linhasHor = (ubs.horario || '').split('\n').map(l => `<span class="d-block">${this.escapeHtml(l)}</span>`).join('');

    card.innerHTML = `
      <div class="ubs-card-header">
        <div class="ubs-card-icon" aria-hidden="true"><i class="bi bi-hospital-fill"></i></div>
        <div class="ubs-card-name">${this.escapeHtml(ubs.nome)}</div>
        <div class="ubs-card-badges">
          <span class="badge-disponivel"><i class="bi bi-check-circle-fill"></i> Disponível</span>
          <span class="badge-zona"><i class="bi bi-geo-alt"></i> Zona ${this.escapeHtml(ubs.zona)}</span>
        </div>
      </div>
      <div class="ubs-card-info">
        <div class="ubs-info-row">
          <i class="bi bi-capsule-pill info-icon" aria-hidden="true"></i>
          <div><div class="ubs-info-label">Medicamento</div>
          <div class="ubs-info-value">${this.escapeHtml(nomeMed)} · ${this.escapeHtml(apresentacao)}</div></div>
        </div>
        <div class="ubs-info-row">
          <i class="bi bi-geo-alt-fill info-icon" aria-hidden="true"></i>
          <div><div class="ubs-info-label">Endereço</div>
          <div class="ubs-info-value">${this.escapeHtml(ubs.endereco)}</div></div>
        </div>
        <div class="ubs-info-row">
          <i class="bi bi-clock-fill info-icon" aria-hidden="true"></i>
          <div><div class="ubs-info-label">Horário de Funcionamento</div>
          <div class="ubs-info-value">${linhasHor}</div></div>
        </div>
        ${ubs.telefone ? `
        <div class="ubs-info-row">
          <i class="bi bi-telephone-fill info-icon" aria-hidden="true"></i>
          <div><div class="ubs-info-label">Telefone</div>
          <div class="ubs-info-value">${this.escapeHtml(ubs.telefone)}</div></div>
        </div>` : ''}
        ${ubs.obs ? `
        <div class="ubs-info-row">
          <i class="bi bi-info-circle-fill info-icon" aria-hidden="true"></i>
          <div><div class="ubs-info-label">Orientação</div>
          <div class="ubs-info-value">${this.escapeHtml(ubs.obs)}</div></div>
        </div>` : ''}
      </div>
      <div class="ubs-stock-bar" aria-label="Estoque: ${ubs.estoque_percentual}%">
        <div class="stock-label">Nível de Estoque — ${ubs.estoque_percentual}%</div>
        <div class="stock-bar-track" role="progressbar" aria-valuenow="${ubs.estoque_percentual}" aria-valuemin="0" aria-valuemax="100">
          <div class="stock-bar-fill" style="width:${ubs.estoque_percentual}%;background:${cor};"></div>
        </div>
      </div>
      <div class="ubs-card-actions">
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ubs.endereco)}" target="_blank" rel="noopener noreferrer" class="btn-mapa" aria-label="Ver rota no Google Maps">
          <i class="bi bi-map-fill me-2" aria-hidden="true"></i>Ver no Mapa
        </a>
        ${ubs.telefone ? `
        <a href="tel:+55${ubs.telefone.replace(/\D/g, '')}" class="btn-ligar" aria-label="Ligar para a UBS">
          <i class="bi bi-telephone-fill me-2" aria-hidden="true"></i>Ligar
        </a>` : ''}
      </div>
    `;

    return card;
  },

  gerarResumoVoz() {
    const med = this.estado.medicamentoAtual;
    const lista = this.estado.resultadosFiltrados;
    if (!med || !lista.length) return 'Nenhum resultado para ler.';

    let txt = `${med.nome} está disponível em ${lista.length} Unidade${lista.length > 1 ? 's' : ''} Básica${lista.length > 1 ? 's' : ''} de Saúde. `;
    lista.forEach((u, i) => {
      txt += `Opção ${i + 1}: ${u.nome}, na ${u.endereco}. `;
    });
    return txt;
  },

  toggleComandoVoz() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      ModuloMascote.atualizarBalao('Pesquisa por voz indisponível neste navegador. Tente no Google Chrome.', 'error');
      ModuloMascote.falar('Pesquisa por voz indisponível neste navegador. Tente no Google Chrome.');
      return;
    }

    if (this.estado.gravandoVoz) {
      this.pararComandoVoz();
      return;
    }

    ModuloMascote.pararFala();

    try {
      this.estado.recognition = new SpeechRecognition();
      this.estado.recognition.lang = 'pt-BR';
      this.estado.recognition.continuous = false;

      this.estado.recognition.onstart = () => {
        this.estado.gravandoVoz = true;
        this.el.btnMic?.classList.add('listening');
        if (this.el.voiceBadge) this.el.voiceBadge.hidden = false;
        ModuloMascote.atualizarBalao('Estou ouvindo! Fale o nome do remédio...', 'default');
      };

      this.estado.recognition.onresult = (ev) => {
        const transcript = ev.results[0][0].transcript;
        let termo = transcript
          .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()?]/g, '')
          .replace(/^(pesquisar|buscar|encontrar|ver|tem|remédio)\s+/i, '')
          .trim();

        if (this.el.input) this.el.input.value = termo || transcript.trim();
        this.pararComandoVoz();
        this.executarBusca(this.el.input.value);
      };

      this.estado.recognition.onerror = () => this.pararComandoVoz();
      this.estado.recognition.onend = () => this.pararComandoVoz();

      this.estado.recognition.start();
    } catch (_) {
      this.pararComandoVoz();
    }
  },

  pararComandoVoz() {
    this.estado.gravandoVoz = false;
    try { this.estado.recognition?.stop(); } catch (_) {}
    this.estado.recognition = null;
    this.el.btnMic?.classList.remove('listening');
    if (this.el.voiceBadge) this.el.voiceBadge.hidden = true;
  },

  mostrarLoading(show) {
    if (this.el.loading) this.el.loading.hidden = !show;
  },

  ocultarResultados() {
    if (this.el.resultadosSection) this.el.resultadosSection.hidden = true;
    if (this.el.listaUbs) this.el.listaUbs.innerHTML = '';
    if (this.el.notFound) this.el.notFound.hidden = true;
    if (this.el.filterEmpty) this.el.filterEmpty.hidden = true;
  },

  mostrarNaoEncontrado() {
    if (this.el.resultadosSection) this.el.resultadosSection.hidden = false;
    if (this.el.listaUbs) this.el.listaUbs.innerHTML = '';
    if (this.el.notFound) this.el.notFound.hidden = false;
    if (this.el.filterEmpty) this.el.filterEmpty.hidden = true;
  },

  mostrarFiltroVazio() {
    if (this.el.resultadosSection) this.el.resultadosSection.hidden = false;
    if (this.el.listaUbs) this.el.listaUbs.innerHTML = '';
    if (this.el.notFound) this.el.notFound.hidden = true;
    if (this.el.filterEmpty) this.el.filterEmpty.hidden = false;
  },

  resetar() {
    ModuloMascote.pararFala();
    this.fecharAutocomplete();
    this.ocultarResultados();
    if (this.el.alertaComercial) this.el.alertaComercial.hidden = true;
    ModuloMascote.atualizarBalao(ModuloMascote.MSGS.inicial, 'default');
    if (this.el.input) this.el.input.value = '';
    if (this.el.selectZona) this.el.selectZona.value = 'todas';
    this.estado.medicamentoAtual = null;
    this.estado.marcaPesquisada = null;
    this.estado.todasUbs = [];
    this.estado.resultadosFiltrados = [];
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => this.el.input?.focus(), 400);
  }
};
