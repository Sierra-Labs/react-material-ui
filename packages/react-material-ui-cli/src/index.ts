#!/usr/bin/env node

import { spawn } from 'child_process';
import { prompt } from 'inquirer';
import { Project } from 'ts-morph';
import { SourceFile, QuoteKind } from 'ts-morph';
import {
  components,
  formikComponents,
  formikPickerComponents
} from './components';

const installReactMaterialUi = async (packageManager: string) => {
  return new Promise((resolve, reject) => {
    let args: string[] = [];
    switch (packageManager) {
      case 'npm':
        args = ['install', '--save', '@sierralabs/react-material-ui'];
        break;
      case 'yarn':
        args = ['add', '@sierralabs/react-material-ui'];
        break;
    }
    const child = spawn(packageManager, args, { stdio: 'inherit' });
    child.on('close', code => {
      if (code !== 0) {
        reject({ command: `${packageManager} ${args.join(' ')}` });
        return;
      }
      resolve(undefined);
    });
  });
};

interface ImportsMap {
  module: string;
  components: string[];
  imports: string[];
}

/**
 * Iterate through all imports and find react-material-ui components
 * referenced locally and replace them with new references.
 * @param sourceFile
 */
const replaceImports = (sourceFile: SourceFile) => {
  const declarations = sourceFile.getImportDeclarations();
  const importMap: ImportsMap[] = [
    {
      module: '@sierralabs/react-material-ui',
      components: components,
      imports: []
    },
    {
      module: '@sierralabs/react-material-ui-formik',
      components: formikComponents,
      imports: []
    },
    {
      module: '@sierralabs/react-material-ui-formik-pickers',
      components: formikPickerComponents,
      imports: []
    }
  ];
  for (const declaration of declarations) {
    if (
      !declaration.getModuleSpecifier().getText().includes('common') &&
      !declaration.getModuleSpecifier().getText().includes('../lib/api')
    ) {
      // skip if import is not referencing the 'common' folder
      continue;
    }
    const defaultImport = declaration.getDefaultImport()?.getText();
    const namedImports = declaration.getNamedImports();
    for (let map of importMap) {
      if (defaultImport && map.components.includes(defaultImport)) {
        map.imports.push(defaultImport);
        declaration.removeDefaultImport();
      }
      for (const namedImport of namedImports) {
        if (
          !namedImport.wasForgotten() &&
          map.components.includes(namedImport.getName())
        ) {
          map.imports.push(namedImport.getText());
          namedImport.remove();
        }
      }
    }
    if (
      !declaration.getDefaultImport() &&
      declaration.getNamedImports().length === 0
    ) {
      declaration.remove();
    }
  }
  if (importMap.some(map => map.imports.length > 0)) {
    for (let map of importMap) {
      if (map.imports.length > 0) {
        sourceFile.addImportDeclaration({
          namedImports: map.imports,
          moduleSpecifier: map.module
        });
      }
    }
    sourceFile.saveSync();
    console.log('Modified file: ', sourceFile.getFilePath());
  }
};

const main = async () => {
  // const result = await prompt({
  //   name: 'packageManager',
  //   message: 'Which package manager are you using?',
  //   type: 'list',
  //   choices: ['npm', 'yarn']
  // });
  // console.log('packageManager', result.packageManager);

  // install react-material-ui package
  // await installReactMaterialUi(result.packageManager);

  const project = new Project({
    tsConfigFilePath: `./tsconfig.json`,
    manipulationSettings: { quoteKind: QuoteKind.Single }
  });
  const sourceFiles = project.getSourceFiles();
  // console.log('sourceFiles', sourceFiles);
  for (const sourceFile of sourceFiles) {
    console.log('sourceFile', sourceFile.getFilePath());
    replaceImports(sourceFile);
  }
};

main();
