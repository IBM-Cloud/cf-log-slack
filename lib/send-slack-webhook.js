// Licensed under the Apache License. See footer for details.

"use strict"

// for more info: https://api.slack.com/incoming-webhooks

const request = require("request")

const utils = require("./utils")

const DEBUGslack  = utils.createDebug("slack")

exports.send = send

//------------------------------------------------------------------------------
function send(webHookURL, payload) {
  DEBUGslack(`sending payload: ${utils.JS(payload)}`)

  const form = {form: {payload: `${utils.JL(payload)}`}}

  request.post(webHookURL, form, function(err, response, body){
    sendCB(webHookURL, payload, err, response, body)
  })
}

//------------------------------------------------------------------------------
function sendCB(webHookURL, payload, err, response, body) {
  DEBUGslack("webhook send response:")
  DEBUGslack(`  url:      ${webHookURL}`)
  DEBUGslack(`  payload:  ${utils.JS(payload)}`)
  DEBUGslack(`  err:      ${err}`)
  DEBUGslack(`  status:   ${response.statusCode}`)
  DEBUGslack(`  body:     ${body}`)
  //console.log("  response: ", response)
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
