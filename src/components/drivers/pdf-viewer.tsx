import React from 'react';
import VisibilitySensor from 'react-visibility-sensor';
import { PDFJS } from 'pdfjs-dist/build/pdf.combined';
import 'pdfjs-dist/web/compatibility';
import { IFileViewerProps, TPageNavigationProps } from '../file-viewer';
require('../../styles/pdf.scss');

PDFJS.disableWorker = true;
const INCREASE_PERCENTAGE = 0.2;
const DEFAULT_SCALE = 1.1;

interface IPDFPageProps {
  disableVisibilityCheck: boolean;
  zoom: any;
  index: number;
  pdf: any;
  containerWidth: any
}

interface IPDFPageState {
  isVisible: boolean;
  width: number;
  height: number;
}

export class PDFPage extends React.Component<IPDFPageProps, IPDFPageState> {
  canvas;
  constructor(props) {
    super(props);
    this.state = {
      isVisible: false,
      width: 670,
      height: 870,
    };

    this.canvas = document.getElementById('temp-canvas');
    this.onChange = this.onChange.bind(this);
  }

  componentDidMount() {
    if (this.props.disableVisibilityCheck) this.fetchAndRenderPage();
  }

  componentDidUpdate(prevProps, prevState) {
    if (this.props.disableVisibilityCheck) {
      if (prevProps.zoom !== this.props.zoom) this.fetchAndRenderPage();
      return;
    }

    // we want to render/re-render in two scenarias
    // user scrolls to the pdf
    // user zooms in
    if (prevState.isVisible === this.state.isVisible && prevProps.zoom === this.props.zoom) return;
    if (this.state.isVisible) this.fetchAndRenderPage();
  }

  onChange(isVisible) {
    if (isVisible) this.setState({ isVisible });
  }

  fetchAndRenderPage() {
    const { pdf, index } = this.props;
    pdf.getPage(index).then(this.renderPage.bind(this));
  }

  renderPage(page) {
    const { containerWidth, zoom } = this.props;
    const calculatedScale = (containerWidth / page.getViewport(DEFAULT_SCALE).width);
    const scale = calculatedScale > DEFAULT_SCALE ? DEFAULT_SCALE : calculatedScale;
    const viewport = page.getViewport(scale + zoom);
    const { width, height } = viewport;

    this.setState({ width, height })
    const context = this.canvas.getContext('2d');

    page.render({
      canvasContext: context,
      viewport,
    });
  }

  render() {
    const { index } = this.props;
    const { width, height } = this.state;
    return (
      <div key={`page-${index}`} className="pdf-canvas" style={{ height }}>
        {this.props.disableVisibilityCheck ?
          <canvas id={'temp-canvas'} ref={node => this.canvas = node} width={width} height={height} /> :
          (
            <VisibilitySensor onChange={this.onChange} partialVisibility >
              <canvas id={'temp-canvas'} ref={node => this.canvas = node} width={width} height={height} />
            </VisibilitySensor>
          )
        }
      </div>
    );
  }
}

interface IPDFDriverProps extends IFileViewerProps {
  width: number;
  height: number;
  disableVisibilityCheck: boolean;
}

export default class PDFDriver extends React.Component<IPDFDriverProps, any> {
  container;
  constructor(props) {
    super(props);
    this.container = document.getElementById('pg-viewer');
    this.state = {
      pdf: null,
      zoom: 0,
      percent: 0,
      currentPage: 1,
    };

    this.increaseZoom = this.increaseZoom.bind(this);
    this.reduceZoom = this.reduceZoom.bind(this);
    this.resetZoom = this.resetZoom.bind(this);
  }

  static defaultProps = {
    disableVisibilityCheck: false,
  }

  componentDidMount() {
    const { filePath } = this.props;
    const containerWidth = this.container.offsetWidth;

    PDFJS.getDocument(filePath, null, null, this.progressCallback.bind(this)).then((pdf) => {
      this.setState({ pdf, containerWidth });
    });
  }

  setZoom(zoom) {
    this.setState({
      zoom,
    });
  }

  progressCallback(progress) {
    const percent = ((progress.loaded / progress.total) * 100).toFixed();
    this.setState({ percent });
  }

  reduceZoom() {
    if (this.state.zoom === 0) return;
    this.setZoom(this.state.zoom - 1);
  }

  increaseZoom() {
    this.setZoom(this.state.zoom + 1);
  }

  resetZoom() {
    this.setZoom(0);
  }

  renderPages() {
    const { pdf, containerWidth, zoom, currentPage } = this.state;
    if (!pdf) return null;
    const pages = Array.apply(null, { length: pdf.numPages });
    return pages.map((v, i) => (
      <div key={i}>
        {i + 1 === currentPage && (<PDFPage
          index={currentPage}
          pdf={pdf}
          containerWidth={containerWidth}
          zoom={zoom * INCREASE_PERCENTAGE}
          disableVisibilityCheck={this.props.disableVisibilityCheck}
        />)}
      </div>
    ));
  }

  renderLoading() {
    if (this.state.pdf) return null;
    return (<div className="pdf-loading">LOADING ({this.state.percent}%)</div>);
  }

  previousPage() {
    this.setState({ currentPage: Math.max(this.state.currentPage - 1, 1) })
  }

  nextPage() {
    this.setState({ currentPage: Math.min(this.state.currentPage + 1, this.state.pdf.numPages) })
  }

  getNavigationProps(): TPageNavigationProps {
    const { pdf, currentPage, zoom } = this.state;
    return {
      pageLeft: {
        disabled: currentPage === 1,
        onClick: this.previousPage.bind(this),
      },
      pageRight: {
        disabled: pdf ? (currentPage === pdf.numPages) : true,
        onClick: this.nextPage.bind(this),
      },
      navFooter: {
        currentPage: currentPage,
        totalPages: pdf ? pdf.numPages : 0,
        zoomIn: this.increaseZoom.bind(this),
        zoomOut: this.reduceZoom.bind(this),
        currentZoomPerc: Math.floor(zoom * INCREASE_PERCENTAGE * 100),
      },
      idleState: this.props.idleState || false
    }
  }

  render() {
    const PageNavControls = this.props.pageNavigationComponent;
    const pageNavProps = this.getNavigationProps();

    return (
      <div className="pdf-viewer-container">
        <div className="pdf-viewer" ref={node => this.container = node} >
          {PageNavControls ? (
            <PageNavControls {...pageNavProps} />
          ) : (
              <div className="pdf-controlls-container">
                <div className="view-control" onClick={this.increaseZoom} >
                  <i className="zoom-in" />
                </div>
                <div className="view-control" onClick={this.resetZoom}>
                  <i className="zoom-reset" />
                </div>
                <div className="view-control" onClick={this.reduceZoom}>
                  <i className="zoom-out" />
                </div>
              </div>
            )}
          {this.renderLoading()}
          {this.renderPages()}
        </div>
      </div>
    );
  }
}