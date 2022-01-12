module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            gridTemplateColumns: {
                'topBarSm': 'minmax(0,85vw) minmax(0,1fr)',
                'topBarLg': 'minmax(0,30vw) minmax(0,1fr)',
            },
            screens: {
                s: [{ min: '768px', max: '1330px' }],
                m: '1331px',
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
