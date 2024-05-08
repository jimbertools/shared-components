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
                    "50": "#38414A",
                    "100": "#2C333A",
                    "200": "#282E33",
                    "300": "#22272B",
                    "400": "#1D2125",
                    "500": "#161a1d",
                    "600": "#101214",
                    "700": "#0d1011",
                    "800": "#090a0c",
                    "900": "#040506",
                    "950": "#050406"
                },
            },
        },
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
