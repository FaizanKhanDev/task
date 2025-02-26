
import * as tsConfigPaths from 'tsconfig-paths';
import * as tsConfig from '../tsconfig.json';

const baseUrl = './src';
tsConfigPaths.register({
  baseUrl,
  paths: tsConfig.compilerOptions.paths,

});
