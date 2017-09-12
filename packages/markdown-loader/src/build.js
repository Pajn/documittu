'use strict'
const camelize = require('camelize')
const except = require('except')

/**
 * @typedef HTMLObject
 * @type {Object}
 * @property {String} html    - HTML parsed from markdown
 * @property {Object} imports - Map of dependencies
 * @property {Object} globalCodeBlocks - Array of code blocks
 */

/**
 * Builds the React Component from markdown content
 * with its dependencies
 * @param   {HTMLObject} markdown - HTML and imports
 * @returns {String}              - React Component
 */
module.exports = function build(markdown) {
  let doImports = "import React from 'react';\n"
  const imports = markdown.attributes.imports || {},
    jsx = markdown.html.replace(/class=/g, 'className=')

  const frontMatterAttributes = except(markdown.attributes, 'imports')

  for (const variable in imports) {
    // eslint-disable-next-line no-prototype-builtins
    if (imports.hasOwnProperty(variable)) {
      doImports += `import ${variable} from '${imports[variable]}';\n`
    }
  }

  return `
${doImports}

const store = {}
${markdown.globalCodeBlocks.join('\n')}
export const attributes = ${JSON.stringify(camelize(frontMatterAttributes))};
export default class extends React.Component {
  constructor() {
    super()
    this.state = {}
  }
  render() {
    return (
      <div>
        ${jsx}
      </div>
    );
  }
};`
}
