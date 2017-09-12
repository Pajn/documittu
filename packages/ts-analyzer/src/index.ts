import * as fs from 'fs'
import * as glob from 'glob'
import {basename, dirname, join, normalize, relative} from 'path'
import * as ts from 'typescript'

console.error('ts.version', ts.version)

export type Package = {
  name: string
  outDir: string
  mainModule?: string
  typeDeclaration: {[typeId: string]: /** declarationId */ string}
  declarationModule: {[declarationId: string]: /** outPath */ string}
  modules: {[path: string]: Module}
  readmes: {[path: string]: string}
}

export type Reexport = {
  name: string
  srcName: string
  path: string
  id: string
}

export type Module = {
  name: string
  srcPath: string
  outPath: string
  declarations: {[declarationId: string]: Declaration}
  reexports: Array<Reexport>
}

export type DocEntry = {
  name?: string
  documentation?: string
  type?: TypeBound
  internal?: boolean
}

export type FunctionDocEntry = DocEntry & {
  name: string
  signatures: Array<FunctionSignature>
}

export type FunctionSignature = {
  typeParameters?: Array<TypeBound>
  parameters: Array<TypeProperty>
  returnType: TypeBound
}

export type BaseDeclaration = DocEntry & {
  id: string
  name: string
  exportedIn: Array<{path: string; name: string}>
  reexport?: Reexport
}

export type TypeDeclaration = BaseDeclaration & {
  type: TypeBound
  parameters?: Array<TypeBound>
  // properties: Array<TypeProperty>
}

export type TypeProperty = DocEntry & {
  optional: boolean
  defaultValue?: string
}

export type ComponentDeclaration = BaseDeclaration & {
  properties: Array<TypeProperty>
}

export type ClassDeclaration = BaseDeclaration & {
  properties: Array<DocEntry>
  constructors: Array<{parameters: Array<TypeProperty>} & DocEntry>
  methods: Array<FunctionDocEntry>
}

export type FunctionDeclaration = BaseDeclaration & FunctionDocEntry

export type VariableDeclaration = BaseDeclaration & {
  type: TypeBound
  value: string
}

export type UntaggedDeclaration =
  | ComponentDeclaration
  | TypeDeclaration
  | ClassDeclaration
  | FunctionDeclaration
  | VariableDeclaration

export type Declaration =
  | ({kind: 'Component'} & ComponentDeclaration)
  | ({kind: 'Type'} & TypeDeclaration)
  | ({kind: 'Class'} & ClassDeclaration)
  | ({kind: 'Function'} & FunctionDeclaration)
  | ({kind: 'Variable'} & VariableDeclaration)

export type ObjectTypeBound = {
  properties: Array<TypeProperty>
  index?: {name: string; type: TypeBound}
}

export type TypeBound =
  | {
      kind: 'Named'
      name: string
      parameters?: Array<TypeBound>
      id?: string
      importedFrom?: string
    }
  | ({kind: 'Object'} & ObjectTypeBound)
  | {kind: 'Tuple'; properties: Array<TypeBound>}
  | {
      kind: 'Function'
      typeParameters?: Array<TypeBound>
      parameters: Array<TypeProperty>
      returnType: TypeBound
    }
  | {kind: 'Intersection'; types: Array<TypeBound>}
  | {kind: 'Union'; types: Array<TypeBound>}
  | {kind: 'BooleanLiteral'; value: string}
  | {kind: 'NumberLiteral'; value: string}
  | {kind: 'StringLiteral'; value: string}

