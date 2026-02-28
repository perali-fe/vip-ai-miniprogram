function readPackage(pkg) {
  if (pkg.name === 'vip-ai') {
    for (const key of Object.keys(pkg.dependencies || {})) {
      if (key.startsWith('@tencent/')) {
        delete pkg.dependencies[key];
      }
    }
    for (const key of Object.keys(pkg.devDependencies || {})) {
      if (key.startsWith('@tencent/')) {
        delete pkg.devDependencies[key];
      }
    }
  }
  return pkg;
}

module.exports = {
  hooks: {
    readPackage,
  },
};
