declare module 'react-plotly.js' {
  import { Component } from 'react';
  import { Data, Layout, Config } from 'plotly.js';

  export interface PlotParams {
    data: Data[];
    layout?: Partial<Layout> | any;
    config?: Partial<Config> | any;
    className?: string;
    style?: React.CSSProperties;
    useResizeHandler?: boolean;
    onInitialized?: (figure: any, graphDiv: any) => void;
    onUpdate?: (figure: any, graphDiv: any) => void;
    onPurge?: (figure: any, graphDiv: any) => void;
    onError?: (err: any) => void;
    onPlotlyClick?: (event: any) => void;
    onPlotlyHover?: (event: any) => void;
    onPlotlyUnhover?: (event: any) => void;
  }

  export default class Plot extends Component<PlotParams> {}
}
