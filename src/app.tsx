import 'styles/main.scss';
import React from 'react';
import ReactDOM from 'react-dom';
import FileViewer from './components/file-viewer';

const sampleHouse = '../example_files/SampleHouse.wexbim';
const solarImage = '../example_files/02-USVI-Solar.jpg';
const docx = '../example_files/SampleSpec.docx';
const doc = '../example_files/sample.doc';
const csv = '../example_files/Total_Crime.csv';
const mp4 = '../example_files/small.mp4';
const xlsx = '../example_files/SimpleSpreadsheet.xlsx';
const photo360 = '../example_files/360photo.jpg';
const avi = '../example_files/drop.avi';
const webm = '../example_files/small.webm';
const mov = '../example_files/step.mov';
const mp3 = '../example_files/sample.mp3';
const rtf = '../example_files/sample.rtf';
const pdf = '../example_files/sample.pdf';

ReactDOM.render(
  <FileViewer
    fileType="pdf"
    filePath={pdf}
  />,
  document.getElementById('app'),
);
