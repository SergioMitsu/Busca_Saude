/**
 * BuscaSaúde · js/modulo-acessibilidade.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Módulo de Acessibilidade (IHC / WCAG 2.1 Nível AA):
 * - Ajuste de escala tipográfica (A-, A, A+)
 * - Modo Alto Contraste (design tokens :root)
 * - Anunciador sonoro e ARIA Live Region para leitores de tela
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

const ModuloAcessibilidade = {
  FONT_SCALES: [0.85, 1, 1.15, 1.30],
  FONT_LABELS: ['Muito pequena', 'Normal', 'Grande', 'Muito grande'],

  estado: {
    fontScale: 1,
    highContrast: false
  },

  init() {
    this.carregarPreferencias();
    this.vincularEventos();
  },

  carregarPreferencias() {
    try {
      const savedScale = parseFloat(localStorage.getItem('bs_fontScale'));
      const savedContrast = localStorage.getItem('bs_highContrast') === 'true';
      if (this.FONT_SCALES.includes(savedScale)) this.aplicarFontScale(savedScale);
      if (savedContrast) this.toggleContraste();
    } catch (_) {}
  },

  vincularEventos() {
    document.getElementById('btn-font-increase')?.addEventListener('click', () => this.aumentarFonte());
    document.getElementById('btn-font-decrease')?.addEventListener('click', () => this.diminuirFonte());
    document.getElementById('btn-font-reset')?.addEventListener('click', () => this.resetarFonte());
    document.getElementById('btn-contrast')?.addEventListener('click', () => this.toggleContraste());
  },

  aplicarFontScale(scale) {
    this.estado.fontScale = scale;
    document.documentElement.style.setProperty('--font-scale', scale);
    try { localStorage.setItem('bs_fontScale', scale); } catch (_) {}
    const idx = this.FONT_SCALES.indexOf(scale);
    const label = this.FONT_LABELS[idx] || 'Ajustada';
    this.anunciarAria(`Tamanho da fonte ajustado para: ${label}`);
  },

  aumentarFonte() {
    const idx = this.FONT_SCALES.indexOf(this.estado.fontScale);
    if (idx < this.FONT_SCALES.length - 1) this.aplicarFontScale(this.FONT_SCALES[idx + 1]);
  },

  diminuirFonte() {
    const idx = this.FONT_SCALES.indexOf(this.estado.fontScale);
    if (idx > 0) this.aplicarFontScale(this.FONT_SCALES[idx - 1]);
  },

  resetarFonte() {
    this.aplicarFontScale(1);
  },

  toggleContraste() {
    this.estado.highContrast = !this.estado.highContrast;
    document.body.classList.toggle('high-contrast', this.estado.highContrast);
    const btnContrast = document.getElementById('btn-contrast');
    if (btnContrast) {
      btnContrast.setAttribute('aria-pressed', String(this.estado.highContrast));
      btnContrast.classList.toggle('active', this.estado.highContrast);
    }
    try { localStorage.setItem('bs_highContrast', String(this.estado.highContrast)); } catch (_) {}
    this.anunciarAria(this.estado.highContrast ? 'Modo alto contraste ativado.' : 'Modo alto contraste desativado.');
  },

  anunciarAria(msg) {
    let el = document.getElementById('aria-announcer');
    if (!el) {
      el = document.createElement('div');
      el.id = 'aria-announcer';
      el.setAttribute('role', 'status');
      el.setAttribute('aria-live', 'polite');
      el.setAttribute('aria-atomic', 'true');
      el.style.cssText = 'position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;';
      document.body.appendChild(el);
    }
    el.textContent = '';
    setTimeout(() => { el.textContent = msg; }, 50);
  }
};
