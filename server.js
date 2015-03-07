// Licensed under the Apache License. See footer for details.

const http = require("http")

const hapi  = require("hapi")
const cfenv = require("cfenv")

const debug         = require("./lib/debug")
const altStackTrace = require("./lib/altStackTrace")

const pkg = require("./package.json")

exports.version = pkg.version
exports.main    = main

//------------------------------------------------------------------------------
const appEnv = cfenv.getAppEnv()

const DEBUGinit  = debug.createDebug(appEnv.name + ":init")
const DEBUGserver= debug.createDebug(appEnv.name + ":server")
const DEBUGexit  = debug.createDebug(appEnv.name + ":exit")
const DEBUGerror = debug.createDebug(appEnv.name + ":error")

const DEBUGdrain = debug.createDebug(appEnv.name + ":drain")

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

  http.createServer(function (request, response) {
    console.log("")
    console.log(request.method, request.headers)
    console.log("")
    request.pipe(process.stdout)

    response.writeHead(200, {"Content-Type": "text/plain"})
    response.end("")
  }).listen(appEnv.port)

  console.log("Server running at " + appEnv.url)


  if (false) {
    //------------------------------------------------------------------------------
    DEBUGinit("creating Hapi server")
    const server = new hapi.Server()

    //------------------------------------------------------------------------------
    DEBUGinit("setting host/port for server")
    server.connection({host: appEnv.bind, port: appEnv.port})

    //------------------------------------------------------------------------------
    DEBUGinit("setting up Hapi error handler to debug log and exit")
    server.on("request-error", function (request, err) {
      DEBUGerror("exception: " + err.stack)
      process.exit(1)
    })

    //------------------------------------------------------------------------------
    DEBUGinit("setting up route for static files")
    server.route({
      method:  "GET",
      path:    "/{param*}",
      handler: { directory: { path: "www" } }
    })

    //------------------------------------------------------------------------------
    DEBUGinit("setting up route for drains")
    server.route({
      method:  "*",
      path:    "/drain/{drain}",
      handler: handleDrain,
      config: {
        payload: {
          output: "data",
          parse:  ""
        }

      }
    })

    //------------------------------------------------------------------------------
    DEBUGserver("starting on: " + appEnv.url)

    server.start(function() {
      DEBUGserver("started  on: " + appEnv.url)
    })
  }
}

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

<14>1 2015-03-06T06:40:44.129826+00:00 loggregator df9a0c87-9405-4b27-88ef-7e42d09747c2 [App/0] - - node-stuff: newrelic configured
regex: /.*? loggregator .*? [((.*?)/.*?)] .*? .*? (.*)
*/

//------------------------------------------------------------------------------
function handleDrain(request, reply) {
  DEBUGdrain("request for drain " + request.params.drain)
  reply("")
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
