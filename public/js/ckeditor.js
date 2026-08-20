ClassicEditor
    .create(document.querySelector('#description'), {

        toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'underline',
            'link',
            '|',
            'bulletedList',
            'numberedList',
            '|',
            'outdent',
            'indent',
            '|',
            'insertTable',
            'blockQuote',
            '|',
            'undo',
            'redo'
        ]

    })
    .catch(error => console.error(error));
