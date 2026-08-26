/**
 * ============================================================
 * CATALOGUE METADATA BUILDER
 * ============================================================
 *
 * Reusable dynamic metadata field builder.
 *
 * Supported field types:
 * - text
 * - number
 * - boolean
 * - select
 * - textarea
 *
 * The builder stores the final metadata object in the
 * hidden input supplied during initialization.
 * ============================================================
 */

class MetadataBuilder {

    constructor(options = {}) {

        this.container = document.querySelector(options.container);
        this.input = document.querySelector(options.input);

        this.initialData = options.data || {};

        if (!this.container || !this.input) {
            console.warn('MetadataBuilder: Required elements not found.');
            return;
        }

        this.fields = [];

        this.init();
    }


    /**
     * --------------------------------------------------------
     * INITIALIZE
     * --------------------------------------------------------
     */

    init() {

        this.loadInitialData();

        this.render();

        this.updateInput();
    }


    /**
     * --------------------------------------------------------
     * LOAD EXISTING DATA
     * --------------------------------------------------------
     */

    loadInitialData() {

        if (
            !this.initialData ||
            typeof this.initialData !== 'object' ||
            Array.isArray(this.initialData)
        ) {
            return;
        }

        Object.entries(this.initialData).forEach(([key, value]) => {

            let type = 'text';

            if (typeof value === 'boolean') {
                type = 'boolean';
            }

            else if (typeof value === 'number') {
                type = 'number';
            }

            this.fields.push({
                key,
                label: this.formatLabel(key),
                type,
                value
            });

        });

    }


    /**
     * --------------------------------------------------------
     * ADD FIELD
     * --------------------------------------------------------
     */

    addField(field = {}) {

        this.fields.push({

            key: field.key || '',

            label: field.label || '',

            type: field.type || 'text',

            value: field.value ?? '',

            options: field.options || []

        });

        this.render();

        this.updateInput();

    }


    /**
     * --------------------------------------------------------
     * REMOVE FIELD
     * --------------------------------------------------------
     */

    removeField(index) {

        this.fields.splice(index, 1);

        this.render();

        this.updateInput();

    }


    /**
     * --------------------------------------------------------
     * RENDER
     * --------------------------------------------------------
     */

    render() {

        this.container.innerHTML = '';

        if (this.fields.length === 0) {

            this.renderEmptyState();

            return;
        }


        this.fields.forEach((field, index) => {

            this.container.appendChild(
                this.createFieldElement(field, index)
            );

        });

    }


    /**
     * --------------------------------------------------------
     * EMPTY STATE
     * --------------------------------------------------------
     */

    renderEmptyState() {

        const empty = document.createElement('div');

        empty.className = 'metadata-builder-empty';

        empty.innerHTML = `
            <div class="metadata-builder-empty-icon">
                <i class="bi bi-sliders"></i>
            </div>

            <strong>
                No additional information
            </strong>

            <span>
                Add custom information specific to this catalogue item.
            </span>
        `;

        this.container.appendChild(empty);

    }


    /**
     * --------------------------------------------------------
     * CREATE FIELD
     * --------------------------------------------------------
     */

    createFieldElement(field, index) {

        const wrapper = document.createElement('div');

        wrapper.className = 'metadata-builder-field';


        wrapper.innerHTML = `

            <div class="metadata-builder-field-header">

                <div>

                    <span class="metadata-builder-field-number">
                        ${index + 1}
                    </span>

                    <strong>
                        Additional Field
                    </strong>

                </div>

                <button
                    type="button"
                    class="metadata-builder-remove"
                    data-index="${index}"
                    title="Remove field">

                    <i class="bi bi-trash"></i>

                </button>

            </div>


            <div class="row g-3">

                <!-- FIELD NAME -->

                <div class="col-md-5">

                    <label class="admin-form-label">

                        Field Name

                    </label>

                    <input
                        type="text"
                        class="admin-form-control metadata-field-key"
                        data-index="${index}"
                        value="${this.escapeHtml(field.key)}"
                        placeholder="e.g. minimum_quantity">

                    <div class="admin-form-help">

                        <i class="bi bi-info-circle"></i>

                        Use a unique name for this information.

                    </div>

                </div>


                <!-- FIELD TYPE -->

                <div class="col-md-3">

                    <label class="admin-form-label">

                        Field Type

                    </label>

                    <select
                        class="admin-form-control metadata-field-type"
                        data-index="${index}">

                        ${this.renderTypeOptions(field.type)}

                    </select>

                </div>


                <!-- VALUE -->

                <div class="col-md-4">

                    <label class="admin-form-label">

                        Value

                    </label>

                    ${this.renderValueInput(field, index)}

                </div>

            </div>

        `;


        this.attachFieldEvents(wrapper, index);

        return wrapper;

    }


    /**
     * --------------------------------------------------------
     * FIELD TYPES
     * --------------------------------------------------------
     */