export function analyze(
  fileNames: Array<string>,
  analyzeResult: Package,
  packagePath: string,
  options: ts.CompilerOptions = {
    jsx: ts.JsxEmit.Preserve,
    target: ts.ScriptTarget.ES2017,
    module: ts.ModuleKind.CommonJS,
  },
) {
  let compilerHost = ts.createCompilerHost(options)
  console.error('options', options)
  console.error('fileNames', fileNames)
  let program = ts.createProgram(fileNames, options, compilerHost)
  let checker = program.getTypeChecker()
  let nextDeclarationId = 0
  const declarationId = () => (nextDeclarationId++).toString()
  let starExports = [] as Array<{module: string; from: string}>

  function outputPath(srcPath: string) {
    const relativeSrcPath = relative(join(packagePath, 'src'), srcPath)
    const outPath = join(analyzeResult.outDir, relativeSrcPath).replace(
      /\.[jt]sx?$/,
      '.js',
    )
    return outPath
  }

  for (const sourceFile of program.getSourceFiles()) {
    if (!fileNames.includes(sourceFile.fileName)) {
      continue
    }
    const srcPath = relative(packagePath, sourceFile.fileName)
    const outPath = outputPath(sourceFile.fileName)
    console.error('sourceFile.fileName', sourceFile.fileName)
    console.error('srcPath', srcPath)
    console.error('outPath', outPath)
    analyzeResult.modules[outPath] = {
      name: basename(outPath, '.js'),
      srcPath,
      outPath,
      declarations: {},
      reexports: [],
    }

    ts.forEachChild(sourceFile, visit)
  }

  starExports.forEach(e => {
    const to = analyzeResult.modules[e.module]
    const from = analyzeResult.modules[e.from]
    if (to && from) {
      Object.values(from.declarations).forEach(d => {
        to.reexports.push({
          name: d.name,
          srcName: d.name,
          path: e.from,
          /// Assign all ids in the next step
          id: '',
        })
      })
    }
  })

  Object.values(analyzeResult.modules).forEach(module => {
    module.reexports.forEach(e => {
      const otherModule = analyzeResult.modules[e.path]
      if (!otherModule) return
      const d = Object.values(otherModule.declarations).find(
        d => d.name === e.srcName,
      )
      if (!d) return

      d.exportedIn.push({path: module.outPath, name: e.name})
      e.id = d.id
    })
  })

  return analyzeResult

  function visit(node: ts.Node) {
    // Only consider exported nodes
    if (!isNodeExported(node)) {
      return
    }

    const outPath = outputPath(node.getSourceFile().fileName)
    const module = analyzeResult.modules[outPath]

    function addDeclaration(
      id: string,
      kind: Declaration['kind'],
      declaration: Partial<UntaggedDeclaration>,
    ) {
      analyzeResult.declarationModule[id] = outPath
      module.declarations[id] = {
        id,
        kind,
        exportedIn: [],
        ...declaration,
      } as Declaration
    }

    function addTypeDeclaration(
      type: ts.Type,
      kind: Declaration['kind'],
      declaration: Partial<UntaggedDeclaration>,
    ) {
      const id = declarationId()
      analyzeResult.typeDeclaration[type['id']] = id
      addDeclaration(id, kind, declaration)
    }

    if (node.kind === ts.SyntaxKind.TypeAliasDeclaration) {
      const symbol = checker.getSymbolAtLocation(
        (node as ts.TypeAliasDeclaration).name,
      )!
      const type = checker.getDeclaredTypeOfSymbol(symbol)

      addTypeDeclaration(type, 'Type', serializeTypeDeclaration(symbol))
    } else if (node.kind === ts.SyntaxKind.InterfaceDeclaration) {
      const symbol = checker.getSymbolAtLocation(
        (node as ts.InterfaceDeclaration).name,
      )!
      const type = checker.getTypeOfSymbolAtLocation(symbol, node)

      addTypeDeclaration(type, 'Type', serializeTypeDeclaration(symbol))
    } else if (node.kind === ts.SyntaxKind.ClassDeclaration) {
      const name = (node as ts.ClassDeclaration).name
      if (!name) return
      const symbol = checker.getSymbolAtLocation(name)!
      if (!symbol.valueDeclaration) return
      const type = checker.getTypeOfSymbolAtLocation(
        symbol,
        symbol.valueDeclaration,
      )
      const properties = getPropsType(type)

      if (properties) {
        addTypeDeclaration(type, 'Component', {
          name: name.text,
          properties,
          ...getDocs(symbol),
        })
      } else {
        // It's not a component
        addTypeDeclaration(type, 'Class', {
          name: name.text,
          ...serializeClass(type),
          ...getDocs(symbol),
        })
      }
    } else if (node.kind === ts.SyntaxKind.FunctionDeclaration) {
      const fn = node as ts.FunctionDeclaration
      if (!fn.name) return

      const symbol = checker.getSymbolAtLocation(fn.name)!
      if (!symbol.valueDeclaration) return
      const type = checker.getTypeOfSymbolAtLocation(
        symbol,
        symbol.valueDeclaration,
      )

      addDeclaration(declarationId(), 'Function', {
        name: fn.name.text,
        ...serializeFunction(type),
        ...getDocs(symbol),
      })
    } else if (node.kind === ts.SyntaxKind.VariableStatement) {
      ;(node as ts.VariableStatement).declarationList.declarations.forEach(
        d => {
          if (d.name.kind !== ts.SyntaxKind.Identifier) return
          const symbol = checker.getSymbolAtLocation(d.name)!
          if (!symbol.valueDeclaration) return
          const type = checker.getTypeOfSymbolAtLocation(
            symbol,
            symbol.valueDeclaration,
          )
          const properties = getPropsType(type)

          if (properties) {
            addDeclaration(declarationId(), 'Component', {
              name: d.name.text,
              properties,
              ...getDocs(symbol),
            })
          } else {
            // It's not a component
            if (isFunctionType(type)) {
              addDeclaration(declarationId(), 'Function', {
                name: d.name.text,
                ...serializeFunction(type),
                ...getDocs(symbol),
              })
            } else if (
              symbol.valueDeclaration &&
              symbol.valueDeclaration['initializer']
            ) {
              const declaration = symbol.valueDeclaration as ts.VariableDeclaration
              addDeclaration(declarationId(), 'Variable', {
                name: d.name.text,
                type: serializeTypeBound(type),
                value: declaration.initializer!.getText(),
                ...getDocs(symbol),
              })
            }
          }
        },
      )
    } else if (node.kind === ts.SyntaxKind.ExportDeclaration) {
      const e = node as ts.ExportDeclaration
      if (e.moduleSpecifier) {
        const path = e.moduleSpecifier.getText().slice(1, -1)
        const {resolvedModule} = ts.resolveModuleName(
          path,
          node.getSourceFile().fileName,
          options,
          compilerHost,
        )
        if (resolvedModule) {
          if (!resolvedModule.isExternalLibraryImport) {
            const outPath = outputPath(resolvedModule.resolvedFileName)
            if (e.exportClause) {
              e.exportClause.elements.forEach(e => {
                module.reexports.push({
                  name: e.name.getText(),
                  srcName: e.propertyName
                    ? e.propertyName.getText()
                    : e.name.getText(),
                  path: outPath,
                  // The id is assigned just before returning the analyze result
                  // so that we are sure that we have visited the declaration
                  id: '',
                })
              })
            } else {
              starExports.push({module: module.outPath, from: outPath})
            }
          }
        }
      }
    }
  }

  function getDocs(
    symbol: ts.Symbol,
  ): {documentation: string; internal: boolean} {
    const tags = symbol.getJsDocTags()
    return {
      documentation: ts.displayPartsToString(
        symbol.getDocumentationComment(checker),
      ),
      internal: tags.some(tag => tag.name === 'internal'),
    }
  }

  function serializeClass(type: ts.Type) {
    const constructSignature = type.getConstructSignatures()[0]
    if (!constructSignature) return
    const instanceType = constructSignature.getReturnType()

    const properties = [] as Array<DocEntry>
    const methods = [] as Array<FunctionDocEntry>

    instanceType.getProperties().forEach(p => {
      const type = checker.getTypeOfSymbolAtLocation(p, p.valueDeclaration!)
      if (isFunctionType(type)) {
        methods.push({
          name: p.getName(),
          ...serializeFunction(type),
          ...getDocs(p),
        })
      } else {
        properties.push(serializeSymbol(p))
      }
    })

    return {
      constructors: [],
      properties,
      methods,
    }
  }

  function serializeFunction(type: ts.Type) {
    const callSignatures = type.getCallSignatures()

    return {
      signatures: callSignatures.map(callSignature => {
        const typeParameters = callSignature.getTypeParameters()

        return {
          typeParameters:
            typeParameters && typeParameters.map(p => serializeTypeBound(p)),
          parameters: callSignature.getParameters().map(serializeTypeProperty),
          returnType: serializeTypeBound(callSignature.getReturnType()),
        }
      }),
    }
  }

  function serializeType(type: ts.Type): Array<TypeProperty> {
    // console.error('serializeType', type['id'])
    if (type['types']) {
      return serializeInsersectionType(type as ts.UnionOrIntersectionType)
    }
    if (
      type.aliasSymbol &&
      type.aliasTypeArguments &&
      type.aliasSymbol.getName() === 'Readonly'
    ) {
      const aliasSymbol = type.aliasTypeArguments[0].aliasSymbol
      if (aliasSymbol) {
        return serializeType(checker.getDeclaredTypeOfSymbol(aliasSymbol))
      } else {
        return serializeType(type.aliasTypeArguments[0])
      }
    }

    return type.getProperties().map(serializeTypeProperty)
  }

  function serializeInsersectionType(type: ts.UnionOrIntersectionType) {
    return type.types.reduce((a, t) => [...a, ...serializeType(t)], [] as Array<
      TypeProperty
    >)
  }

  function serializeSymbol(
    symbol: ts.Symbol,
    atLocation = symbol.valueDeclaration,
    {prefferNamed = true} = {},
  ): DocEntry {
    return {
      name: symbol.getName(),
      type: serializeTypeBound(
        atLocation
          ? checker.getTypeOfSymbolAtLocation(symbol, atLocation)
          : checker.getDeclaredTypeOfSymbol(symbol),
        {prefferNamed},
      ),
      ...getDocs(symbol),
    }
  }

  function serializeTypeProperty(symbol: ts.Symbol) {
    const property = serializeSymbol(symbol) as TypeProperty
    property.optional = !!(symbol.flags & ts.SymbolFlags.Optional)
    return property
  }

  function serializeNamedTypeBound(type: ts.Type): TypeBound {
    const typeArguments =
      type.aliasTypeArguments || (type as ts.TypeReference).typeArguments
    const aliasType =
      (type.aliasSymbol && checker.getDeclaredTypeOfSymbol(type.aliasSymbol)) ||
      type
    const symbol = (type.getSymbol() || type.aliasSymbol)!
    let importedFrom
    if (symbol) {
      let declaration = symbol.getDeclarations()![0]
      if (declaration) {
        const fileName = declaration.getSourceFile().fileName
        if (/\/node_modules\//.test(fileName)) {
          let match
          if (
            (match = /\/node_modules\/typescript\/lib\/lib\.([a-z0-9]+)\./.exec(
              fileName,
            ))
          ) {
            importedFrom = `lib ${match[1]}`
          } else if (
            (match = /\/node_modules\/(?:@types\/)([a-z0-9-]+)\//.exec(
              fileName,
            ))
          ) {
            importedFrom = `${match[1]}`
          }
        }
      }
    }

    return {
      kind: 'Named',
      name: checker
        .typeToString(
          type,
          type.getSymbol() && type.getSymbol()!.valueDeclaration,
          ts.TypeFormatFlags.WriteArrayAsGenericType,
        )
        .split('<')[0],
      parameters:
        typeArguments && typeArguments.map(p => serializeTypeBound(p)),
      id: aliasType['id'],
      importedFrom,
    }
  }

  function serializeTypeBound(
    type: ts.Type,
    {prefferNamed = true} = {},
  ): TypeBound {
    if (prefferNamed && type.aliasSymbol) {
      return serializeNamedTypeBound(type)
    }
    if (type.flags & ts.TypeFlags.Object) {
      let type_ = type as ts.ObjectType
      if (type_.objectFlags & ts.ObjectFlags.ObjectLiteral) {
        console.error('object', type)
        console.error('object', checker.typeToString(type))
        // return {
        //   kind: 'Object',
        //   properties: (type as ts.Object).types.map(serializeTypeBound),
        // }
      } else if (type_.objectFlags & ts.ObjectFlags.Anonymous) {
        const callSignatures = checker.getSignaturesOfType(
          type,
          ts.SignatureKind.Call,
        )

        if (callSignatures && callSignatures[0]) {
          const signature = callSignatures[0] as ts.Signature

          return {
            kind: 'Function',
            typeParameters:
              signature.typeParameters &&
              signature.typeParameters.map(p => serializeTypeBound(p)),
            parameters: signature.parameters.map(serializeTypeProperty),
            returnType: serializeTypeBound(signature.getReturnType()),
          }
        } else {
          const index = type.getStringIndexType()
          const indexName =
            type['stringIndexInfo'] &&
            type['stringIndexInfo'].declaration &&
            Object.keys(
              type['stringIndexInfo'].declaration.symbol.declarations[0].locals,
            )[0]
          return {
            kind: 'Object',
            properties: type.getProperties().map(serializeTypeProperty),
            index: index && {name: indexName, type: serializeTypeBound(index)},
          }
        }
      } else if (type_.objectFlags & ts.ObjectFlags.Interface) {
        // Serialized as named
      } else if (type_.objectFlags & ts.ObjectFlags.Reference) {
        // Serialized as named
      } else if (type_.objectFlags & ts.ObjectFlags.Mapped) {
        // Serialized as named
      } else {
        console.error('else', type)
        console.error('else2', checker.typeToString(type))
      }
    }
    if (type.flags & ts.TypeFlags.Intersection) {
      return {
        kind: 'Intersection',
        types: (type as ts.UnionOrIntersectionType).types.map(p =>
          serializeTypeBound(p),
        ),
      }
    }
    if (
      type.flags & ts.TypeFlags.Union &&
      !(type.flags & ts.TypeFlags.Boolean)
    ) {
      // Typescript rewrites `boolean | other` to `true | false | other`
      const types = (type as ts.UnionOrIntersectionType).types.reduce(
        (types, type) => {
          const last = types[types.length - 1]
          if (
            last &&
            last.kind === 'BooleanLiteral' &&
            type.flags & ts.TypeFlags.BooleanLiteral
          ) {
            types[types.length - 1] = {
              kind: 'Named',
              name: 'boolean',
            }
          } else {
            types.push(serializeTypeBound(type))
          }
          return types
        },
        [] as Array<TypeBound>,
      )

      return {
        kind: 'Union',
        types,
      }
    }
    if (type.flags & ts.TypeFlags.BooleanLiteral) {
      return {
        kind: 'BooleanLiteral',
        value: (type as ts.LiteralType)['intrinsicName'],
      }
    }
    if (type.flags & ts.TypeFlags.NumberLiteral) {
      return {
        kind: 'NumberLiteral',
        value: JSON.stringify((type as ts.LiteralType).value),
      }
    }
    if (type.flags & ts.TypeFlags.StringLiteral) {
      return {
        kind: 'StringLiteral',
        value: JSON.stringify((type as ts.LiteralType).value),
      }
    }
    return serializeNamedTypeBound(type)
  }

  function serializeTypeDeclaration(symbol: ts.Symbol) {
    return serializeSymbol(symbol, undefined, {
      prefferNamed: false /* false to avoid printing the type as just the name of that type */,
    })
  }

  /** True if this is visible outside this file, false otherwise */
  function isNodeExported(node: ts.Node): boolean {
    return !!(
      node.flags & ts.NodeFlags.ExportContext ||
      (node.modifiers &&
        node.modifiers.some(m => m.kind === ts.SyntaxKind.ExportKeyword)) ||
      node.kind === ts.SyntaxKind.ExportDeclaration
    )
  }

  function getPropsType(type: ts.Type): Array<TypeProperty> | undefined {
    return (
      getClassComponentPropsType(type) || getFunctionComponentPropsType(type)
    )
  }

  function getClassComponentPropsType(
    type: ts.Type,
  ): Array<TypeProperty> | undefined {
    const constructSignature = type.getConstructSignatures()[0]
    if (!constructSignature) return
    const instanceType = constructSignature.getReturnType()
    const props = checker.getPropertyOfType(instanceType, 'props')
    const render = instanceType.getProperty('render')
    if (!props || !render) return
    if (!props.valueDeclaration) return
    if (!render.valueDeclaration) return
    const renderType = checker.getTypeOfSymbolAtLocation(
      render,
      render.valueDeclaration,
    )
    const callSignature = renderType.getCallSignatures()[0]
    if (!callSignature) return
    if (callSignature.parameters.length !== 0) return

    const propsType = checker.getTypeOfSymbolAtLocation(
      props,
      props.valueDeclaration,
    )

    if (!propsType) return
    return serializeType(propsType)
  }

  function getFunctionComponentPropsType(
    type: ts.Type,
  ): Array<TypeProperty> | undefined {
    const callSignature = type.getCallSignatures()[0]
    if (!callSignature) return
    if (callSignature.parameters.length > 2) return
    if (!isJsxType(callSignature.getReturnType().getSymbol())) return
    const propsParameter = callSignature.parameters[0]
    const propsType =
      propsParameter &&
      (propsParameter.valueDeclaration
        ? checker.getTypeOfSymbolAtLocation(
            propsParameter,
            propsParameter.valueDeclaration,
          )
        : checker.getDeclaredTypeOfSymbol(propsParameter))

    return propsType ? serializeType(propsType) : []
  }

  function isFunctionType(type: ts.Type) {
    return !!type.getCallSignatures()[0]
  }

  function isJsxType(symbol?: ts.Symbol): boolean {
    if (!symbol) return false
    const fqn = checker.getFullyQualifiedName(symbol)
    return fqn === 'global.JSX.Element' || fqn === 'React.ReactElement'
  }
}

