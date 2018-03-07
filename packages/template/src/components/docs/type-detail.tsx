import {ObjectTypeBound, TypeDeclaration} from 'documittu-analyzer-ts'
import * as React from 'react'
import {ApiDocs} from '../../lib/entities'
import {DocBlock, Documentation, ImportAs, Markdown, Property} from '../ui/docs'
import {Keyword} from '../ui/syntax'
import {Type, TypeParameters, joined} from '../ui/types'

export const TypeDetail = ({
  type,
  apiDocs,
}: {
  type: TypeDeclaration
  apiDocs: ApiDocs
}) => {
  const type_ = type.type
  return (
    <Documentation>
      <h3>
        {type.name}
        {type.parameters && (
          <TypeParameters parameters={type.parameters} apiDocs={apiDocs} />
        )}
      </h3>
      <DocBlock>
        <ImportAs declaration={type} apiDocs={apiDocs} />
        {type.extends &&
          type.extends.length > 0 && (
            <div>
              <Keyword>extends</Keyword>{' '}
              {type.extends.map(
                joined(', ', (type, i) => (
                  <Type key={i} type={type} apiDocs={apiDocs} />
                )),
              )}
            </div>
          )}
        <Markdown source={type.documentation} />
      </DocBlock>
      {type_.kind === 'Object' ? (
        <div>
          <h4>Properties</h4>
          {(type_ as ObjectTypeBound).properties.map(prop => (
            <Property
              key={prop.name}
              prop={prop}
              showOptional
              apiDocs={apiDocs}
            />
          ))}
        </div>
      ) : (
        <div>
          <h4>Type</h4>
          {<Type type={type_} apiDocs={apiDocs} />}
        </div>
      )}
    </Documentation>
  )
}
