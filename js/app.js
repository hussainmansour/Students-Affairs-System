// Main Application Class
import { DataService } from './services/DataService.js';
import { UIManager } from './ui/UIManager.js';
import { EntityConfig } from './config/EntityConfig.js';

class App {
    constructor() {
        this.dataService = new DataService();
        this.uiManager = new UIManager();
        this.currentEntity = 'students';
        this.currentPage = 1;
        this.itemsPerPage = 10;
        this.searchQuery = '';
        this.sortField = '';
        this.sortOrder = 'asc';
        
        this.init();
    }

    async init() {
        this.setupEventListeners();
        await this.loadData();
    }

    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-item').forEach(item => {
            item.addEventListener('click', (e) => this.handleNavigation(e));
        });

        // Add new button
        document.getElementById('add-new-btn').addEventListener('click', () => {
            this.uiManager.openModal('add', this.currentEntity);
        });

        // Search
        document.getElementById('search-input').addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.currentPage = 1;
            this.loadData();
        });

        // Sort
        document.getElementById('sort-select').addEventListener('change', (e) => {
            const value = e.target.value;
            if (value) {
                const [field, order] = value.split(':');
                this.sortField = field;
                this.sortOrder = order;
            } else {
                this.sortField = '';
                this.sortOrder = 'asc';
            }
            this.loadData();
        });

        // Pagination
        document.getElementById('prev-btn').addEventListener('click', () => {
            if (this.currentPage > 1) {
                this.currentPage--;
                this.loadData();
            }
        });

        document.getElementById('next-btn').addEventListener('click', () => {
            this.currentPage++;
            this.loadData();
        });

        // Modal
        document.getElementById('modal-close').addEventListener('click', () => {
            this.uiManager.closeModal();
        });

        document.getElementById('cancel-btn').addEventListener('click', () => {
            this.uiManager.closeModal();
        });

        // Form submission
        document.getElementById('record-form').addEventListener('submit', (e) => {
            this.handleFormSubmit(e);
        });

        // Close modal on background click
        document.getElementById('modal').addEventListener('click', (e) => {
            if (e.target.id === 'modal') {
                this.uiManager.closeModal();
            }
        });
    }

    handleNavigation(e) {
        const button = e.currentTarget;
        const entity = button.dataset.entity;
        
        // Update active state
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        button.classList.add('active');

        // Update current entity
        this.currentEntity = entity;
        this.currentPage = 1;
        this.searchQuery = '';
        this.sortField = '';
        this.sortOrder = 'asc';
        
        // Reset search and sort
        document.getElementById('search-input').value = '';
        document.getElementById('sort-select').value = '';

        // Update UI
        this.updatePageTitle();
        this.updateSortOptions();
        
        // Load data
        this.loadData();
    }

    updatePageTitle() {
        const config = EntityConfig[this.currentEntity];
        document.getElementById('page-title').textContent = config.title;
        document.getElementById('page-subtitle').textContent = config.subtitle;
    }

    updateSortOptions() {
        const config = EntityConfig[this.currentEntity];
        const sortSelect = document.getElementById('sort-select');
        
        sortSelect.innerHTML = '<option value="">Sort by...</option>';
        
        config.fields.forEach(field => {
            if (field.sortable) {
                sortSelect.innerHTML += `
                    <option value="${field.key}:asc">${field.label} (A-Z)</option>
                    <option value="${field.key}:desc">${field.label} (Z-A)</option>
                `;
            }
        });

        // If a sort is already active, reflect it in the dropdown
        if (this.sortField) {
            sortSelect.value = `${this.sortField}:${this.sortOrder}`;
        } else {
            sortSelect.value = '';
        }
    }

    async loadData() {
        try {
            this.uiManager.showLoading();

            const params = {
                _page: this.currentPage,
                _limit: this.itemsPerPage
            };

            if (this.searchQuery) {
                params.q = this.searchQuery;
            }

            if (this.sortField) {
                params._sort = this.sortField;
                params._order = this.sortOrder;
            }

            const response = await this.dataService.getAll(this.currentEntity, params);
            const data = response.data;
            const totalCount = response.total;

            this.renderTable(data);
            this.updatePagination(totalCount);
            
            this.uiManager.hideLoading();
        } catch (error) {
            this.uiManager.hideLoading();
            this.uiManager.showToast('Failed to load data', 'error');
            console.error('Error loading data:', error);
        }
    }

    renderTable(data) {
        const config = EntityConfig[this.currentEntity];
        const tableHead = document.getElementById('table-head');
        const tableBody = document.getElementById('table-body');

        // Render headers
        let headersHTML = '<tr>';
        config.fields.forEach(field => {
            if (field.showInTable) {
                const sortableClass = field.sortable ? 'sortable' : '';

                // Determine sort indicator for this field
                let indicator = '';
                if (this.sortField === field.key) {
                    indicator = this.sortOrder === 'asc' ? ' ▲' : ' ▼';
                }

                if (field.sortable) {
                    headersHTML += `<th class="${sortableClass} ${this.sortField === field.key ? 'sorted' : ''}" data-key="${field.key}">${field.label}<span class="sort-indicator">${indicator}</span></th>`;
                } else {
                    headersHTML += `<th>${field.label}</th>`;
                }
            }
        });
        headersHTML += '<th>Actions</th></tr>';
        tableHead.innerHTML = headersHTML;

        // Render rows
        if (data.length === 0) {
            tableBody.innerHTML = `
                <tr>
                    <td colspan="${config.fields.filter(f => f.showInTable).length + 1}">
                        <div class="empty-state">
                            <div class="empty-state-icon">📭</div>
                            <h3>No records found</h3>
                            <p>Try adjusting your search or add a new record</p>
                        </div>
                    </td>
                </tr>
            `;
            return;
        }

        let rowsHTML = '';
        data.forEach(item => {
            rowsHTML += '<tr>';
            config.fields.forEach(field => {
                if (field.showInTable) {
                    rowsHTML += `<td>${item[field.key] || '-'}</td>`;
                }
            });
            rowsHTML += `
                <td>
                    <div class="action-buttons">
                        <button class="btn-icon btn-edit" data-id="${item.id}">Edit</button>
                        <button class="btn-icon btn-delete" data-id="${item.id}">Delete</button>
                    </div>
                </td>
            `;
            rowsHTML += '</tr>';
        });
        tableBody.innerHTML = rowsHTML;

        // Add event listeners to action buttons
        this.attachActionListeners();

        // Attach click listeners to sortable headers
        this.attachHeaderSortListeners();
    }

    attachHeaderSortListeners() {
        document.querySelectorAll('#table-head th[data-key]').forEach(th => {
            // Remove existing listener by cloning node to avoid duplicate handlers
            const newTh = th.cloneNode(true);
            th.parentNode.replaceChild(newTh, th);
        });

        document.querySelectorAll('#table-head th[data-key]').forEach(th => {
            th.addEventListener('click', (e) => {
                const key = th.dataset.key;

                if (!key) return;

                if (this.sortField === key) {
                    // Toggle order
                    this.sortOrder = this.sortOrder === 'asc' ? 'desc' : 'asc';
                } else {
                    this.sortField = key;
                    this.sortOrder = 'asc';
                }

                // Update the sort select to reflect header click
                const sortSelect = document.getElementById('sort-select');
                if (this.sortField) {
                    sortSelect.value = `${this.sortField}:${this.sortOrder}`;
                } else {
                    sortSelect.value = '';
                }

                // Re-load data (will re-render headers with new indicators)
                this.loadData();
            });
        });
    }

    attachActionListeners() {
        // Edit buttons
        document.querySelectorAll('.btn-edit').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const id = e.target.dataset.id;
                await this.handleEdit(id);
            });
        });

        // Delete buttons
        document.querySelectorAll('.btn-delete').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const id = e.target.dataset.id;
                this.handleDelete(id);
            });
        });
    }

    async handleEdit(id) {
        try {
            this.uiManager.showLoading();
            const data = await this.dataService.getById(this.currentEntity, id);
            this.uiManager.hideLoading();
            this.uiManager.openModal('edit', this.currentEntity, data);
        } catch (error) {
            this.uiManager.hideLoading();
            this.uiManager.showToast('Failed to load record', 'error');
            console.error('Error loading record:', error);
        }
    }

    async handleDelete(id) {
        if (!confirm('Are you sure you want to delete this record?')) {
            return;
        }

        try {
            this.uiManager.showLoading();
            await this.dataService.delete(this.currentEntity, id);
            this.uiManager.hideLoading();
            this.uiManager.showToast('Record deleted successfully', 'success');
            await this.loadData();
        } catch (error) {
            this.uiManager.hideLoading();
            this.uiManager.showToast('Failed to delete record', 'error');
            console.error('Error deleting record:', error);
        }
    }

    async handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(e.target);
        const data = Object.fromEntries(formData.entries());
        const mode = e.target.dataset.mode;
        const id = e.target.dataset.id;

        try {
            this.uiManager.showLoading();

            if (mode === 'add') {
                await this.dataService.create(this.currentEntity, data);
                this.uiManager.showToast('Record created successfully', 'success');
            } else if (mode === 'edit') {
                await this.dataService.update(this.currentEntity, id, data);
                this.uiManager.showToast('Record updated successfully', 'success');
            }

            this.uiManager.closeModal();
            this.uiManager.hideLoading();
            await this.loadData();
        } catch (error) {
            this.uiManager.hideLoading();
            this.uiManager.showToast('Failed to save record', 'error');
            console.error('Error saving record:', error);
        }
    }

    updatePagination(totalCount) {
        const totalPages = Math.ceil(totalCount / this.itemsPerPage);
        
        document.getElementById('page-info').textContent = 
            `Page ${this.currentPage} of ${totalPages}`;
        
        document.getElementById('prev-btn').disabled = this.currentPage === 1;
        document.getElementById('next-btn').disabled = this.currentPage >= totalPages;
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new App();
});