module.exports = {
  plugins: [
    require('tailwindcss')('./tailwind.config.js'),
    require('autoprefixer'),
    //@todo check how to include elementplus theme in build
    // require('element-plus/lib/theme-chalk/index.css')
],
}
