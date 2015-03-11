// Licensed under the Apache License. See footer for details.

"use strict"

//------------------------------------------------------------------------------
// This module is used to parse the body of a POST request to a Cloud Foundry
// log drain, sent via http.
//
// AFAIK, this format is documented here: https://tools.ietf.org/html/rfc5424,
// but the format I see from loggregator doesn't completely match this.
//
// heuristics!
//------------------------------------------------------------------------------
exports.splitMessages = splitMessages
exports.splitMessage  = splitMessage

/*
messages from log drain:
method: POST
content: (first is 184 bytes)
180 <14>1 2015-03-06T06:40:23.088353+00:00 loggregator df9a0c87-9405-4b27-88ef-7e42d09747c2 [API] - - Updated app with guid df9a0c87-9405-4b27-88ef-7e42d09747c2 ({"state"=>"STOPPED"})
180 <14>1 2015-03-06T06:40:24.189079+00:00 loggregator df9a0c87-9405-4b27-88ef-7e42d09747c2 [API] - - Updated app with guid df9a0c87-9405-4b27-88ef-7e42d09747c2 ({"state"=>"STARTED"})
177 <14>1 2015-03-06T06:40:24.194799+00:00 loggregator df9a0c87-9405-4b27-88ef-7e42d09747c2 [DEA] - - Starting app instance (index 0) with guid df9a0c87-9405-4b27-88ef-7e42d09747c2
132 <14>1 2015-03-06T06:40:44.129826+00:00 loggregator df9a0c87-9405-4b27-88ef-7e42d09747c2 [App/0] - - node-stuff: newrelic configured

- will maybe need to chunk de-code the content into separate messages
- replace /with guid \W+//
*/

//------------------------------------------------------------------------------
function splitMessages(string) {
  string = "" + string

  const pattern = /^[\s\S]*?(\d+)([\s\S]*)$/

  let result = []

  while (true) {
    let match = string.match(pattern)
    if (!match) break

    const len   = parseInt(match[1], 10)
    const rest  = match[2]

    if (isNaN(len)) break

    result.push(rest.substr(0, len))
    string = rest.substr(len)
  }

  return result
}

/*
 <14>1 2015-03-06T06:40:23.088353+00:00 loggregator df9a0c87-9405-4b27-88ef-7e42d09747c2 [API] - - Updated app with guid df9a0c87-9405-4b27-88ef-7e42d09747c2 ({"state"=>"STOPPED"})
*/


//------------------------------------------------------------------------------
function splitMessage(string) {
  const pattern = /^\s*\S+\s+(\S+)\s+\S+\s+\S+\s+\[(.*?)\]\s+\S+\s+\S+\s+(.*)$/
  const match = string.match(pattern)
  if (!match) return null

  let   message  = match[3]
  const gPattern = /with guid \S+\s/

  message = message.replace(gPattern, "")

  return {
    date:      match[1],
    component: match[2],
    message:   message
  }
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
