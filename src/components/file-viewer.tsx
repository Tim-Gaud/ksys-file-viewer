// Copyright (c) 2017 PlanGrid, Inc.

import React, { Component } from 'react';
import withFetching from './fetch-wrapper';

import {
  CsvViewer,
  DocxViewer,
  VideoViewer,
  XlsxViewer,
  XBimViewer,
  PDFViewer,
  UnsupportedViewer,
  PhotoViewerWrapper,
  AudioViewer,
} from './drivers/index';

export interface IFileViewerProps {
  fileType: string;
  filePath: string;
  onError?: (e?: Event) => null;
  errorComponent?: null;
  unsupportedComponent?: null;
}

interface IFileViewerState {
  width: number;
  height: number;
}

class FileViewer extends Component<IFileViewerProps, IFileViewerState> {
  constructor(props) {
    super(props);
    this.state = {
      width: 0,
      height: 0,
    };
  }

  componentDidMount() {
    const container = document.getElementById('pg-viewer');
    const height = container ? container.clientHeight : 0;
    const width = container ? container.clientWidth : 0;
    this.setState({ height, width });
  }

  getDriver() {
    switch (this.props.fileType) {
      case 'csv': {
        return withFetching(CsvViewer, this.props);
      }
      case 'xlsx': {
        return withFetching(XlsxViewer, { responseType: 'arraybuffer', ...this.props });
      }
      case 'jpg':
      case 'jpeg':
      case 'gif':
      case 'bmp':
      case 'png': {
        return PhotoViewerWrapper;
      }
      case 'pdf': {
        return PDFViewer;
      }
      case 'docx': {
        return DocxViewer;
      }
      case 'mp3': {
        return AudioViewer;
      }
      case 'webm':
      case 'mp4': {
        return VideoViewer;
      }
      case 'wexbim': {
        return XBimViewer;
      }
      default: {
        return UnsupportedViewer;
      }
    }
  }

  render() {
    const Driver = this.getDriver();
    return (
      <div className="pg-viewer-wrapper">
        <div className="pg-viewer" id="pg-viewer">
          <Driver {...this.props} width={this.state.width} height={this.state.height} />
        </div>
      </div>
    );
  }
}

export default FileViewer;