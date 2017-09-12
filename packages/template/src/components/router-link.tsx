import React, {ReactChild, ReactType} from 'react'
import {Route, RouteComponentProps} from 'react-router'
import {LinkProps} from 'react-router-dom'

export type RouterLinkProps = {
  component: ReactType<LinkProps & {active: boolean}>
  to: string
  exact?: boolean
  children?: ReactChild
}

export const RouterLink = ({
  component: Link,
  to,
  exact = false,
  children = null,
}: RouterLinkProps) => (
  <Route
    exact={exact}
    path={to}
    children={({match}: RouteComponentProps<any>) => (
      <Link
        to={to}
        active={match}
        onKeyPress={(e: React.KeyboardEvent<HTMLElement>) =>
          e.key === ' ' && e.currentTarget.click()
        }
      >
        {children}
      </Link>
    )}
  />
)