export function analyzePackage(packagePath: string): Package {
  const packageJsonPath = join(packagePath, 'package.json')
  const tsconfigJsonPath = join(packagePath, 'tsconfig.json')
  if (!fs.existsSync(packageJsonPath) || !fs.existsSync(tsconfigJsonPath)) {
    throw 'The package folder does not contain package.json and tsconfig.json files'
  }

  const packageJson = require(packageJsonPath)
  const tsconfigJson = require(tsconfigJsonPath)
  const compilerOptions = tsconfigJson.compilerOptions as ts.CompilerOptions

  if (!compilerOptions.outDir) {
    throw 'The tsconfig.json must specify an outDir'
  }

  const mainModule = packageJson.module || packageJson.main
  const analyzeResult: Package = {
    name: packageJson.name,
    mainModule: mainModule && normalize(mainModule),
    outDir: compilerOptions.outDir,
    typeDeclaration: {},
    declarationModule: {},
    modules: {},
    readmes: {},
  }

  const filePaths = glob.sync('src/**/*.{ts,tsx}', {
    cwd: packagePath,
    root: packagePath,
    realpath: true,
  })

  analyze(
    filePaths,
    analyzeResult,
    packagePath,
    ts.convertCompilerOptionsFromJson(compilerOptions, packagePath).options,
  )

  const readmePaths = glob.sync('src/**/README.md', {
    cwd: packagePath,
    root: packagePath,
    realpath: true,
  })

  readmePaths.forEach(readme => {
    const relativePath = relative(join(packagePath, 'src'), readme)
    const outPath = dirname(join(analyzeResult.outDir, relativePath))
    analyzeResult.readmes[outPath] = fs.readFileSync(readme, {
      encoding: 'utf-8',
    })
  })
  const root = join(analyzeResult.outDir)
  if (!analyzeResult.readmes[root]) {
    if (fs.existsSync(join(packagePath, 'README.md'))) {
      analyzeResult.readmes[root] = fs.readFileSync(
        join(packagePath, 'README.md'),
        {encoding: 'utf-8'},
      )
    }
  }

  return analyzeResult
}
