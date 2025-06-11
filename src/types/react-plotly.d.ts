declare module 'react-plotly.js' {
  import { Component } from 'react';
  import { Data, Layout, Config } from 'plotly.js';

  export interface PlotParams {
    data: Data[];
    layout?: Partial<Layout>;
    config?: Partial<Config>;
    className?: string;
    style?: React.CSSProperties;
    useResizeHandler?: boolean;
  }

  export default class Plot extends Component<PlotParams> {}
}
