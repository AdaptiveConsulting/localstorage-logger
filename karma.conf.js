module.exports = function(config) {
  config.set({
    browsers: ['Chrome'],
    frameworks: ['mocha', 'chai', 'commonjs'],
    files: [
      'lib/**/*.js',
      'test/**/*.js'
    ],
    preprocessors: {
      'lib/**/*.js': ['commonjs'],
      'test/**/*.js': ['commonjs']
    }
  });
};
