import glamorous from 'glamorous'
import {indigo, pink} from 'material-definitions'
import {Link} from 'react-router-dom'
import {row} from 'style-definitions'
import styled from 'styled-components'
import {mobile} from '../../styles'

export const Container = glamorous.div([
  row(),
  {
    [`@media (${mobile})`]: {
      flexDirection: 'column',
    },
  },
])

export const Nav = styled.nav`
  flex-shrink: 0;
  box-sizing: border-box;
  padding-right: 8px;
  width: 190px;
  border-right: 1px solid rgba(0, 0, 0, 0.3);

  @media (${mobile}) {
    display: flex;
    flex-wrap: wrap;
    margin-bottom: 8px;
    width: 100%;
    border-right: none;
    border-bottom: 1px solid rgba(0, 0, 0, 0.3);
  }

  > div > h3 {
    font-size: 16px;
    font-weight: 400;
    line-height: 1.3;
  }
`

export const NavLink = glamorous(Link, {filterProps: ['active']})(
  ({active}: {active: boolean}) => ({
    display: 'block' as 'block',
    marginBottom: 4,
    paddingTop: 4,
    paddingLeft: 4,
    paddingBottom: 4,

    color: indigo[500],
    borderLeft: `3px solid transparent`,
    fontWeight: (active ? 500 : 400) as any,

    textDecoration: 'none' as 'none',

    '&:focus:not(:active)': {
      borderLeft: `3px solid ${pink['A400']}`,
      outline: 'none' as 'none',
    },
  }),
)

export const Content = styled.section`
  padding-left: 16px;
`
