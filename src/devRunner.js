import spawn from 'cross-spawn';
import webpack from 'webpack';

import buildServerWebpackConfig from './buildServerWebpackConfig';

export default serverRelativePath => {
  let serverProcess = null;

  const webpackConfig = buildServerWebpackConfig(
    process.cwd(),
    serverRelativePath
  );

  const compiler = webpack(webpackConfig);
  compiler.watch({}, function(err, stats) {
    if (err) {
      console.error('There was an error while compiling');
      process.exit(1);
    }

    const jsonStats = stats.toJson();
    console.log(jsonStats.errors);
    console.log(jsonStats.warnings);
    console.log('compiled');

    if (!serverProcess) {
      serverProcess = spawn.spawn(
        'node',
        ['dist/server.js'],
        { stdio: 'inherit' }
      );
    }
  });
}