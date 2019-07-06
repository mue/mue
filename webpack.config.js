module.exports = {
    mode: 'production',
    entry: ['./src/assets/js/index.js'],
    output: {
      filename: 'base.js',
      path: `${__dirname}/src/assets/js`
    }
};