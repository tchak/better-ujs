module.exports = {
  framework: 'qunit',
  before_tests: 'yarn bundle',
  after_tests: 'rm -rf dist/bundle.js',
  src_files: [
    'src/**/*.js',
    'test/**/*.js'
  ],
  serve_files: [
    'dist/bundle.js'
  ],
  disable_watching: true,
  launch_in_ci: ['Chrome'],
  launch_in_dev: ['Chrome'],
  browser_args: {
    Chrome: {
      ci: [
        // --no-sandbox is needed when running Chrome inside a container
        process.env.CI ? '--no-sandbox' : null,
        '--headless',
        '--disable-gpu',
        '--disable-dev-shm-usage',
        '--disable-software-rasterizer',
        '--mute-audio',
        '--remote-debugging-port=0',
        '--window-size=1440,900'
      ].filter(Boolean)
    }
  }
};
