'use strict';

const
  request = require('request')
;

// sorry. needs to be singleton regardless of the loading order/modules
if (global['requestpeeper_singleton']) {
  module.exports = global['requestpeeper_singleton'];
  return;
}

let _ = {
  'requester': request.defaults({useQuerystring: true}),

  'callDebugger': null,
  'returnDebugger': null,
  'setCallDebugger': function (debugFn) {
    _.callDebugger = debugFn;
  },
  'setReturnDebugger': function (debugFn) {
    _.returnDebugger = debugFn;
  }
};

let PeepRequester = (options, callback, tag) => {
  if (_.callDebugger) { _.callDebugger(tag, options); }

  _.requester(options, function (err, r, body) {
    if (_.returnDebugger) { _.returnDebugger(tag, options, r, body); }
    callback.call('', err, r, body);
  });
};

PeepRequester.setCallDebugger = _.setCallDebugger;
PeepRequester.setReturnDebugger = _.setReturnDebugger;
PeepRequester.getInfo = () => (
  'cb'+ ((_.callDebugger) ? '1' : '0') + ((_.returnDebugger) ? '1' : '0')
);

global['requestpeeper_singleton'] = PeepRequester;
module.exports = PeepRequester;
