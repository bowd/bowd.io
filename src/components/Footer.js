import React from 'react';
import twitter from '../assets/twitter.svg';
import github from '../assets/github.svg';
import stackoverflow from '../assets/stackoverflow.svg';
import rss from '../assets/rss.svg';

import { rhythm } from '../utils/typography';

class Footer extends React.Component {
  render() {
    return (
      <footer
        style={{
          marginTop: rhythm(2.5),
          paddingTop: rhythm(1),
        }}
      >
        {false ? (
          <div style={{ float: 'right' }}>
            <a href="/rss.xml" target="_blank" rel="noopener noreferrer">
              <img src={rss} height="20" />
            </a>
          </div>
        ) : null}
        <a
          href="https://mobile.twitter.com/i_bowd"
          target="_blank"
          rel="noopener noreferrer"
          style={{ position: 'relative', top: '-10px' }}
        >
          <img src={twitter} height="20" />
        </a>{' '}
        <a
          href="https://github.com/bowd"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img src={github} className="github" height="40" />
        </a>{' '}
        <a
          href="https://stackoverflow.com/users/1232656/bogdan-dumitru"
          target="_blank"
          rel="noopener noreferrer"
          style={{ position: 'relative', top: '-10px' }}
        >
          <img src={stackoverflow} height="20" />
        </a>
      </footer>
    );
  }
}

export default Footer;
