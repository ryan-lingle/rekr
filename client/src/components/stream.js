import React from "react";
import { Loader } from ".";
import { withApollo } from "react-apollo";
import { observer } from '../utils';


const createStream = (Component) => {
  class Stream extends React.Component {
    state = {
      stream: [],
      more: true,
      n: 0,
      initialLoad: true,
      loading: false
    };

    fetchMore = async () => {
      const { query, variables } = this.props;
      let { n } = this.state;
      const { data } = await this.props.client.query({
        query,
        variables: { n, ...variables }
      });
      const { more, stream } = this.findStream(data);
      await this.setState(prevState => {
        const newStream = prevState.stream.concat(stream);
        n += 1;
        return {
          stream: newStream,
          more, n,
          loading: false,
          initialLoad: false
        };
      })
    }

    findStream(data) {
      const keys = Object.keys(data);
      for (let i = 0; i < keys.length; i++) {
        const childData = data[keys[i]];
        if (childData && typeof childData === 'object') {
          const childChildData = this.findStream(childData);
          if (childData.stream) return childData;
          if (childChildData && childChildData.stream) return childChildData;
        }
      }
    }

    async componentDidMount() {
      await this.fetchMore();
      this.addListener()
    }


    addListener = () => {
      const cb = ({ target }) => {
        this.endOfStream();
      }

      const streamObserver = observer(cb);
      const sb = document.getElementById("stream-bottom");
      if (sb) streamObserver.observe(sb);
    }

    endOfStream = () => {
      const { loading, more } = this.state;
      // const atBottom = (document.documentElement.scrollTop + window.innerHeight + 500) >= document.documentElement.scrollHeight;
      if (!loading && more) {
        this.fetchMore()
        this.setState({ loading: true });
        // document.removeEventListener('scroll', this.endOfStream);
      }
    }

    render() {
      const { stream, loading, initialLoad } = this.state;
      if (initialLoad) return <Loader />;

      return(
        <div>
          {stream && stream.length > 0 ?
            <div className="stream">
              {stream.map(item => <Component {...item} key={item.id} variables={this.props.variables} />)}
            </div>
            : this.props.onEmpty ? this.props.onEmpty() : null}
          {loading ? <Loader /> : null}
          <div id="stream-bottom"></div>
        </div>
      )
    }
  };
  return withApollo(Stream);
}

export default createStream;
