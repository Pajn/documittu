import glamorous from 'glamorous'
import {body2, grey, indigo, pink} from 'material-definitions'
import AppBar from 'material-ui/AppBar'
import * as React from 'react'
import DocumentTitle from 'react-document-title'
import {Redirect, Route} from 'react-router'
import {HashRouter, Link} from 'react-router-dom'
import {row} from 'style-definitions'
import styled from 'styled-components'
import {ApiDocs, RawPages} from '../lib/entities'
import {buildRoutes} from '../lib/routes'
import {mobile} from '../styles'
import {FolderPage} from './pages/folder-page'
import {ModuleRoutes} from './pages/module-page'
import {SinglePage} from './pages/single-page'
import {RouterLink} from './router-link'

const Main = styled.main`
  margin: auto;
  padding: 16px;
  padding-top: 88px;
  max-width: 1050px;

  font-family: Roboto, sans-serif;

  @media (${mobile}) {
    padding-top: 16px;
  }

  code {
    background-color: ${grey[100]};
  }

  pre {
    padding: 12px;
    overflow: auto;
    background-color: ${grey[100]};

    > code {
      background: none;
    }
  }

  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    margin-top: 0.8em;
    margin-bottom: 0.3em;
    font-weight: 400;

    &:first-child {
      margin-top: 8px;
    }
  }
  h1 {
    font-size: 45px;
  }
  h2 {
    font-size: 34px;
  }
  h3 {
    font-size: 24px;
  }
  h4 {
    font-size: 20px;
    font-weight: 500;
  }
  h5 {
    font-size: 16px;
  }
  h6 {
    font-size: 14px;
    font-weight: 500;
  }

  ul {
    padding-left: 32px;

    > li {
      padding-top: 8px;

      > p {
        display: inline;
      }
    }
  }

  p {
    max-width: 600px;
    overflow: auto;
  }

  strong {
    font-weight: 500;
  }
`

const Nav = glamorous.nav({
  ...(row({horizontal: 'flex-end'}) as any),
  height: '100%',
})

const NavLink: any = glamorous(Link)(({active}: {active: boolean}) => ({
  ...body2,

  display: 'flex' as 'flex',
  alignItems: 'center' as 'center',
  marginLeft: 8,
  padding: 16,

  color: 'white',
  borderBottom: active ? `2px solid ${pink['A400']}` : `none`,

  fontFamily: 'Roboto, sans-serif',
  textDecoration: 'none',

  '&:focus:not(:active)': {
    backgroundColor: indigo[400],
    outline: 'none',
  },
}))

export const App = ({
  title,
  pages,
  apiDocs,
}: {
  title: string
  pages: RawPages
  apiDocs: ApiDocs
}) => {
  const routes = buildRoutes(pages, apiDocs)

  return (
    <HashRouter>
      <div>
        <DocumentTitle title={title} />
        <AppBar title={title}>
          <Nav>
            {routes.map(
              ({url, title}) =>
                title && (
                  <RouterLink
                    key={url}
                    exact={url === '/'}
                    component={NavLink}
                    to={url}
                  >
                    {title}
                  </RouterLink>
                ),
            )}
          </Nav>
        </AppBar>
        <Main>
          {routes.map(route => (
            <Route
              key={route.url}
              path={route.url}
              render={() =>
                route.kind === 'folder' ? (
                  <FolderPage page={route} appTitle={title} />
                ) : route.kind === 'page' ? (
                  <SinglePage page={route} appTitle={title} />
                ) : route.kind === 'module' ? (
                  <ModuleRoutes page={route} appTitle={title} />
                ) : (
                  <Redirect to={route.to} />
                )
              }
            />
          ))}
        </Main>
      </div>
    </HashRouter>
  )
}
