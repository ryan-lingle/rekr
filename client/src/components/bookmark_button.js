import React from "react";
import { CREATE_BOOKMARK, DESTROY_BOOKMARK } from "../actions";
import { NotificationManager } from 'react-notifications';
import { Mutation } from "react-apollo";
import { ErrorMessage } from ".";

export default class BookmarkButton extends React.Component {
  state = {
    bookmarked: this.props.bookmarked
  }

  handleResponse = ({ createBookmark, destroyBookmark }) => {
    if (createBookmark) NotificationManager.info('Rek Bookmarked');
    const res = createBookmark || destroyBookmark;
    this.setState({ bookmarked: res.bookmarkExists })
  }

  render() {
    const { bookmarked } = this.state;
    const ACTION = bookmarked ? DESTROY_BOOKMARK : CREATE_BOOKMARK;

    return(
      <Mutation mutation={ACTION} onCompleted={this.handleResponse} >
        {(action, { error }) => (
          <div>
            <ErrorMessage error={error} />
            <i
              className={`fa-bookmark bookmark ${bookmarked ? 'fa bookmarked' : 'far'}`}
              id="bookmark-btn"
              onClick={() => {
                action({ variables: {
                  episodeId: this.props.episodeId,
                  rekId: this.props.rekId
                }})
              }}
            >
            </i>
          </div>
        )}
      </Mutation>
    )
  }
};
