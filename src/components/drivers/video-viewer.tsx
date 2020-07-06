import React, { Component } from 'react';
import Loading from '../loading';

import { IFileViewerProps } from '../file-viewer';

interface IVideoViewerProps extends IFileViewerProps {
  width: number;
  height: number;
}

class VideoViewer extends Component<IVideoViewerProps, { loading: boolean }> {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
    };
  }

  onCanPlay() {
    this.setState({ loading: false });
  }

  renderLoading() {
    if (this.state.loading) {
      return <Loading />;
    }
    return null;
  }

  render() {
    const visibility = this.state.loading ? 'hidden' : 'visible';
    return (
      <div className="pg-driver-view">
        <div className="video-container">
          {this.renderLoading()}
          <video
            style={{ visibility }}
            controls
            onCanPlay={() => this.onCanPlay()}
            src={this.props.filePath}
          >
            Video playback is not supported by your browser.
          </video>
        </div>
      </div>
    );
  }
}

export default VideoViewer;
