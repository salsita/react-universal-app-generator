import spawn from 'cross-spawn';
import webpack from 'webpack';
import formatWebpackMessages from 'react-dev-utils/formatWebpackMessages';

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

    const messages = formatWebpackMessages(stats.toJson({}, true));

    if (messages.errors.length) {
      console.log('Failed to compile');
      console.log();
      messages.errors.forEach(message => {
        console.log(message);
        console.log();
      });
    }

    if (messages.warnings.length) {
      console.log('Compiled with warnings.');
      console.log();
      messages.warnings.forEach(message => {
        console.log(message);
        console.log();
      });
    }

    if (!serverProcess) {
      serverProcess = spawn.spawn(
        'node',
        ['dist/server.js'],
        { stdio: 'inherit' }
      );
    }
  });
}