import {FunctionDeclaration} from 'documittu-analyzer-ts'
import * as React from 'react'
import {ApiDocs} from '../../lib/entities'
import {DocBlock, ImportAs, Markdown} from '../ui/docs'
import {Type, TypeParameters, joined} from '../ui/types'

export const FunctionDetail = ({
  fn,
  apiDocs,
}: {
  fn: FunctionDeclaration
  apiDocs: ApiDocs
}) => {
  return (
    <div>
      <h3>{fn.name}</h3>
      <DocBlock>
        <ImportAs declaration={fn} apiDocs={apiDocs} />
        <Markdown source={fn.documentation} />
      </DocBlock>
      <h6>Signature{fn.signatures.length > 1 && 's'}</h6>
      {fn.signatures.map((signature, i) => (
        <div key={i}>
          {signature.typeParameters && (
            <TypeParameters
              parameters={signature.typeParameters}
              apiDocs={apiDocs}
            />
          )}
          (
          {signature.parameters.map(
            joined(', ', p => (
              <span>
                {p.name}: <Type type={p.type!} apiDocs={apiDocs} />
              </span>
            )),
          )}
          ) => <Type type={signature.returnType} apiDocs={apiDocs} />
        </div>
      ))}
    </div>
  )
}
