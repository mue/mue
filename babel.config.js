module.exports = {
  presets: ['@babel/preset-env', ['@babel/preset-react', {
    'runtime': 'automatic'
  }]],
  plugins: ['@babel/plugin-proposal-class-properties', '@babel/transform-runtime', 'babel-plugin-transform-react-class-to-function', '@babel/plugin-transform-react-constant-elements']
};
