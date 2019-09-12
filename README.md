# gym.js

![npm](https://img.shields.io/npm/v/gym-js)

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


TODO:

- Fix ts lint
- avoid importing phaser without defining window (i.e. for static envs)
- add more games (particularly legacy from Gym)
- rename and rearrange `render` and `renderhtml` funcs
- add support for parallel (web-worker) environments
- make tuple Space class

- __This week__:
    - build out rl algos in fast-rl lib
    - add tutorial to the interface
    - add env documentation
    - Add list of future envs and algos to show progress

- __Next Week__:
    - how to convert gym.js to interactive python env (i.e. can I convert tfjs tensor to pytf tensor)
    - Update interface with other envs
    - get in contact with organisations for an inaugural competition

- __Week after__:
    - Add user accounts
    - Built out kaggle like functionality


## DONE

- Add docs
- move into dist folder
