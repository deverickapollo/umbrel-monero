<p align="center">
  <a href="https://umbrel.com">
    <img src="https://i.imgur.com/rhDWq5W.jpg" alt="Logo">
  </a>
  <h1 align="center">Monero Node for Umbrel</h1>
  <p align="center">
    Run a Monero node on your Umbrel personal server. An unofficial app by Deverick. Powered by Monero.
    <br />
    <a href="https://getmonero.org"><strong>monero.org »</strong></a>
    <br />
    <br />
    <a href="https://twitter.com/monero">
      <img src="https://img.shields.io/twitter/follow/umbrel?style=social" />
    </a>
    <a href="https://telegram.me/monero">
      <img src="https://img.shields.io/badge/community-chat-%235351FB">
    </a>
    <a href="https://reddit.com/r/Monero">
      <img src="https://img.shields.io/reddit/subreddit-subscribers/getumbrel?style=social">
    </a>
    <a href="https://github.com/monero-project/monero/issues">
      <img src="https://img.shields.io/badge/community-forum-%235351FB">
    </a>
  </p>
</p>

## Building App

On MacOS:

- export NODE_OPTIONS=--openssl-legacy-provider    
  - Otherwise you will see  Building for production...Error: error:0308010C:digital envelope routines::unsupported
  - https://stackoverflow.com/questions/69692842/error-message-error0308010cdigital-envelope-routinesunsupported
- npm run-script build:ui
- npm run-script serve:ui
- npm run start
  
## Getting started

This app can be installed in one click via the Umbrel Community App Store.

---

## Contributing

We welcome and appreciate new contributions!  Open a PR and I'll be sure to review it asap.  For an bugs/feature requests,  open an issue and I'll review it as my time allows. 


## Acknowledgements

This app is built upon the work done by [Casa](https://github.com/casa) on its open source [API](https://github.com/Casa/Casa-Node-API) and Umbrel [umbrel.com](https://umbrel.com).

---

[![License](https://img.shields.io/github/license/getumbrel/umbrel-bitcoin?color=%235351FB)](https://github.com/getumbrel/umbrel-bitcoin/blob/master/LICENSE.md)

[umbrel.com](https://umbrel.com)
