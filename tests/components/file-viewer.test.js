import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import FileViewer from '../../src/components/file-viewer';

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

describe('file-viewer', () => {
  it('renders without crashing', () => {
    mount(
      <FileViewer fileType='fake' filePath='fake/path' />
    );
  });

  it('renders without crashing with visibility check disabled', () => {
    mount(
      <FileViewer fileType='fake' filePath='fake/path' disableVisibilityCheck />
    );
  });
});
