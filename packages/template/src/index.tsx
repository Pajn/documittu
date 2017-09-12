/// <reference path="../../../node_modules/@types/webpack-env/index.d.ts" />
import 'babel-polyfill'
import * as React from 'react'
import {ReactType} from 'react'
import {render} from 'react-dom'
import '../prism.css'
import {App} from './components/app'
import {ApiDocs, RawPages} from './lib/entities'

function requireAll(requireContext: __WebpackModuleApi.RequireContext) {
  let pages: RawPages = {}
  requireContext.keys().forEach((file: string) => {
    pages[file] = requireContext(file)
  })
  return pages
}

export type Options = {
  title: string
  pages?: __WebpackModuleApi.RequireContext
  apiDocs?: ApiDocs
}

export function start({title, pages, apiDocs}: Options) {
  let requiredPages: RawPages
  if (pages) {
    requiredPages = requireAll(pages)
  }
  function renderApp(App: ReactType) {
    const root = document.getElementById('app')

    render(<App title={title} pages={requiredPages} apiDocs={apiDocs} />, root)
  }

  if (window.document) {
    renderApp(App)
  }

  if (module.hot) {
    module.hot.accept('./components/app', () => {
      const UpdatedApp = require('./components/app').App
      setTimeout(() => renderApp(UpdatedApp))
    })
  }
}

document.addEventListener('mouseup', event => {
  let target = event.target as HTMLElement
  while (target && target.tagName && target.tagName.toLowerCase() !== 'a') {
    target = target.parentElement as HTMLElement
  }
  if (target && target.tagName) {
    target.blur()
  }
})
