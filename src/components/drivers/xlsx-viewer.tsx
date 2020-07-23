import React, { Component, ReactElement } from 'react';
import XLSX from 'xlsx';

import CsvViewer from './csv-viewer';
import { IFileViewerProps, TPageNavigationProps } from '../file-viewer';

interface IXlxsViewerProps extends IFileViewerProps {
  width: number;
  height: number;
  data: ArrayBuffer;
}

interface IXlxsViewerState {
  sheets: string[];
  names: string[];
  curSheetIndex: number;
}


class XlxsViewer extends Component<IXlxsViewerProps, IXlxsViewerState> {
  constructor(props) {
    super(props);
    this.state = this.parse();
  }

  parse(): IXlxsViewerState {
    const dataArr = new Uint8Array(this.props.data);
    const arr: string[] = [];

    for (let i = 0; i !== dataArr.length; i += 1) {
      arr.push(String.fromCharCode(dataArr[i]));
    }

    const workbook = XLSX.read(arr.join(''), { type: 'binary' });
    const names = Object.keys(workbook.Sheets);
    const sheets = names.map(name => (
      XLSX.utils.sheet_to_csv(workbook.Sheets[name])
    ));

    return { sheets, names, curSheetIndex: 0 };
  }


  previousSheet() {
    this.setState({ curSheetIndex: this.state.curSheetIndex - 1 });
  }

  nextSheet() {
    this.setState({ curSheetIndex: this.state.curSheetIndex + 1 });
  }

  renderSheetData(sheet: string): ReactElement {
    const csvProps = Object.assign({}, this.props, { data: sheet });
    return (
      <CsvViewer {...csvProps} />
    );
  }

  getNavigationProps(names: string[]): TPageNavigationProps {
    const { curSheetIndex } = this.state;
    console.log(names.length);
    return {
      pageLeft: {
        disabled: curSheetIndex === 0,
        onClick: this.previousSheet.bind(this),
      },
      pageRight: {
        disabled: (curSheetIndex + 1 === names.length),
        onClick: this.nextSheet.bind(this),
      },
      navFooter: {
        currentPage: curSheetIndex + 1,
        totalPages: names.length,
        zoomIn: () => { },// TODO,
        zoomOut: () => { },// TODO
        currentZoomPerc: 0,// TODO
      },
      idleState: false
    }
  }

  render() {
    const PageNavControls = this.props.pageNavigationComponent;
    const { sheets, names, curSheetIndex } = this.state;
    const pageNavProps = this.getNavigationProps(names);
    return (
      <div className="spreadsheet-viewer">
        {PageNavControls ? (
          <PageNavControls {...pageNavProps} />
        ) : null}
        {this.renderSheetData(sheets[curSheetIndex || 0])}
      </div>
    );
  }
}

export default XlxsViewer;
