const EventEmitter = require('events').EventEmitter
    , inherits     = require('util').inherits
    , crypto       = require('crypto')
    , bl           = require('bl')
    , bufferEq     = require('buffer-equal-constant-time')

function signBlob (key, blob) {
  return 'sha1=' + crypto.createHmac('sha1', key).update(blob).digest('hex')
}

