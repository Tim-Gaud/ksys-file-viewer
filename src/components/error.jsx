// Copyright (c) 2017 PlanGrid, Inc.

import React from 'react';

const Error = props => (
  <div className="error-message">
    {props.errorComponent
      ? <props.errorComponent {...props} />
      : <p className="alert">Unable to preview file</p>}
  </div>
);

export default Error;
