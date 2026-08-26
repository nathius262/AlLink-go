ClassicEditor
    .create(document.querySelector('.ckeditor'), {

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
            'redo',
            '|',
            'code',
            'codeBlock'
        ]

    })
    .catch(error => console.error(error));
