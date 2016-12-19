import fs from 'fs-extra';
import path from 'path';
import spawn from 'cross-spawn';

const isSafeToCreateProjectIn = (root) => {
  const validFiles = [
    '.DS_Store', 'Thumbs.db', '.git', '.gitignore', '.idea', 'README.md', 'LICENSE'
  ];

  return fs.readdirSync(root)
    .every(file => validFiles.indexOf(file) >= 0);
}

export default (appName) => {
  const packageJson = {
    name: appName,
    version: '0.1.0',
    scripts: {
      start: 'react-universal-app-generator dev'
    },
    dependencies: {},
    devDependencies: {}
  };

  const appPath = path.resolve(appName);
  fs.ensureDirSync(appPath);

  if (!isSafeToCreateProjectIn(appPath)) {
    console.log(`The directory ${appPath} contains files that could conflict.`);
    console.log('Try using a new directory name.');
    process.exit(1);
  }

  fs.writeFileSync(
    path.join(appPath, 'package.json'),
    JSON.stringify(packageJson, null, 2)
  );

  fs.copySync(
    path.resolve(
      __dirname,
      '../template'
    ),
    appPath
  );

  fs.renameSync(
    path.resolve(
      appPath,
      'gitignore'
    ),
    path.resolve(
      appPath,
      '.gitignore'
    )
  );

  spawn.sync('npm', ['install', 'react-universal-app-generator', '--save-dev'], {
    stdio: 'inherit',
    cwd: appPath
  });

  const proc = spawn('npm', [
    'install',
    'react',
    'react-dom',
    'express',
    '--save'
  ], {
    stdio: 'inherit',
    cwd: appPath
  });

  proc.on('close', code => {
    if (code !== 0) {
      console.error('Failed to install dependencies');
      return;
    }

    console.log();
    console.log('Success! Created ' + appName + ' at ' + appPath);
    console.log('Inside that directory, you can run several commands:');
    console.log();
    console.log('npm start');
    console.log('    Starts the development server.');
    console.log();
    console.log('We suggest that you begin by typing:');
    console.log();
    console.log(`  cd  ${appName}`);
    console.log('  ' + 'npm start');
    console.log();
    console.log('Happy hacking!');

  });
};
