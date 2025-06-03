import React from 'react';

const Paginacao = ({ pagina, totalPaginas, onPaginaAnterior, onPaginaProxima }) => {
  if (totalPaginas <= 1) return null;

  return (
    <div style={{ display: 'flex', justifyContent: 'center', margin: '16px 0' }}>
      <button
        className="paginacao-btn"
        onClick={onPaginaAnterior}
        disabled={pagina === 1}
      >
        Anterior
      </button>
      <span style={{ margin: '0 12px', color: '#00eaff' }}>
        Página {pagina} de {totalPaginas}
      </span>
      <button
        className="paginacao-btn"
        onClick={onPaginaProxima}
        disabled={pagina === totalPaginas}
      >
        Próxima
      </button>
    </div>
  );
};

export default Paginacao;
