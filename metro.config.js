const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');
const fs = require('fs');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

// Only add monorepo watchFolders if running in local monorepo environment
if (fs.existsSync(monorepoRoot) && fs.existsSync(path.resolve(monorepoRoot, 'pnpm-workspace.yaml'))) {
  config.watchFolders = [monorepoRoot];
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
    path.resolve(monorepoRoot, 'node_modules'),
  ];
} else {
  config.resolver.nodeModulesPaths = [
    path.resolve(projectRoot, 'node_modules'),
  ];
}

module.exports = config;
