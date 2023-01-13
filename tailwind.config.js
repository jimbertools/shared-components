module.exports = {
    purge: [],
    darkMode: false, // or 'media' or 'class'
    theme: {
        extend: {
            gridTemplateColumns: {
                topBarSm: 'minmax(0,85vw) minmax(0,1fr)',
                topBarLg: 'minmax(0,30vw) minmax(0,1fr)',
            },
            screens: {
                s: [
                    {
                        min: '768px',
                        max: '1330px',
                    },
                ],
                m: '1331px',
            },
            colors: {
                dark: {
                    50: '#ffffff',
                    100: '#e6e6e6',
                    200: '#333334',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#22272D',
                    700: '#1D2028',
                    800: '#0E1117',
                    900: '#01040A',
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
