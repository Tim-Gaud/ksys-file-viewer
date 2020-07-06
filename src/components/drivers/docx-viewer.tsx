import React, { Component } from 'react';
import mammoth from 'mammoth';
import Loading from '../loading';
import { IFileViewerProps } from '../file-viewer';

interface IDocxViewerProps extends IFileViewerProps {
  width: number;
  height: number;
}


export default class extends Component<IDocxViewerProps> {
  componentDidMount() {
    const jsonFile = new XMLHttpRequest();
    jsonFile.open('GET', this.props.filePath, true);
    jsonFile.send();
    jsonFile.responseType = 'arraybuffer';
    jsonFile.onreadystatechange = () => {
      if (jsonFile.readyState === 4 && jsonFile.status === 200) {
        mammoth.convertToHtml(
          { arrayBuffer: jsonFile.response },
          { includeDefaultStyleMap: true },
        )
        .then((result) => {
          const docEl = document.createElement('div');
          docEl.className = 'document-container';
          docEl.innerHTML = result.value;
          const docX = document.getElementById('docx');
          if(docX) {
            docX.innerHTML = docEl.outerHTML;
          }
        })
        .catch((a) => {
          console.log('alexei: something went wrong', a);
        })
        .done();
      }
    };
  }

  render() {
    return (
      <div id="docx">
        <Loading />
      </div>);
  }
}
