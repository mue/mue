module.exports = {
  presets: ['@babel/preset-env', ['@babel/preset-react', {
    runtime: 'automatic'
  }]],
  plugins: ['@babel/transform-runtime', '@babel/plugin-transform-react-inline-elements', '@babel/plugin-transform-react-constant-elements']
};
