import * as ReactDOM from 'react-dom'
import * as React from 'react'
import Component from '..'
import '../style.less'

ReactDOM.render(
  <div>
    <h2>LoadingWrapper</h2>
    <Component isLoading LoadingComponent={() => <h3>Loading</h3>}>
      <div>Content</div>
    </Component>
  </div>,
  document.getElementById('root')
)
