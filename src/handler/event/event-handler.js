import handleClick from './handle-click.js';
import handleSubmit from './handle-submit.js';
import handlePopstate from './handle-popstate.js';

import historyController from '../../controller/history-controller.js';

// @todo onload handler

export default {
  click: handleClick,
  submit: handleSubmit,
  popstate: handlePopstate,
};

// @dev
export const pre = (e) =>
  console.log(
    e.type,
    historyController.index,
    historyController.values.length,
    historyController.values,
    historyController.values[historyController.index]
  );

export const post = () =>
  console.log(
    window.history.length,
    historyController.index,
    historyController.values.length,
    historyController.values,
    historyController.values[historyController.index]
  );
