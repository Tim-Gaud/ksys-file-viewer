import React from 'react';
import renderer from 'react-test-renderer';

import Error from '../../src/components/error';

describe('Error component', () => {
  it('matches stored snapshot', () => {
    const tree = renderer.create(
      <Error />
    ).toJSON();

    expect(tree).toMatchSnapshot();
  });
});
