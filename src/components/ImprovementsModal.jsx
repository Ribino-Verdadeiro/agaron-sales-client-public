import React from 'react';
import './ImprovementsModal.css';

const ImprovementsModal = ({ isOpen, onClose, onDontShowAgain }) => {
    if (!isOpen) return null;

    return (
        <div className="improvements-modal-overlay" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <div className="improvements-modal-content">
                <div className="improvements-modal-header">
                    <h2><span className="icon">✨</span> Novidades e Melhorias</h2>
                    <button className="btn-close-modal" onClick={onClose}>&times;</button>
                </div>

                <div className="improvements-modal-body">
                    <div className="update-item">
                        <div className="update-header">
                            <span className="update-title">Melhorias de Usabilidade</span>
                            <span className="update-date">Hoje</span>
                        </div>
                        <ul className="update-list">
                            <li>
                                <strong>Inputs Numéricos Mais Limpos:</strong> Removemos as setinhas laterais dos campos de número para um visual mais clean.
                            </li>
                            <li>
                                <strong>Prevenção de Erros no Scroll:</strong> Desabilitamos a mudança de valores ao rolar o mouse sobre os campos numéricos, evitando edições acidentais.
                            </li>
                            <li>
                                <strong>Modal de Clientes Seguro:</strong> O modal de criação de clientes agora só fecha ao clicar no "X" ou "Cancelar", evitando a perda de dados se clicar fora dele sem querer.
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="improvements-modal-footer">
                    <button className="btn-secondary-modal" onClick={onDontShowAgain}>
                        Não mostrar novamente
                    </button>
                    <button className="btn-primary-modal" onClick={onClose}>
                        Entendi, obrigado!
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ImprovementsModal;
