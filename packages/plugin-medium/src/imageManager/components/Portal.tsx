import React, { Component } from 'react';
import ReactDOM from 'react-dom';

export class Portal extends Component<any> {
  portalElement?: HTMLElement = undefined;

  render() { return null; }

  componentDidMount() {
    let p = this.props.portalId ? document.getElementById(this.props.portalId) : undefined;
    if (!p) {
      p = document.createElement('div');
      p.id = this.props.portalId;
      document.body.appendChild(p);
    }
    this.portalElement = p;
    this.componentDidUpdate();
  }

  componentWillUnmount() {
    document.body.removeChild(this.portalElement!);
  }

  componentDidUpdate() {
    // eslint-disable-next-line react/jsx-props-no-spreading
    ReactDOM.render((<div {...this.props}>{this.props.children}</div>) as any, this.portalElement!);
  }
}

export default Portal;
