import React from 'react';
import { mount, configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { PDFPage } from '../../src/components/drivers/pdf-viewer';

beforeAll(() => {
  configure({ adapter: new Adapter() })
})

describe('pdf-viewer', () => {
  let spy;
  beforeEach(() => {
    spy = jest.spyOn(PDFPage.prototype, 'fetchAndRenderPage').mockImplementation(() => {})
  })

  afterEach(() => {
    spy.mockReset();
    spy.mockRestore();
  })

  it('renders without crashing', () => {
    mount(
      <PDFPage fileType='fake' filePath='fake/path' />
    );
  });

  it('calls fetchAndRenderPage on mount with visibility check disabled', () => {
    mount(
      <PDFPage fileType='fake' filePath='fake/path' disableVisibilityCheck />
    );
    expect(spy).toHaveBeenCalled();
  });

  it('does not call fetchAndRenderPage on mount with visibility check enabled', () => {
    mount(
      <PDFPage fileType='fake' filePath='fake/path' disableVisibilityCheck={false} />
    );
    expect(spy).not.toHaveBeenCalled();
  });
});
