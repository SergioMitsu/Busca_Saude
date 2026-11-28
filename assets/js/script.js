/**
 * BuscaSaúde · script.js
 * ─────────────────────────────────────────────────────────────────────────────
 * Ponto de entrada da aplicação.
 * Orquestra a inicialização e o ciclo de vida dos módulos desacoplados:
 * - ModuloAcessibilidade (assets/js/modulo-acessibilidade.js)
 * - ModuloMascote        (assets/js/modulo-mascote.js)
 * - ModuloBusca          (assets/js/modulo-busca.js)
 * ─────────────────────────────────────────────────────────────────────────────
 */

'use strict';

async function bootstrap() {
  try {
    if (typeof ModuloAcessibilidade !== 'undefined') {
      ModuloAcessibilidade.init();
    }
  } catch (err) {
    console.error('Erro ao inicializar ModuloAcessibilidade:', err);
  }

  try {
    if (typeof ModuloMascote !== 'undefined') {
      ModuloMascote.init();
    }
  } catch (err) {
    console.error('Erro ao inicializar ModuloMascote:', err);
  }

  try {
    if (typeof ModuloBusca !== 'undefined') {
      await ModuloBusca.init();
    }
  } catch (err) {
    console.error('Erro ao inicializar ModuloBusca:', err);
  }

  // Foco inicial suave no campo de busca em desktops e notebooks
  if (!window.matchMedia('(max-width: 768px)').matches) {
    document.getElementById('input-medicamento')?.focus();
  }

  // Tecla global Escape para fechar menus, parar narração e parar reconhecimento por voz
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (typeof ModuloMascote !== 'undefined') ModuloMascote.pararFala();
      if (typeof ModuloBusca !== 'undefined') {
        ModuloBusca.pararComandoVoz();
        ModuloBusca.fecharAutocomplete();
      }
    }
  });

  // Limpeza de áudio ao sair da página
  window.addEventListener('beforeunload', () => {
    if (typeof ModuloMascote !== 'undefined') ModuloMascote.pararFala();
    if (typeof ModuloBusca !== 'undefined') ModuloBusca.pararComandoVoz();
  });

  console.info(
    '%c BuscaSaúde FMU TECH 🏥 ',
    'background:#1565C0;color:#fff;font-size:14px;padding:4px 10px;border-radius:6px;font-weight:bold;',
    '\nODS 3 · Estrutura 100% modularizada e compatível com abertura local e web.'
  );
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', bootstrap);
} else {
  bootstrap();
}
