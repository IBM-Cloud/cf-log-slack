// Licensed under the Apache License. See footer for details.

"use strict"

const _ = require("underscore")

const messages = require("../lib/messages")

//------------------------------------------------------------------------------
module.exports = tester

//------------------------------------------------------------------------------
function tester(T) {

  //-----------------------------------
  T.test("- messages module structure", function(t) {

    t.ok(_.isObject(   messages               ), "messages should be a object")
    t.ok(_.isFunction( messages.splitMessage  ), "messages.splitMessage should be a function")
    t.ok(_.isFunction( messages.splitMessages ), "messages.splitMessages should be a function")

    t.end()
  })

  //-----------------------------------
  const Message_1 = '180 <14>1 2015-03-06T06:40:23.088353+00:00 loggregator df9a0c87-9405-4b27-88ef-7e42d09747c2 [API] - - Updated app with guid df9a0c87-9405-4b27-88ef-7e42d09747c2 ({"state"=>"STOPPED"})'
  const Message_2 = `${Message_1};${Message_1}`
  const Message_3 = `${Message_2}\n${Message_2}`
  const Message_4 = `${Message_3} ${Message_3}`
  const Message = Message_1.substr(3)

  T.test("- messages.splitMessages", function(t) {
    t.equal(Message.length, 180, "the actual message should be 180 characters")

    let msgs

    msgs = messages.splitMessages(Message_1)
    t.equal(msgs.length, 1, "Message_1 should contain 1 message")
    for (let i=0; i<msgs.length; i++) {
      t.equal(msgs[i], Message, "Message_1 message not parsed correctly")
    }

    msgs = messages.splitMessages(Message_2)
    t.equal(msgs.length, 2, "Message_2 should contain 2 messages")
    for (let i=0; i<msgs.length; i++) {
      t.equal(msgs[i], Message, "Message_2 message not parsed correctly")
    }

    msgs = messages.splitMessages(Message_3)
    t.equal(msgs.length, 4, "Message_3 should contain 4 messages")
    for (let i=0; i<msgs.length; i++) {
      t.equal(msgs[i], Message, "Message_3 message not parsed correctly")
    }

    msgs = messages.splitMessages(Message_4)
    t.equal(msgs.length, 8, "Message_4 should contain 8 messages")
    for (let i=0; i<msgs.length; i++) {
      t.equal(msgs[i], Message, "Message_4 message not parsed correctly")
    }

    t.end()
  })

  //-----------------------------------
  T.test("- messages.splitMessage", function(t) {
    const msg = messages.splitMessage(Message)

    let eDate    = "2015-03-06T06:40:23.088353+00:00"
    let eMessage = 'Updated app ({"state"=>"STOPPED"})'

    t.equal(msg.component, "API",    "did not parse component correctly")
    t.equal(msg.date,      eDate,    "did not parse date correctly")
    t.equal(msg.message,   eMessage, "did not parse message correctly")

    t.end()
  })

}

//------------------------------------------------------------------------------
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
//------------------------------------------------------------------------------
