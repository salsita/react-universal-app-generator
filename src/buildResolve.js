import path from 'path';

export default root =>
  relativePath => path.resolve(root, relativePath);
