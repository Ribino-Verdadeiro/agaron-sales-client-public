import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import ClientCreationModal from '../components/ClientCreationModal';
import '../App.css';

const ListClients = () => {
    const [clients, setClients] = useState([]);
    const [filteredClients, setFilteredClients] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingClient, setEditingClient] = useState(null);
    const navigate = useNavigate();

    const [searchTerm, setSearchTerm] = useState('');
    const [cityFilter, setCityFilter] = useState('all');
    const [stateFilter, setStateFilter] = useState('all');

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    const [filtersExpanded, setFiltersExpanded] = useState(false);

    useEffect(() => {
        fetchClients();
    }, []);

    const fetchClients = async () => {
        try {
            setLoading(true);
            const response = await api.get('/clients');
            console.log('Fetched clients:', response.data);
            setClients(response.data || []);
            setFilteredClients(response.data || []);
        } catch (err) {
            console.error('Error fetching clients:', err);
            setError('Failed to load clients. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        applyFilters();
    }, [searchTerm, cityFilter, stateFilter, clients]);

    useEffect(() => {
        setCurrentPage(1);
    }, [searchTerm, cityFilter, stateFilter]);

    const applyFilters = () => {
        let filtered = [...clients];

        if (searchTerm) {
            const term = searchTerm.toLowerCase();
            filtered = filtered.filter(client =>
                client.company?.toLowerCase().includes(term) ||
                client.principalName?.toLowerCase().includes(term) ||
                client.email?.toLowerCase().includes(term) ||
                client.companyRegNumber?.toLowerCase().includes(term)
            );
        }

        if (cityFilter !== 'all') {
            filtered = filtered.filter(client => client.city === cityFilter);
        }

        if (stateFilter !== 'all') {
            filtered = filtered.filter(client => client.state === stateFilter);
        }

        setFilteredClients(filtered);
    };

    const getUniqueCities = () => {
        const cities = clients.map(c => c.city).filter(Boolean);
        return [...new Set(cities)];
    };

    const getUniqueStates = () => {
        const states = clients.map(c => c.state).filter(Boolean);
        return [...new Set(states)];
    };

    const totalItems = filteredClients.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredClients.slice(indexOfFirstItem, indexOfLastItem);

    const getPageNumbers = () => {
        const pages = [];
        const maxVisiblePages = 5;
        
        let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
        let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
        
        if (endPage - startPage + 1 < maxVisiblePages) {
            startPage = Math.max(1, endPage - maxVisiblePages + 1);
        }
        
        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }
        
        return pages;
    };

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const handleItemsPerPageChange = (newItemsPerPage) => {
        setItemsPerPage(newItemsPerPage);
        setCurrentPage(1);
    };

    const clearFilters = () => {
        setSearchTerm('');
        setCityFilter('all');
        setStateFilter('all');
    };

    const hasActiveFilters = () => {
        return searchTerm !== '' || cityFilter !== 'all' || stateFilter !== 'all';
    };

    const handleCreateNew = () => {
        setEditingClient(null);
        setIsModalOpen(true);
    };

    const handleEdit = (client) => {
        setEditingClient(client);
        setIsModalOpen(true);
    };

    const handleRowDoubleClick = (client) => {
        handleEdit(client);
    };

    const handleClientSaved = (client) => {
        if (editingClient) {
            setClients(prev => prev.map(c => c.id === client.id ? client : c));
        } else {
            setClients(prev => [...prev, client]);
        }
        setIsModalOpen(false);
        setEditingClient(null);
    };

    const handleModalClose = () => {
        setIsModalOpen(false);
        setEditingClient(null);
    };

    if (loading) {
        return (
            <div className="clients-container">
                <div className="loading-spinner">Carregando clientes...</div>
            </div>
        );
    }

    return (
        <div className="clients-container">
            <div className="clients-header">
                <div className="header-title-section">
                    <h2>Clientes</h2>
                    <div className="results-count">
                        Mostrando {currentItems.length} de {filteredClients.length} clientes
                    </div>
                </div>
                <button className="btn-primary" onClick={handleCreateNew}>
                    Adicionar Novo Cliente
                </button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {/* Filters Section */}
            <div className={`filters-section ${filtersExpanded ? 'expanded' : 'collapsed'}`}>
                <div className="filters-header">
                    <div className="filters-title-section">
                        <h3>Filtros</h3>
                        {hasActiveFilters() && (
                            <span className="active-filters-indicator">
                                • Filtros Ativos
                            </span>
                        )}
                    </div>
                    <div className="filters-header-actions">
                        <button
                            className="btn-toggle-filters"
                            onClick={() => setFiltersExpanded(!filtersExpanded)}
                            title={filtersExpanded ? 'Recolher Filtros' : 'Expandir Filtros'}
                        >
                            {filtersExpanded ? '▲' : '▼'} Filtros
                        </button>
                        <button
                            className="btn-clear-filters"
                            onClick={clearFilters}
                            disabled={!hasActiveFilters()}
                        >
                            Limpar Filtros
                        </button>
                    </div>
                </div>

                {/* Collapsible Content */}
                <div className="filters-content">
                    <div className="filters-grid">
                        {/* Search Input */}
                        <div className="filter-group">
                            <label>Buscar</label>
                            <input
                                type="text"
                                placeholder="Buscar por empresa, responsável, email ou CNPJ..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="search-input"
                            />
                        </div>

                        {/* City Filter */}
                        <div className="filter-group">
                            <label>Cidade</label>
                            <select
                                value={cityFilter}
                                onChange={(e) => setCityFilter(e.target.value)}
                            >
                                <option value="all">Todas as Cidades</option>
                                {getUniqueCities().map(city => (
                                    <option key={city} value={city}>{city}</option>
                                ))}
                            </select>
                        </div>

                        {/* State Filter */}
                        <div className="filter-group">
                            <label>Estado</label>
                            <select
                                value={stateFilter}
                                onChange={(e) => setStateFilter(e.target.value)}
                            >
                                <option value="all">Todos os Estados</option>
                                {getUniqueStates().map(state => (
                                    <option key={state} value={state}>{state}</option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Active Filters Display */}
                    {hasActiveFilters() && (
                        <div className="active-filters">
                            {searchTerm && (
                                <span className="active-filter-tag">
                                    Busca: "{searchTerm}"
                                    <button onClick={() => setSearchTerm('')}>×</button>
                                </span>
                            )}
                            {cityFilter !== 'all' && (
                                <span className="active-filter-tag">
                                    Cidade: {cityFilter}
                                    <button onClick={() => setCityFilter('all')}>×</button>
                                </span>
                            )}
                            {stateFilter !== 'all' && (
                                <span className="active-filter-tag">
                                    Estado: {stateFilter}
                                    <button onClick={() => setStateFilter('all')}>×</button>
                                </span>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Pagination Controls - Top */}
            {/* {totalPages > 1 && (
                <div className="pagination-controls top">
                    <div className="pagination-info">
                        Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} de {totalItems} itens
                    </div>
                    <div className="pagination-items-per-page">
                        <label>Itens por página:</label>
                        <select 
                            value={itemsPerPage} k
                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            )} */}

            {/* Clients Table */}
            <div className="table-container">
                <div className="table-scroll-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="col-company">Empresa</th>
                                <th className="col-contact">Responsável</th>
                                <th className="col-email">Email</th>
                                <th className="col-location">Cidade/Estado</th>
                                <th className="col-cnpj">CNPJ</th>
                                <th className="col-actions">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(client => (
                                <tr 
                                    key={client.id} 
                                    className="table-row"
                                    onDoubleClick={() => handleRowDoubleClick(client)}
                                >
                                    <td className="col-company">
                                        <div className="client-info">
                                            <div className="client-company">{client.company}</div>
                                            {client.principalPosition && (
                                                <div className="client-position">
                                                    {client.principalPosition}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="col-contact">
                                        <span className="client-name">
                                            {client.principalName}
                                        </span>
                                    </td>
                                    <td className="col-email">
                                        <span className="client-email">
                                            {client.email || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="col-location">
                                        <span className="client-location">
                                            {client.city && client.state 
                                                ? `${client.city}/${client.state}`
                                                : 'N/A'
                                            }
                                        </span>
                                    </td>
                                    <td className="col-cnpj">
                                        <span className="client-cnpj">
                                            {client.companyRegNumber || 'N/A'}
                                        </span>
                                    </td>
                                    <td className="col-actions">
                                        <button 
                                            className="btn-update"
                                            onClick={() => handleEdit(client)}
                                        >
                                            Editar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                
                {currentItems.length === 0 && !loading && (
                    <div className="empty-state">
                        <p>
                            {clients.length === 0
                                ? "Nenhum cliente encontrado"
                                : "Nenhum cliente corresponde aos filtros aplicados"
                            }
                        </p>
                        {clients.length === 0 ? (
                            <button className="btn-primary" onClick={handleCreateNew}>
                                Adicionar Primeiro Cliente
                            </button>
                        ) : (
                            <button className="btn-secondary" onClick={clearFilters}>
                                Limpar Filtros
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Pagination Controls - Bottom */}
            {totalPages > 1 && (
                <div className="pagination-controls bottom">
                    <div className="pagination-info">
                        Página {currentPage} de {totalPages} • {totalItems} itens no total
                    </div>
                    
                    <div className="pagination-navigation">
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(1)}
                            disabled={currentPage === 1}
                        >
                            ««
                        </button>
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                        >
                            «
                        </button>
                        
                        {getPageNumbers().map(page => (
                            <button
                                key={page}
                                className={`pagination-btn ${currentPage === page ? 'active' : ''}`}
                                onClick={() => handlePageChange(page)}
                            >
                                {page}
                            </button>
                        ))}
                        
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >
                            »
                        </button>
                        <button
                            className="pagination-btn"
                            onClick={() => handlePageChange(totalPages)}
                            disabled={currentPage === totalPages}
                        >
                            »»
                        </button>
                    </div>

                    <div className="pagination-items-per-page">
                        <label>Itens por página:</label>
                        <select 
                            value={itemsPerPage} 
                            onChange={(e) => handleItemsPerPageChange(Number(e.target.value))}
                        >
                            <option value={10}>10</option>
                            <option value={20}>20</option>
                            <option value={50}>50</option>
                            <option value={100}>100</option>
                        </select>
                    </div>
                </div>
            )}

            <ClientCreationModal
                isOpen={isModalOpen}
                onClose={handleModalClose}
                onClientCreated={handleClientSaved}
                onClientUpdated={handleClientSaved}
                client={editingClient}
                initialData={editingClient ? { company: editingClient.company } : {}}
                mode={editingClient ? 'edit' : 'create'}
            />
        </div>
    );
};

export default ListClients;