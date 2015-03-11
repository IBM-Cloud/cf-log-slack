// Licensed under the Apache License. See footer for details.

"use strict"

const http = require("http")
const path = require("path")

const hapi   = require("hapi")
const cfenv  = require("cfenv")
const concat = require("concat-stream")

const utils         = require("./lib/utils")
const altStackTrace = require("./lib/altStackTrace")
const messages      = require("./lib/messages")
const slack         = require("./lib/send-slack-webhook")

const pkg = require("./package.json")

let appEnvOpts = {}
try {
  // allow overrides when running locally
  appEnvOpts.vcap = require("./tmp/vcap.json")
}
catch(e) {}

exports.version = pkg.version
exports.main    = main

//------------------------------------------------------------------------------
const appEnv = cfenv.getAppEnv(appEnvOpts)

utils.appName = appEnv.name

const DEBUGinit  = utils.createDebug("init")
const DEBUGserver= utils.createDebug("server")
const DEBUGexit  = utils.createDebug("exit")
const DEBUGerror = utils.createDebug("error")
const DEBUGdrain = utils.createDebug("drain")

if (require.main == module) main()

//------------------------------------------------------------------------------
function main() {
  DEBUGinit("starting")

  DEBUGinit("enabling alternate stack trace")
  altStackTrace.enable()

  DEBUGinit("adding exit handler")
  process.on("exit", function(code) {
    DEBUGexit("code: " + code)
  })

  DEBUGinit("adding uncaught exception handler")
  process.on("uncaughtException", function(err) {
    DEBUGerror("exception: " + err.stack)
    process.exit(1)
  })

  //----------------------------------------------------------------------------
  let server = http.createServer(requestHandler)

  console.log("server starting on " + appEnv.url)
  server.listen(appEnv.port, appEnv.bind, function() {
    console.log("server started  on " + appEnv.url)
  })
}

//------------------------------------------------------------------------------
function requestHandler(request, response) {
  if (request.headers["content-type"] != "text/plain") {
    return sendLogResponse(response)
  }

  const channel = path.basename(request.url)

  const webHookInfo = appEnv.getServiceCreds(channel)

  if (null == webHookInfo) {
    DEBUGdrain(`request for unbound service: ${channel}`)
    return sendLogResponse(response)
  }

  if (null == webHookInfo.url) {
    DEBUGdrain(`request for service: ${channel}, but service has no "url" property`)
    return sendLogResponse(response)
  }

  let contentStream = concat(function(content) {
    processLogMessages(webHookInfo, content)
  })

  request.pipe(contentStream)

  sendLogResponse(response)
}

//------------------------------------------------------------------------------
function processLogMessages(webHookInfo, content) {
  DEBUGdrain(`content: ${content}`)
  let msgs = messages.splitMessages(content)

  for (let i=0; i<msgs.length; i++) {
    let msg = messages.splitMessage(msgs[i])
    DEBUGdrain(`msg: ${msg}`)

    processLogMessage(webHookInfo, msg)
  }
}

//------------------------------------------------------------------------------
function processLogMessage(webHookInfo, msg) {
  // msg = {
  //   date:      string
  //   component: string
  //   message:   string
  // }

  let payload    = {
    text:       `${msg.component}: ${msg.message}`,
    icon_emoji: ":computer:"
  }

  copyOverride(webHookInfo, payload, "username")
  copyOverride(webHookInfo, payload, "icon_url")
  copyOverride(webHookInfo, payload, "icon_emoji")
  copyOverride(webHookInfo, payload, "channel")
  copyOverride(webHookInfo, payload, "username")

  slack.send(webHookInfo.url, payload)
}

//------------------------------------------------------------------------------
function copyOverride(webHookInfo, payload, property) {
  if (webHookInfo[property]) payload[property] = webHookInfo[property]
}

//------------------------------------------------------------------------------
function sendLogResponse(response) {
  response.writeHead(200, {"Content-Type": "text/plain"})
  response.end("Hello, world!")
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
