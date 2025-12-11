import React, { useState, useEffect, useRef } from 'react';
import api from '../api';

const ClientAutocomplete = ({ value, onChange, onClientSelect, error, disabled = false }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [clients, setClients] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedClient, setSelectedClient] = useState(null);
    const inputRef = useRef(null);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (value && typeof value === 'object') {
            setSelectedClient(value);
            setSearchTerm(value.company || '');
        } else if (value && typeof value === 'number') {
            fetchClientById(value);
        }
    }, [value]);

    const fetchClientById = async (clientId) => {
        try {
            const response = await api.get(`/clients/${clientId}`);
            setSelectedClient(response.data);
            setSearchTerm(response.data.company);
        } catch (err) {
            console.error('Error fetching client:', err);
        }
    };

    const searchClients = async (term) => {
        if (term.length < 2) {
            setClients([]);
            return;
        }

        setIsLoading(true);
        try {
            const response = await api.get(`/clients/search?term=${encodeURIComponent(term)}`);
            setClients(response.data);
            setShowDropdown(true);
        } catch (err) {
            console.error('Error searching clients:', err);
            setClients([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        setSelectedClient(null);

        if (onChange) {
            onChange(null); 
        }

        if (value.length >= 2) {
            searchClients(value);
        } else {
            setClients([]);
            setShowDropdown(false);
        }
    };

    const handleClientSelect = (client) => {
        setSelectedClient(client);
        setSearchTerm(client.company);
        setShowDropdown(false);
        setClients([]);

        if (onChange) {
            onChange(client);
        }

        if (onClientSelect) {
            onClientSelect(client);
        }
    };

    const handleClear = () => {
        setSearchTerm('');
        setSelectedClient(null);
        setClients([]);
        setShowDropdown(false);

        if (onChange) {
            onChange(null);
        }

        if (inputRef.current) {
            inputRef.current.focus();
        }
    };

    const handleCreateNew = () => {
        window.dispatchEvent(new CustomEvent('openClientCreationModal', {
            detail: { initialCompany: searchTerm }
        }));
    };

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target) &&
                inputRef.current && !inputRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    return (
        <div className="client-autocomplete">
            <div className="autocomplete-header">
                <h4 htmlFor="clientSearch">Client *</h4>
            </div>

            <div className="autocomplete-input-wrapper">
                <input
                    ref={inputRef}
                    id="clientSearch"
                    type="text"
                    value={searchTerm}
                    onChange={handleInputChange}
                    onFocus={() => searchTerm.length >= 2 && setShowDropdown(true)}
                    placeholder="Busca por empresa..."
                    disabled={disabled}
                    className={error ? 'error' : ''}
                />
                <button
                    type="button"
                    className="btn-create-client"
                    onClick={handleCreateNew}
                    title="Criar novo cliente"
                >
                    <span className="btn-icon">+</span>
                    Novo Cliente
                </button>
                {searchTerm && (
                    <button
                        type="button"
                        className="btn-clear"
                        onClick={handleClear}
                        title="Clear search"
                    >
                        ×
                    </button>
                )}
            </div>

            {error && <span className="error">{error}</span>}

            {showDropdown && (
                <div ref={dropdownRef} className="autocomplete-dropdown">
                    {isLoading ? (
                        <div className="dropdown-item loading">Buscado clientes...</div>
                    ) : clients.length === 0 ? (
                        <div className="dropdown-item no-results">
                            <div>Nenhum cliente encontrado "{searchTerm}"</div>
                            <button
                                type="button"
                                className="btn-create-inline"
                                onClick={handleCreateNew}
                            >
                                Criar "{searchTerm}"
                            </button>
                        </div>
                    ) : (
                        <>
                            {clients.map((client) => (
                                <div
                                    key={client.id}
                                    className="dropdown-item"
                                    onClick={() => handleClientSelect(client)}
                                >
                                    <div className="client-company">{client.company}</div>
                                    <div className="client-details">
                                        <span className="client-name">{client.principalName}</span>
                                        {client.address && (
                                            <span className="client-address"> • {client.address}</span>
                                        )}
                                    </div>
                                </div>
                            ))}
                            <div className="dropdown-item create-new-option">
                                <button
                                    type="button"
                                    className="btn-create-full-width"
                                    onClick={handleCreateNew}
                                >
                                    + Create New Client: "{searchTerm}"
                                </button>
                            </div>
                        </>
                    )}
                </div>
            )}

            {selectedClient && (
                <div className="selected-client-info">
                    <div className="client-summary">
                        <strong>{selectedClient.company}</strong>
                        {selectedClient.address && (
                            <span> • {selectedClient.address}</span>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default ClientAutocomplete;