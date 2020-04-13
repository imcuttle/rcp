import * as ReactDOM from 'react-dom'
import * as React from 'react'
import Component from '..'
import '../style.less'

ReactDOM.render(
  <div>
    <h2>LoadingWrapper</h2>
    <Component isLoading renderLoadingDelayMs={2000} withDelayRenderFirstly LoadingComponent={() => <h3>Loading</h3>}>
      <div>Content</div>
    </Component>

    <Component isLoading renderLoadingDelayMs={1000} LoadingComponent={() => <h3>Loading</h3>}>
      <div>Content</div>
      <div>Content</div>
      <div>Content</div>
    </Component>
  </div>,
  document.getElementById('root')
)
