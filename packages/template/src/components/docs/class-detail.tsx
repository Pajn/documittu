import {ClassDeclaration} from 'documittu-analyzer-ts'
import React from 'react'
import {ApiDocs} from '../../lib/entities'
import {
  Constructor,
  DocBlock,
  ImportAs,
  Markdown,
  Method,
  Property,
} from '../ui/docs'
import {Keyword} from '../ui/syntax'
import {Type, TypeParameters, joined} from '../ui/types'

function hideUnwanted<T extends {private?: boolean; internal?: boolean}>(
  members: Array<T>,
) {
  return members.filter(m => !(m.internal || m.private))
}

export const ClassDetail = ({
  type,
  apiDocs,
}: {
  type: ClassDeclaration
  apiDocs: ApiDocs
}) => {
  return (
    <div>
      <h3>
        {type.name}
        {type.typeParameters && (
          <TypeParameters parameters={type.typeParameters} apiDocs={apiDocs} />
        )}
      </h3>
      <DocBlock>
        <ImportAs declaration={type} apiDocs={apiDocs} />
        {type.extends.length > 0 && (
          <div>
            <Keyword>extends</Keyword>{' '}
            {type.extends.map(
              joined(', ', (type, i) => (
                <Type key={i} type={type} apiDocs={apiDocs} />
              )),
            )}
          </div>
        )}
        {type.implements.length > 0 && (
          <div>
            <Keyword>implements</Keyword>{' '}
            {type.implements.map(
              joined(', ', (type, i) => (
                <Type key={i} type={type} apiDocs={apiDocs} />
              )),
            )}
          </div>
        )}
        <Markdown source={type.documentation} />
      </DocBlock>
      {hideUnwanted(type.properties).length > 0 && (
        <>
          <h4>Properties</h4>
          {hideUnwanted(type.properties).map(prop => (
            <Property key={prop.name} prop={prop} apiDocs={apiDocs} />
          ))}
        </>
      )}
      {hideUnwanted(type.constructors).length > 0 && (
        <>
          <h4>Constructors</h4>
          {hideUnwanted(type.constructors).map((signature, i) => (
            <Constructor key={i} signature={signature} apiDocs={apiDocs} />
          ))}
        </>
      )}
      {hideUnwanted(type.methods).length > 0 && (
        <>
          <h4>Methods</h4>
          {hideUnwanted(type.methods).map(method => (
            <Method key={method.name} method={method} apiDocs={apiDocs} />
          ))}
        </>
      )}
    </div>
  )
}
