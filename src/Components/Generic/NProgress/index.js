import React, { Component } from 'react'
import nprogress from "nprogress";

export default class index extends Component {
  componentDidMount(){
    nprogress.configure({
        showSpinner: true,
        trickleSpeed: 200
    })
    nprogress.start();
  }
  componentWillUnmount(){
    nprogress.done();
  }
  render() {
    return <></>
  }
}