    renderTypeOptions(selected) {

        const types = [

            ['text', 'Text'],

            ['number', 'Number'],

            ['boolean', 'Yes / No'],

            ['select', 'Select'],

            ['textarea', 'Long Text']

        ];


        return types.map(([value, label]) => `

            <option
                value="${value}"
                ${selected === value ? 'selected' : ''}>

                ${label}

            </option>

        `).join('');

    }


    /**
     * --------------------------------------------------------
     * VALUE INPUT
     * --------------------------------------------------------
     */

    renderValueInput(field, index) {

        switch (field.type) {

            case 'number':

                return `

                    <input
                        type="number"
                        class="admin-form-control metadata-field-value"
                        data-index="${index}"
                        value="${this.escapeHtml(field.value)}"
                        placeholder="Enter a number">

                `;


            case 'boolean':

                return `

                    <select
                        class="admin-form-control metadata-field-value"
                        data-index="${index}">

                        <option
                            value="true"
                            ${field.value === true ? 'selected' : ''}>

                            Yes

                        </option>

                        <option
                            value="false"
                            ${field.value === false ? 'selected' : ''}>

                            No

                        </option>

                    </select>

                `;


            case 'textarea':

                return `

                    <textarea
                        class="admin-form-control metadata-field-value ckeditor"
                        data-index="${index}"
                        rows="3"
                        placeholder="Enter additional information">${this.escapeHtml(field.value)}</textarea>

                `;


            case 'select':

                return `

                    <input
                        type="text"
                        class="admin-form-control metadata-field-value"
                        data-index="${index}"
                        value="${this.escapeHtml(field.value)}"
                        placeholder="Enter value">

                    <div class="admin-form-help">

                        <i class="bi bi-info-circle"></i>

                        Select values can be refined later if needed.

                    </div>

                `;


            default:

                return `

                    <input
                        type="text"
                        class="admin-form-control metadata-field-value"
                        data-index="${index}"
                        value="${this.escapeHtml(field.value)}"
                        placeholder="Enter value">

                `;

        }

    }


    /**
     * --------------------------------------------------------
     * EVENTS
     * --------------------------------------------------------
     */

    attachFieldEvents(wrapper, index) {

        const removeButton =
            wrapper.querySelector('.metadata-builder-remove');

        removeButton.addEventListener('click', () => {

            this.removeField(index);

        });


        const keyInput =
            wrapper.querySelector('.metadata-field-key');

        keyInput.addEventListener('input', event => {

            this.fields[index].key =
                this.normalizeKey(event.target.value);

            this.updateInput();

        });


        const typeInput =
            wrapper.querySelector('.metadata-field-type');

        typeInput.addEventListener('change', event => {

            this.fields[index].type =
                event.target.value;

            this.render();

            this.updateInput();

        });


        const valueInput =
            wrapper.querySelector('.metadata-field-value');

        if (valueInput) {

            valueInput.addEventListener('input', event => {

                this.fields[index].value =
                    this.parseValue(
                        event.target.value,
                        this.fields[index].type
                    );

                this.updateInput();

            });

            valueInput.addEventListener('change', event => {

                this.fields[index].value =
                    this.parseValue(
                        event.target.value,
                        this.fields[index].type
                    );

                this.updateInput();

            });

        }

    }


    /**
     * --------------------------------------------------------
     * UPDATE HIDDEN INPUT
     * --------------------------------------------------------
     */

    updateInput() {

        const metadata = {};

        this.fields.forEach(field => {

            const key = this.normalizeKey(field.key);

            if (!key) {
                return;
            }

            metadata[key] = field.value;

        });


        this.input.value = JSON.stringify(metadata);

    }


    /**
     * --------------------------------------------------------
     * PARSE VALUE
     * --------------------------------------------------------
     */

    parseValue(value, type) {

        switch (type) {

            case 'number':

                if (value === '') {
                    return null;
                }

                return Number(value);


            case 'boolean':

                return value === 'true';


            default:

                return value;

        }

    }


    /**
     * --------------------------------------------------------
     * NORMALIZE KEY
     * --------------------------------------------------------
     */

    normalizeKey(value) {

        return String(value || '')

            .toLowerCase()

            .trim()

            .replace(/&/g, 'and')

            .replace(/[^a-z0-9]+/g, '_')

            .replace(/^_+|_+$/g, '');

    }


    /**
     * --------------------------------------------------------
     * FORMAT LABEL
     * --------------------------------------------------------
     */

    formatLabel(value) {

        return String(value)

            .replace(/_/g, ' ')

            .replace(/\b\w/g, char => char.toUpperCase());

    }


    /**
     * --------------------------------------------------------
     * ESCAPE HTML
     * --------------------------------------------------------
     */

    escapeHtml(value) {

        return String(value ?? '')

            .replace(/&/g, '&amp;')

            .replace(/</g, '&lt;')

            .replace(/>/g, '&gt;')

            .replace(/"/g, '&quot;')

            .replace(/'/g, '&#039;');

    }

}


/**
 * ============================================================
 * GLOBAL INITIALIZER
 * ============================================================
 */

window.MetadataBuilder = {

    init(options = {}) {

        return new MetadataBuilder(options);

    }

};