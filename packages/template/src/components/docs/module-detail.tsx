import {
  ClassDeclaration,
  ComponentDeclaration,
  FunctionDeclaration,
  Module,
  TypeDeclaration,
  VariableDeclaration,
} from 'documittu-analyzer-ts'
import glamorous from 'glamorous'
import {indigo} from 'material-definitions'
import {body1} from 'material-definitions'
import {basename, dirname} from 'path'
import * as React from 'react'
import {Link} from 'react-router-dom'
import {row} from 'style-definitions'
import {ModulePageConfig} from '../../lib/entities'
import {
  DocBlock,
  DocListItem,
  Documentation,
  EntryLink,
  Markdown,
} from '../ui/docs'
import {Type, TypeParameters, joined} from '../ui/types'

const CategoryHeader = glamorous.h3({'#app &': {marginTop: 24}})

export const ModuleDetail = ({
  module,
  page,
}: {
  module: Module
  page: ModulePageConfig
}) => (
  <Documentation>
    {basename(module.outPath) === 'index.js' &&
    page.apiDocs.data.readmes[dirname(module.outPath)] ? (
      <Markdown source={page.apiDocs.data.readmes[dirname(module.outPath)]} />
    ) : (
      <h2>{module.name}</h2>
    )}

    {page.modules.length > 0 && (
      <div>
        <CategoryHeader>Modules</CategoryHeader>
        {page.modules.map(module => (
          <ModuleListItem key={module.url} page={module} />
        ))}
      </div>
    )}
    {page.components.length > 0 && (
      <div>
        <CategoryHeader>Components</CategoryHeader>
        {page.components.map(component => (
          <ComponentListItem
            key={component.name}
            component={component}
            page={page}
          />
        ))}
      </div>
    )}
    {page.types.length > 0 && (
      <div>
        <CategoryHeader>Types</CategoryHeader>
        {page.types.map(type => (
          <TypeListItem key={type.name} type={type} page={page} />
        ))}
      </div>
    )}
    {page.classes.length > 0 && (
      <div>
        <CategoryHeader>Classes</CategoryHeader>
        {page.classes.map(type => (
          <ClassListItem key={type.name} type={type} page={page} />
        ))}
      </div>
    )}
    {page.functions.length > 0 && (
      <div>
        <CategoryHeader>Functions</CategoryHeader>
        {page.functions.map(fn => (
          <FunctionListItem key={fn.name} fn={fn} page={page} />
        ))}
      </div>
    )}
    {page.variables.length > 0 && (
      <div>
        <CategoryHeader>Variables</CategoryHeader>
        {page.variables.map(variable => (
          <VariableListItem
            key={variable.name}
            variable={variable}
            page={page}
          />
        ))}
      </div>
    )}
  </Documentation>
)

const ModuleListItem = ({page}: {page: ModulePageConfig}) => {
  return (
    <div>
      <h4>
        <Link to={page.url} style={{color: indigo[500]}}>
          {page.title}
        </Link>
      </h4>
      {/*<LeadDocumentation source={page.documentation} />*/}
    </div>
  )
}

const ComponentListItem = ({
  component,
  page,
}: {
  component: ComponentDeclaration
  page: ModulePageConfig
}) => {
  return (
    <DocListItem item={component} apiDocs={page.apiDocs}>
      <h4>
        {'<'}
        <EntryLink
          declaration={component}
          module={page.module}
          apiDocs={page.apiDocs}
        />
        {'>'}
      </h4>
      <LeadDocumentation source={component.documentation} />
    </DocListItem>
  )
}

const TypeListItem = ({
  type,
  page,
}: {
  type: TypeDeclaration
  page: ModulePageConfig
}) => {
  return (
    <DocListItem item={type} apiDocs={page.apiDocs}>
      <h4>
        <EntryLink
          declaration={type}
          module={page.module}
          apiDocs={page.apiDocs}
        />
      </h4>
      <LeadDocumentation source={type.documentation} />
    </DocListItem>
  )
}

const ClassListItem = ({
  type,
  page,
}: {
  type: ClassDeclaration
  page: ModulePageConfig
}) => {
  return (
    <DocListItem item={type} apiDocs={page.apiDocs}>
      <h4>
        <EntryLink
          declaration={type}
          module={page.module}
          apiDocs={page.apiDocs}
        />
      </h4>
      <LeadDocumentation source={type.documentation} />
    </DocListItem>
  )
}

const FunctionListItem = ({
  fn,
  page,
}: {
  fn: FunctionDeclaration
  page: ModulePageConfig
}) => {
  return (
    <DocListItem item={fn} apiDocs={page.apiDocs}>
      <div style={row({vertical: 'baseline'})}>
        <h4 style={{marginBottom: 0}}>
          <EntryLink
            declaration={fn}
            module={page.module}
            apiDocs={page.apiDocs}
          />
        </h4>
        <InfoLine>
          <span>:&emsp;</span>
          <code>
            {fn.signatures[0].typeParameters && (
              <TypeParameters
                parameters={fn.signatures[0].typeParameters!}
                apiDocs={page.apiDocs}
              />
            )}
            (
            {fn.signatures[0].parameters.map(
              joined(', ', p => (
                <span>
                  {p.name}: <Type type={p.type!} apiDocs={page.apiDocs} />
                </span>
              )),
            )}
            ) =>{' '}
            <Type type={fn.signatures[0].returnType} apiDocs={page.apiDocs} />
          </code>
        </InfoLine>
      </div>
      <LeadDocumentation source={fn.documentation} />
    </DocListItem>
  )
}

const VariableListItem = ({
  variable,
  page,
}: {
  variable: VariableDeclaration
  page: ModulePageConfig
}) => {
  return (
    <DocListItem item={variable} apiDocs={page.apiDocs}>
      <div style={row({vertical: 'baseline'})}>
        <h4>
          <EntryLink
            declaration={variable}
            module={page.module}
            apiDocs={page.apiDocs}
          />
        </h4>
        <InfoLine>
          <span>:&emsp;</span>
          <code>
            <Type type={variable.type} apiDocs={page.apiDocs} />
          </code>
        </InfoLine>
      </div>
      <LeadDocumentation source={variable.documentation} />
    </DocListItem>
  )
}

const LeadDocumentation = ({source}: {source: string | undefined}) =>
  source ? (
    <DocBlock style={{paddingTop: 0, paddingBottom: 0}}>
      <Markdown source={source.split('\n\n')[0]} style={{padding: 0}} />
    </DocBlock>
  ) : (
    <span />
  )

const InfoLine = glamorous.p([
  body1,
  {
    display: 'flex',
    flex: 1,
    marginBottom: 0,

    overflow: 'hidden',
    whiteSpace: 'nowrap',
    textOverflow: 'ellipsis',

    '#app &': {
      maxWidth: 'none',
    },

    '& code': {
      flex: 1,
      overflow: 'hidden',
    },
  },
])
