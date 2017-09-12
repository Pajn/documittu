import {Module} from 'documittu-analyzer-ts'
import {basename, dirname, join, normalize} from 'path'
import {
  ApiDocs,
  Attributes,
  ModulePageConfig,
  Page,
  RawPages,
  TopLevel,
} from './entities'
import {defaultTitle, moduleUrl, rootUrl} from './urls'

function slug(a: string) {
  return a.replace(/[^a-zA-Z0-9-]/g, '-').replace(/--/g, '-')
}

export function createUrl(attributes: Attributes, path: string) {
  if (attributes.path) return attributes.path

  if (/^\.\/index\.((md)|([tj]sx?))$/.test(path)) return '/'

  path = dirname(path.replace(/^\.\//, '/'))
    .split('/')
    .map(d => slug(d))
    .join('/')
  path += `/${slug(attributes.title)}`
  path = normalize(path).toLowerCase()

  return path
}

export function buildRoutes(pages: RawPages, apiDocs: ApiDocs) {
  let routes: Array<TopLevel>

  if (pages) {
    routes = buildPageRoutes(pages)
    if (apiDocs) {
      routes = routes.concat(buildApiDocsRoutes(apiDocs))
    }
  } else if (apiDocs) {
    routes = [
      buildApiDocsRoutes(apiDocs),
      {kind: 'redirect', url: '/', to: rootUrl(apiDocs), title: undefined},
    ]
  } else {
    throw 'Neither pages nor apiDocs was provided'
  }

  return routes
}

function buildPageRoutes(pages: RawPages) {
  const routes = [] as Array<TopLevel>
  const subRoutes = {} as {[folder: string]: Array<Page>}
  const subRoutesWithoutIndex = {} as {[folder: string]: true}
  let hasIndex = false

  Object.entries(pages).forEach(([path, {attributes, default: component}]) => {
    if (!attributes || !component) return
    let url = createUrl(attributes, path)
    const urlParts = url.split('/')
    if (urlParts.length === 2) {
      if (url === '/') {
        hasIndex = true
      }
      routes.push({
        kind: 'page',
        url,
        title: attributes.title,
        attributes,
        component,
      })
    } else if (urlParts.length === 3) {
      const [, folder] = path.split('/')
      if (!subRoutes[folder]) {
        subRoutes[folder] = []
        subRoutesWithoutIndex[folder] = true
      }
      if (/index\.((md)|([tj]sx?))$/.test(path)) {
        url = `/${slug(folder)}`
        delete subRoutesWithoutIndex[folder]
        routes.push({
          kind: 'folder',
          title: attributes.title,
          url,
          subPages: subRoutes[folder],
        })
      }
      subRoutes[folder].push({
        url,
        title: attributes.title,
        attributes,
        component,
      })
    } else {
      throw Error('Nested directories are not supported')
    }
  })

  Object.keys(subRoutesWithoutIndex).forEach(folder => {
    routes.push({
      kind: 'folder',
      title: folder,
      url: `/${slug(folder)}`,
      subPages: subRoutes[folder],
      redirectTo: subRoutes[folder][0].url,
    })
  })

  if (!hasIndex) {
    routes.push({
      kind: 'redirect',
      url: '/',
      title: undefined,
      to: routes[0].url,
    })
  }

  return routes
}

function buildApiDocsRoutes(apiDocs: ApiDocs): TopLevel {
  const modules = {} as {[dirnmame: string]: Array<ModulePageConfig>}
  const indexModules = {} as {[dirnmame: string]: ModulePageConfig}
  let rootModule: ModulePageConfig | undefined
  const docsRoot = rootUrl(apiDocs)

  Object.values(apiDocs.data.modules).forEach((module: Module) => {
    const url = moduleUrl(module, apiDocs)
    const declarations = Object.keys(module.declarations).filter(
      d => !module.declarations[d].internal,
    )
    if (
      declarations.length === 0 &&
      module.reexports.length === 0 &&
      url !== docsRoot
    )
      return

    const isMain = apiDocs.data.mainModule === module.outPath
    if (isMain) {
      module.name = apiDocs.data.name
    }

    const modulePage: ModulePageConfig = {
      title: isMain ? apiDocs.title || defaultTitle : module.name,
      url,
      module,
      apiDocs,
      modules: [],

      components: [],
      types: [],
      classes: [],
      functions: [],
      variables: [],
    }

    declarations.forEach(id => {
      const declaration = module.declarations[id]

      switch (declaration.kind) {
        case 'Component':
          modulePage.components.push(declaration)
          break
        case 'Type':
          modulePage.types.push(declaration)
          break
        case 'Class':
          modulePage.classes.push(declaration)
          break
        case 'Function':
          modulePage.functions.push(declaration)
          break
        case 'Variable':
          modulePage.variables.push(declaration)
          break
      }
    })

    module.reexports.forEach(e => {
      const originalModule = apiDocs.data.modules[e.path]
      if (!originalModule) return
      let declaration = originalModule.declarations[e.id]
      if (!declaration) return
      declaration = {...declaration, reexport: e, name: e.name}

      switch (declaration.kind) {
        case 'Component':
          modulePage.components.push(declaration)
          break
        case 'Type':
          modulePage.types.push(declaration)
          break
        case 'Class':
          modulePage.classes.push(declaration)
          break
        case 'Function':
          modulePage.functions.push(declaration)
          break
        case 'Variable':
          modulePage.variables.push(declaration)
          break
      }
    })

    if (url === docsRoot) {
      rootModule = modulePage
    } else {
      const dir = dirname(module.outPath)
      if (modules[dir]) {
        modules[dir].push(modulePage)
      } else {
        modules[dir] = [modulePage]
      }
    }
  })

  let dirs = Object.keys(modules)
  if (dirs.length > 0) {
    const path = dirs[0].split('/')
    for (const dir of path) {
      if (dirs.every(d => d.startsWith(`${dir}/`) || d === dir)) {
        dirs = dirs.map(d => {
          const updatedPath = d.slice(dir.length + 1)
          modules[updatedPath] = modules[d]
          delete modules[d]

          return updatedPath
        })
      } else break
    }
    for (const dir of dirs) {
      let url = ''
      let outPath = ''
      for (const module of modules[dir]) {
        if (module.module.outPath.endsWith('/index.js')) {
          indexModules[dir] = module
          break
        } else {
          url = module.url
          outPath = module.module.outPath
        }
      }
      if (indexModules[dir]) {
        indexModules[dir].modules = indexModules[dir].modules.concat(
          modules[dir].filter(m => m.url !== indexModules[dir].url),
        )

        indexModules[dir].title = basename(dir)
        indexModules[dir].url = dirname(url)
        indexModules[dir].module.name = basename(dir)
      } else {
        indexModules[dir] = {
          title: basename(dir),
          url: dirname(url),
          module: {
            name: basename(dir),
            srcPath: '',
            outPath: join(dirname(outPath), 'index.js'),
            declarations: {},
            reexports: [],
          },
          apiDocs,
          modules: modules[dir],
          components: [],
          types: [],
          classes: [],
          functions: [],
          variables: [],
        }
      }
    }
  }

  // Sort the keys with longest first first so we visit the most nested path first
  let indexModulePaths = Object.keys(indexModules).sort(
    (a, b) => b.length - a.length,
  )
  for (const path of indexModulePaths) {
    // Find the parents and sort them with longest first so that parents[0] is the direct parent
    const parents = indexModulePaths
      .filter(d => path.startsWith(`${d}/`))
      .sort((a, b) => b.length - a.length)

    if (parents.length === 0 && path !== '' && indexModules['']) {
      parents.push('')
    }

    if (parents.length > 0) {
      // Push this module into the parents modules and remove it from what will be the root modules
      indexModules[parents[0]].modules.push(indexModules[path])
      delete indexModules[path]
    }
  }

  const rootModules = indexModules['']
    ? indexModules[''].modules
    : Object.values(indexModules)

  if (rootModule) {
    rootModule.modules = rootModules
    return {kind: 'module' as 'module', ...rootModule}
  } else {
    return {
      kind: 'module',
      title: apiDocs.title || defaultTitle,
      url: docsRoot,
      module: {
        name: apiDocs.data.name,
        srcPath: '',
        outPath: '',
        declarations: {},
        reexports: [],
      },
      apiDocs,
      modules: rootModules,

      components: [],
      types: [],
      classes: [],
      functions: [],
      variables: [],
    }
  }
}
