// UI Manager Class
// Handles all UI-related operations

import { EntityConfig } from '../config/EntityConfig.js';

export class UIManager {
    constructor() {
        this.modal = document.getElementById('modal');
        this.modalTitle = document.getElementById('modal-title');
        this.formFields = document.getElementById('form-fields');
        this.recordForm = document.getElementById('record-form');
        this.loadingOverlay = document.getElementById('loading-overlay');
        this.toast = document.getElementById('toast');
    }

    /**
     * Open modal for adding or editing records
     * @param {string} mode - 'add' or 'edit'
     * @param {string} entity - Entity type
     * @param {object} data - Existing data (for edit mode)
     */
    openModal(mode, entity, data = null) {
        const config = EntityConfig[entity];
        
        // Set modal title
        if (mode === 'add') {
            this.modalTitle.textContent = `Add New ${config.title.slice(0, -1)}`;
        } else {
            this.modalTitle.textContent = `Edit ${config.title.slice(0, -1)}`;
        }

        // Generate form fields
        this.generateFormFields(config.fields, data);

        // Set form mode and data
        this.recordForm.dataset.mode = mode;
        if (data && data.id) {
            this.recordForm.dataset.id = data.id;
        }

        // Show modal
        this.modal.style.display = 'flex';
        
        // Focus first input
        setTimeout(() => {
            const firstInput = this.formFields.querySelector('input, textarea, select');
            if (firstInput) {
                firstInput.focus();
            }
        }, 100);
    }

    /**
     * Generate form fields based on entity configuration
     * @param {Array} fields - Field configuration array
     * @param {object} data - Existing data to populate form
     */
    generateFormFields(fields, data) {
        this.formFields.innerHTML = '';

        fields.forEach(field => {
            // Skip ID field and non-editable fields
            if (field.key === 'id' || !field.editable) {
                return;
            }

            const formGroup = document.createElement('div');
            formGroup.className = 'form-group';

            // Create label
            const label = document.createElement('label');
            label.textContent = field.label;
            if (field.required) {
                label.textContent += ' *';
            }
            formGroup.appendChild(label);

            // Create input based on type
            let input;

            switch (field.type) {
                case 'textarea':
                    input = document.createElement('textarea');
                    input.name = field.key;
                    input.required = field.required;
                    if (data && data[field.key]) {
                        input.value = data[field.key];
                    }
                    break;

                case 'select':
                    input = document.createElement('select');
                    input.name = field.key;
                    input.required = field.required;
                    
                    // Add default option
                    const defaultOption = document.createElement('option');
                    defaultOption.value = '';
                    defaultOption.textContent = `Select ${field.label}`;
                    input.appendChild(defaultOption);
                    
                    // Add options
                    if (field.options) {
                        field.options.forEach(option => {
                            const optionElement = document.createElement('option');
                            optionElement.value = option;
                            optionElement.textContent = option;
                            if (data && data[field.key] === option) {
                                optionElement.selected = true;
                            }
                            input.appendChild(optionElement);
                        });
                    }
                    break;

                case 'number':
                    input = document.createElement('input');
                    input.type = 'number';
                    input.name = field.key;
                    input.required = field.required;
                    if (field.min !== undefined) input.min = field.min;
                    if (field.max !== undefined) input.max = field.max;
                    if (field.step !== undefined) input.step = field.step;
                    if (data && data[field.key]) {
                        input.value = data[field.key];
                    }
                    break;

                default:
                    input = document.createElement('input');
                    input.type = field.type;
                    input.name = field.key;
                    input.required = field.required;
                    if (data && data[field.key]) {
                        input.value = data[field.key];
                    }
                    break;
            }

            formGroup.appendChild(input);
            this.formFields.appendChild(formGroup);
        });
    }

    /**
     * Close the modal
     */
    closeModal() {
        this.modal.style.display = 'none';
        this.recordForm.reset();
        this.recordForm.removeAttribute('data-mode');
        this.recordForm.removeAttribute('data-id');
    }

    /**
     * Show loading overlay
     */
    showLoading() {
        this.loadingOverlay.style.display = 'flex';
    }

    /**
     * Hide loading overlay
     */
    hideLoading() {
        this.loadingOverlay.style.display = 'none';
    }

    /**
     * Show toast notification
     * @param {string} message - Message to display
     * @param {string} type - Toast type ('success' or 'error')
     */
    showToast(message, type = 'success') {
        this.toast.textContent = message;
        this.toast.className = `toast ${type}`;
        this.toast.style.display = 'block';

        setTimeout(() => {
            this.hideToast();
        }, 3000);
    }

    /**
     * Hide toast notification
     */
    hideToast() {
        this.toast.style.display = 'none';
    }

    /**
     * Show confirmation dialog
     * @param {string} message - Confirmation message
     * @returns {boolean}
     */
    confirm(message) {
        return window.confirm(message);
    }

    /**
     * Create empty state HTML
     * @param {string} message - Empty state message
     * @returns {string}
     */
    createEmptyState(message = 'No records found') {
        return `
            <div class="empty-state">
                <div class="empty-state-icon">📭</div>
                <h3>No Records Found</h3>
                <p>${message}</p>
            </div>
        `;
    }

    /**
     * Format date for display
     * @param {string} dateString - Date string
     * @returns {string}
     */
    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    /**
     * Sanitize HTML to prevent XSS
     * @param {string} str - String to sanitize
     * @returns {string}
     */
    sanitizeHTML(str) {
        const temp = document.createElement('div');
        temp.textContent = str;
        return temp.innerHTML;
    }
}