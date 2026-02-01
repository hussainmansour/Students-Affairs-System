// Data Service Class
// Handles all API calls using Fetch API

export class DataService {
    constructor(baseURL = 'http://localhost:3000') {
        this.baseURL = baseURL;
    }

    /**
     * Get all records for an entity with optional query parameters
     * @param {string} entity - Entity name (students, courses, etc.)
     * @param {object} params - Query parameters (_page, _limit, q, _sort, _order)
     * @returns {Promise<{data: Array, total: number}>}
     */
    async getAll(entity, params = {}) {
        try {
            const queryString = new URLSearchParams(params).toString();
            const url = `${this.baseURL}/${entity}${queryString ? '?' + queryString : ''}`;
            
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Get total count from response headers for pagination
            const totalCount = response.headers.get('X-Total-Count');
            
            return {
                data: data,
                total: totalCount ? parseInt(totalCount) : data.length
            };
        } catch (error) {
            console.error(`Error fetching ${entity}:`, error);
            throw error;
        }
    }

    /**
     * Get a single record by ID
     * @param {string} entity - Entity name
     * @param {string|number} id - Record ID
     * @returns {Promise<object>}
     */
    async getById(entity, id) {
        try {
            const url = `${this.baseURL}/${entity}/${id}`;
            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error fetching ${entity} with id ${id}:`, error);
            throw error;
        }
    }

    /**
     * Create a new record
     * @param {string} entity - Entity name
     * @param {object} data - Record data
     * @returns {Promise<object>}
     */
    async create(entity, data) {
        try {
            const url = `${this.baseURL}/${entity}`;
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error creating ${entity}:`, error);
            throw error;
        }
    }

    /**
     * Update an existing record
     * @param {string} entity - Entity name
     * @param {string|number} id - Record ID
     * @param {object} data - Updated record data
     * @returns {Promise<object>}
     */
    async update(entity, id, data) {
        try {
            const url = `${this.baseURL}/${entity}/${id}`;
            const response = await fetch(url, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error updating ${entity} with id ${id}:`, error);
            throw error;
        }
    }

    /**
     * Partially update an existing record
     * @param {string} entity - Entity name
     * @param {string|number} id - Record ID
     * @param {object} data - Partial record data
     * @returns {Promise<object>}
     */
    async patch(entity, id, data) {
        try {
            const url = `${this.baseURL}/${entity}/${id}`;
            const response = await fetch(url, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error patching ${entity} with id ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete a record
     * @param {string} entity - Entity name
     * @param {string|number} id - Record ID
     * @returns {Promise<void>}
     */
    async delete(entity, id) {
        try {
            const url = `${this.baseURL}/${entity}/${id}`;
            const response = await fetch(url, {
                method: 'DELETE'
            });
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return;
        } catch (error) {
            console.error(`Error deleting ${entity} with id ${id}:`, error);
            throw error;
        }
    }

    /**
     * Search records
     * @param {string} entity - Entity name
     * @param {string} query - Search query
     * @returns {Promise<Array>}
     */
    async search(entity, query) {
        return this.getAll(entity, { q: query });
    }

    /**
     * Sort records
     * @param {string} entity - Entity name
     * @param {string} sortField - Field to sort by
     * @param {string} order - Sort order (asc or desc)
     * @returns {Promise<Array>}
     */
    async sort(entity, sortField, order = 'asc') {
        return this.getAll(entity, { _sort: sortField, _order: order });
    }
}