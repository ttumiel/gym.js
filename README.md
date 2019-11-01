# gym.js

![npm](https://img.shields.io/npm/v/gym-js)
[![Build Status](https://travis-ci.org/ttumiel/gym.js.svg?branch=master)](https://travis-ci.org/ttumiel/gym.js)
[![Coverage Status](https://coveralls.io/repos/github/ttumiel/gym.js/badge.svg?branch=master)](https://coveralls.io/github/ttumiel/gym.js?branch=master)

__Warning__: Under active development. APIs may change.

A browser-based reinforcement learning environment. Based off of OpenAI's [Gym](https://github.com/openai/gym).

[**Demo**](https://epic-darwin-f8b517.netlify.com/) | [**Docs**](https://ttumiel.github.io/gym.js/index.html)

## Installation

Install with `npm`:

```bash
npm install gym-js
```

And import environments from the module:

```javascript
import { FrozenLake } from "gym-js";
```

## Contributing

Please make a pull request for any contribution. In particular, you can reimplement `gym` environments, add test cases and patch any bugs you might find. Additionally, if you have any suggestions on the API, or the library in general, you can open an issue.

## Adding a New Environment

[See here.](https://github.com/Tom2718/gym.js/tree/master/src/envs#environments)

## Future Plans

The aim for this library is to match `gym` with both functionality and environments. A list of environments still to be added is in the [`env`](https://github.com/Tom2718/gym.js/tree/master/src/envs#environments) folder.
