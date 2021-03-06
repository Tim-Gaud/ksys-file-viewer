import React from 'react';
import renderer from 'react-test-renderer';

import { AudioViewer } from '../../../src/components/drivers';

describe('AudioViewer', () => {
  it('matches snapshot', () => {
    const tree = renderer.create(
      <AudioViewer filePath='fake/path' />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
