import * as React from 'react'
import {ThemeProvider} from 'react-css-themr'
import DocumentTitle from 'react-document-title'
import {HashRouter, Link} from 'react-router-dom'
import Redirect from 'react-router/Redirect'
import Route from 'react-router/Route'
import {AppBar} from 'react-toolbox/lib/app_bar'
import 'react-toolbox/lib/commons.scss'
import styled from 'styled-components'
import {materialColors} from 'styled-material/dist/src/colors'
import {buildRoutes} from '../routes'
import {mobile} from '../styles'
import {theme} from '../theme'
import {FolderPage} from './folder-page'
import {RouterLink} from './router-link'
import {SinglePage} from './single-page'

const Main = styled.main`
  margin: auto;
  padding: 16px;
  padding-top: 24px;
  max-width: 960px;

  font-family: Roboto, Arial, sans-serif;

  @media (${mobile}) {
    padding-top: 16px;
  }

  code {
    background: whitesmoke;
  }
  pre {
    overflow: auto;

    > code {
      background: none;
    }
  }

  h1, h2, h3, h4, h5, h6 {
    margin-top: 0.8em;
    margin-bottom: 0.3em;
    font-weight: 400;

    &:first-child {
      margin-top: 8px;
    }
  }
  h1 {
    font-size: 56px;
  }
  h2 {
    font-size: 45px;
  }
  h3 {
    font-size: 34px;
  }
  h4 {
    font-size: 24px;
  }
  h5 {
    font-size: 20px;
    font-weight: 500;
  }
  h6 {
    font-size: 16px;
  }

  p {
    max-wdith: 100%;
    overflow: auto;
  }
`

const Nav = styled.nav`
  display: flex;
  height: 100%;
`

const NavLink: any = styled(Link)`
  display: flex;
  align-items: center;
  margin-left: 8px;
  padding: 16px;

  color: white;
  border-bottom: ${({active}: any) => active ? `2px solid ${materialColors['pink-a400']}` : `none`};

  text-decoration: none;

  &:focus:not(:active) {
    background-color: ${materialColors['indigo-400']};
    outline: none;
  }
`

export const App = ({title, pages}) => {
  const routes = buildRoutes(pages)

  return (
    <ThemeProvider theme={theme}>
      <HashRouter>
        <div>
          <DocumentTitle title={title} />
          <AppBar title={title}>
            <Nav>
              {routes.map(({url, title}) =>
                title &&
                  <RouterLink key={url} exact={url === '/'} component={NavLink} to={url}>
                    {title}
                  </RouterLink>
              )}
            </Nav>
          </AppBar>
          <Main>
            {routes.map(route =>
              <Route key={route.url} exact={route.url === '/'} path={route.url} render={() =>
                route.kind === 'folder'
                  ? <FolderPage page={route} appTitle={title} />
                : route.kind === 'page'
                  ? <SinglePage page={route} appTitle={title} />
                :
                  <Redirect to={route.to} />
              } />
            )}
          </Main>
        </div>
      </HashRouter>
    </ThemeProvider>
  )
}
