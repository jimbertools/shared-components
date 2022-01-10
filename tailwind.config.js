module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            gridTemplateColumns: {
                topBarSm: 'minmax(0,85vw) minmax(0,1fr)',
                topBarLg: 'minmax(0,30vw) minmax(0,1fr)',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
