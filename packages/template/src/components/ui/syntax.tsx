import {blue, green, indigo, purple, teal} from 'material-definitions'
import styled from 'styled-components'

export const Keyword = styled.span`
  color: ${purple[700]};
`
export const StringLiteral = styled.span`
  color: ${green[700]};
`
export const BooleanLiteral = styled.span`
  color: ${purple[700]};
`
export const NumberLiteral = styled.span`
  color: ${blue[700]};
`

export const PropertyName = styled.span`
  color: ${teal[800]};
  font-weight: 500;
`

export const TypeName = styled.span`
  color: ${indigo[600]};
`
