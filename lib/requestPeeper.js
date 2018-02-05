'use strict';

const
  request = require('request')
;

let _ = {
  'requester': request.defaults({useQuerystring: true}),

  'callDebugger': null,
  'returnDebugger': null,
  'setCallDebugger': function (debugFn) { _.callDebugger = debugFn; },
  'setReturnDebugger': function (debugFn) { _.returnDebugger = debugFn; },

  'call': function (options, callback, tag) {
    if (_.callDebugger) { _.callDebugger(tag, options); }

    _.requester(options, function (err, r, body) {
      if (_.returnDebugger) { _.returnDebugger(tag, options, r, body); }
      callback.call('', err, r, body);
    });
  }
};

let PeepRequester = _.call;
PeepRequester.setCallDebugger = _.setCallDebugger;
PeepRequester.setReturnDebugger = _.setReturnDebugger;

module.exports = PeepRequester;
