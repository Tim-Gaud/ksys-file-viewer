// Copyright (c) 2017 PlanGrid, Inc.

import React, { Component } from 'react';

import ReactDataGrid from 'react-data-grid';
import CSV from 'comma-separated-values';
import { IFileViewerProps } from '../file-viewer';

interface ICsvViewerProps extends IFileViewerProps {
  width: number;
  height: number;
  data: string;
}

interface ICsvViewerState {
  rows: row[];
  columns: column[];
}

interface column {
  key: string;
  name: string;
  resizable: boolean;
  sortable: boolean;
  filterable: boolean;
}

type row = Record<string, string>

class CsvViewer extends Component<ICsvViewerProps, ICsvViewerState>{

  static parse(data) {
    const rows: row[] = [];
    const columns: column[] = [];

    new CSV(data).forEach((array) => {
      if (columns.length < 1) {
        array.forEach((cell: string, idx: number) => {
          columns.push({
            key: `key-${idx}`,
            name: cell,
            resizable: true,
            sortable: true,
            filterable: true,
          });
        });
      } else {
        const row = {};
        array.forEach((cell: string, idx: number) => {
          row[`key-${idx}`] = cell;
        });
        rows.push(row);
      }
    });

    return { rows, columns };
  }

  constructor(props) {
    super(props);
    this.state = CsvViewer.parse(props.data);
  }

  componentWillReceiveProps(nextProps) {
    this.setState(CsvViewer.parse(nextProps.data));
  }

  render() {
    const { rows, columns } = this.state;
    return (
      <ReactDataGrid
        columns={columns}
        rowsCount={rows.length}
        rowGetter={i => rows[i]}
        minHeight={this.props.height || 650}
      />
    );
  }
}

export default CsvViewer;
