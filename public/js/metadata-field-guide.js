export const metadataFieldGuide = {

    general: {
        title: 'General',
        icon: 'bi-grid',
        description: 'Common fields that can be used across most catalogue items.',

        fields: [
            {
                name: 'duration',
                type: 'text',
                description: 'How long the service normally takes.',
                example: '3 - 5 business days'
            },
            {
                name: 'delivery_time',
                type: 'text',
                description: 'Expected delivery or completion time.',
                example: '48 hours'
            },
            {
                name: 'quantity',
                type: 'number',
                description: 'Number of units, copies, or items required.',
                example: '100'
            },
            {
                name: 'requires_booking',
                type: 'boolean',
                description: 'Whether the customer needs to book before the service can begin.',
                example: 'Yes / No'
            },
            {
                name: 'notes',
                type: 'textarea',
                description: 'Additional information supplied by the customer.',
                example: 'Additional requirements'
            }
        ]
    },


    branding: {
        title: 'Branding & Identity',
        icon: 'bi-palette',
        description: 'Useful fields for brand identity and branding services.',

        fields: [
            {
                name: 'brand_name',
                type: 'text',
                description: 'Name of the brand being worked on.',
                example: 'AlLink@go'
            },
            {
                name: 'business_type',
                type: 'text',
                description: 'Industry or type of business.',
                example: 'Fashion'
            },
            {
                name: 'target_audience',
                type: 'textarea',
                description: 'The primary audience the brand serves.',
                example: 'Young professionals'
            },
            {
                name: 'brand_style',
                type: 'text',
                description: 'Preferred visual direction or personality.',
                example: 'Modern and minimal'
            },
            {
                name: 'color_preference',
                type: 'text',
                description: 'Preferred colours for the brand.',
                example: 'Navy blue and gold'
            },
            {
                name: 'logo_required',
                type: 'boolean',
                description: 'Whether logo design is included.',
                example: 'Yes'
            }
        ]
    },


    packaging: {
        title: 'Packaging',
        icon: 'bi-box-seam',
        description: 'Useful fields for packaging design and production.',

        fields: [
            {
                name: 'package_type',
                type: 'text',
                description: 'Type of packaging required.',
                example: 'Paper bag'
            },
            {
                name: 'package_size',
                type: 'text',
                description: 'Required packaging dimensions or size.',
                example: '10 × 15 inches'
            },
            {
                name: 'material',
                type: 'text',
                description: 'Material to be used.',
                example: 'Kraft paper'
            },
            {
                name: 'quantity',
                type: 'number',
                description: 'Number of packaging units required.',
                example: '500'
            },
            {
                name: 'finishing',
                type: 'text',
                description: 'Desired finishing treatment.',
                example: 'Matte lamination'
            }
        ]
    },


    printing: {
        title: 'Printing',
        icon: 'bi-printer',
        description: 'Useful fields for digital and offset printing.',

        fields: [
            {
                name: 'print_type',
                type: 'text',
                description: 'Type of printing required.',
                example: 'Digital printing'
            },
            {
                name: 'paper_type',
                type: 'text',
                description: 'Type of paper or printing material.',
                example: '300gsm Art Card'
            },
            {
                name: 'paper_size',
                type: 'text',
                description: 'Required print size.',
                example: 'A5'
            },
            {
                name: 'quantity',
                type: 'number',
                description: 'Number of copies required.',
                example: '1000'
            },
            {
                name: 'color_mode',
                type: 'text',
                description: 'Colour specification.',
                example: 'Full Colour'
            },
            {
                name: 'finishing',
                type: 'text',
                description: 'Required printing finishing.',
                example: 'Gloss lamination'
            }
        ]
    },


    consultation: {
        title: 'Consultation',
        icon: 'bi-chat-square-text',
        description: 'Useful fields for consultation and strategy services.',

        fields: [
            {
                name: 'business_type',
                type: 'text',
                description: 'Type of business requiring consultation.',
                example: 'Restaurant'
            },
            {
                name: 'business_goal',
                type: 'textarea',
                description: 'What the customer wants to achieve.',
                example: 'Build a stronger brand identity'
            },
            {
                name: 'challenge',
                type: 'textarea',
                description: 'Main problem the customer wants help solving.',
                example: 'Poor brand recognition'
            },
            {
                name: 'target_audience',
                type: 'textarea',
                description: 'The audience the customer is targeting.',
                example: 'Young adults'
            },
            {
                name: 'preferred_date',
                type: 'date',
                description: 'Preferred date for the consultation.',
                example: '2026-09-01'
            }
        ]
    },


    digital: {
        title: 'Digital Services',
        icon: 'bi-display',
        description: 'Useful fields for digital design and digital products.',

        fields: [
            {
                name: 'platform',
                type: 'text',
                description: 'Platform the digital product is intended for.',
                example: 'Instagram'
            },
            {
                name: 'dimensions',
                type: 'text',
                description: 'Required digital dimensions.',
                example: '1080 × 1080px'
            },
            {
                name: 'file_format',
                type: 'text',
                description: 'Required output format.',
                example: 'PNG / JPG / PDF'
            },
            {
                name: 'number_of_designs',
                type: 'number',
                description: 'Number of designs required.',
                example: '5'
            }
        ]
    },


    booking: {
        title: 'Booking & Ordering',
        icon: 'bi-calendar-check',
        description: 'Fields useful when a catalogue item requires customer scheduling.',

        fields: [
            {
                name: 'requires_booking',
                type: 'boolean',
                description: 'Whether booking is required.',
                example: 'Yes'
            },
            {
                name: 'booking_duration',
                type: 'number',
                description: 'Duration of the booking session.',
                example: '60'
            },
            {
                name: 'booking_date',
                type: 'date',
                description: 'Preferred booking date.',
                example: '2026-09-01'
            },
            {
                name: 'booking_time',
                type: 'time',
                description: 'Preferred booking time.',
                example: '10:00'
            }
        ]
    }

};

