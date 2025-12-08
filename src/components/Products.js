import React, { useState, useEffect } from 'react';
import api from '../api';
import '../App.css';

const Products = () => {
    const [products, setProducts] = useState([]);
    const [filteredProducts, setFilteredProducts] = useState([]);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(true);
    
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setLoading(true);
                const response = await api.get('/products');
                
                const safeProducts = Array.isArray(response.data) 
                    ? response.data.map(product => ({
                        id: product.id || 0,
                        name: product.name || 'Unnamed Product',
                        description: product.description || '',
                        category: product.category || 'Uncategorized',
                        price: product.price ? {
                            amount: product.price.amount || product.price.unitPrice || 0,
                            isActive: product.price.isActive || false,
                            currency: product.price.currency || 'USD'
                        } : null
                    }))
                    : [];
                    
                setProducts(safeProducts);
                setFilteredProducts(safeProducts);
            } catch (err) {
                console.error('Error fetching products:', err);
                setError('Failed to load products. Please try again later.');
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    const totalItems = filteredProducts.length;
    const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredProducts.slice(indexOfFirstItem, indexOfLastItem);

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

    const handleUpdate = (productId) => {
        console.log('Update product:', productId);
        // actually Product/prices change has not being implemented due to B.R.
    };

    const getStatusBadge = (isActive) => {
        return isActive ? (
            <span className="badge badge-active">Ativo</span>
        ) : (
            <span className="badge badge-inactive">Inativo</span>
        );
    };

    const formatCurrency = (amount, currency = 'BRL') => {
        return new Intl.NumberFormat('pt-BR', {
            style: 'currency',
            currency: currency
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <div className="products-container">
                <div className="loading-spinner">Carregando produtos...</div>
            </div>
        );
    }

    return (
        <div className="products-container">
            <div className="products-header">
                <div className="header-title-section">
                    <h2>Produtos</h2>
                    <div className="results-count">
                        Mostrando {currentItems.length} de {filteredProducts.length} produtos
                    </div>
                </div>
                <button className="btn-primary">Adicionar Novo Produto</button>
            </div>

            {error && <div className="error-message">{error}</div>}

            {totalPages > 1 && (
                <div className="pagination-controls top">
                    <div className="pagination-info">
                        Mostrando {indexOfFirstItem + 1}-{Math.min(indexOfLastItem, totalItems)} de {totalItems} itens
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

            <div className="table-container">
                <div className="table-scroll-wrapper">
                    <table className="table">
                        <thead>
                            <tr>
                                <th className="col-name">Nome</th>
                                <th className="col-category">Categoria</th>
                                <th className="col-price">Preço</th>
                                <th className="col-status">Status</th>
                                <th className="col-actions">Ações</th>
                            </tr>
                        </thead>
                        <tbody>
                            {currentItems.map(product => (
                                <tr key={product.id} className="table-row">
                                    <td className="col-name">
                                        <div className="product-info">
                                            <div className="product-name">{product.name}</div>
                                            {product.description && (
                                                <div className="product-description">
                                                    {product.description}
                                                </div>
                                            )}
                                        </div>
                                    </td>
                                    <td className="col-category">
                                        <span className="product-category">
                                            {product.category}
                                        </span>
                                    </td>
                                    <td className="col-price">
                                        <span className="product-price">
                                            {product.price 
                                                ? formatCurrency(product.price.amount, product.price.currency)
                                                : 'N/A'
                                            }
                                        </span>
                                    </td>
                                    <td className="col-status">
                                        {product.price 
                                            ? getStatusBadge(product.price.isActive)
                                            : getStatusBadge(false)
                                        }
                                    </td>
                                    <td className="col-actions">
                                        <button 
                                            className="btn-update"
                                            onClick={() => handleUpdate(product.id)}
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
                        <p>Nenhum produto encontrado</p>
                    </div>
                )}
            </div>

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
        </div>
    );
};

export default Products;