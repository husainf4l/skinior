export const quillModules = {
    toolbar: [
        // Formatting options
        [{ font: [] }], // Font family
        [{ size: ['small', false, 'large', 'huge'] }], // Font size

        // Text styles
        ['bold', 'italic', 'underline', 'strike', 'blockquote'],

        // Headers and Paragraph styles
        [{ header: 1 }, { header: 2 }, { header: 3 }, { header: 4 }],
        [{ align: [] }], // Alignment (left, center, right, justify)
        [{ direction: 'rtl' }, { direction: 'ltr' }], // RTL and LTR support

        // Lists and Indents
        [{ list: 'ordered' }, { list: 'bullet' }],
        [{ indent: '-1' }, { indent: '+1' }], // Indents (outdent/indent)

        // Links, Media, and Embeds
        ['link', 'image', 'video', 'code-block'],

        // Colors and Backgrounds
        [{ color: [] }, { background: [] }], // Text color and background color

        // Clear formatting option
        ['clean'],
    ],
    direction: 'rtl', // Default direction to RTL
};