const guideContainer = document.querySelector('#metadataGuideContainer');
const searchInput = document.querySelector('#metadataGuideSearch');
const emptyState = document.querySelector('#metadataGuideEmpty');


function renderGuide(searchTerm = '') {

    if (!guideContainer) return;

    const search = searchTerm
        .trim()
        .toLowerCase();

    let totalMatches = 0;

    guideContainer.innerHTML = '';


    Object.values(metadataFieldGuide).forEach(section => {

        const fields = section.fields.filter(field => {

            if (!search) return true;

            return (
                field.name.toLowerCase().includes(search) ||
                field.description.toLowerCase().includes(search) ||
                field.example.toLowerCase().includes(search) ||
                field.type.toLowerCase().includes(search)
            );

        });


        if (!fields.length) return;

        totalMatches += fields.length;


        const sectionElement = document.createElement('div');

        sectionElement.className = 'metadata-guide-section';


        sectionElement.innerHTML = `

            <div class="metadata-guide-section-header">

                <div class="metadata-guide-section-icon">

                    <i class="bi ${section.icon}"></i>

                </div>

                <div>

                    <strong>
                        ${section.title}
                    </strong>

                    <span>
                        ${section.description}
                    </span>

                </div>

            </div>


            <div class="metadata-field-list">

                ${fields.map(field => `

                    <div class="metadata-field-item">

                        <div class="metadata-field-name">

                            <code>
                                ${field.name}
                            </code>

                            <span class="metadata-field-type">
                                ${field.type}
                            </span>

                        </div>


                        <p>
                            ${field.description}
                        </p>


                        <small>

                            <i class="bi bi-arrow-return-right"></i>

                            Example:

                            <strong>
                                ${field.example}
                            </strong>

                        </small>

                    </div>

                `).join('')}

            </div>

        `;


        guideContainer.appendChild(sectionElement);

    });


    emptyState?.classList.toggle(
        'd-none',
        totalMatches > 0
    );

}


searchInput?.addEventListener('input', event => {

    renderGuide(event.target.value);

});


renderGuide();