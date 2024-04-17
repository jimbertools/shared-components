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
                    50: "#7E808A",
                    100: "#d1d0d2",
                    200: "#374151",
                    300: "#312B37",
                    400: "#241F2A",
                    500: "#17151D",
                    600: "#121117",
                    700: "#0e0d11",
                    800: "#09080c",
                    900: "#050406"
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
