# Licensed under the Apache License. See footer for details.

require "cakex"

child_process = require("child_process")

#-------------------------------------------------------------------------------
task "watch", "watch for source file changes, restart server", -> taskWatch()
task "serve", "start server",                                  -> taskServe()
task "test",  "run tests",                                     -> taskTest()

WatchSpec = "*.js lib/**/* tests/**/*"

mkdir "-p", "tmp"

#-------------------------------------------------------------------------------
taskWatch = ->
  watchIter()

  watch
    files: WatchSpec.split " "
    run:   watchIter

  watch
    files: "Cakefile"
    run: (file) ->
      return unless file == "Cakefile"
      log "Cakefile changed, exiting"
      exit 0

#-------------------------------------------------------------------------------
watchIter = (file) ->
  taskTest()
  taskServe()

#-------------------------------------------------------------------------------
taskServe = ->
  log "restarting server"

  process.env.DEBUG = "loggy:*"
  daemon.start "server", "node", ["server"]

#-------------------------------------------------------------------------------
taskTest = ->
  log "running tests ..."

  cmd  = "node"
  args = [ "tests/test" ]
  opts = { stdio: "inherit" }

  child_process.spawnSync(cmd, args, opts)

#-------------------------------------------------------------------------------
cleanDir = (dir) ->
  mkdir "-p", dir
  rm "-rf", "#{dir}/*"

#-------------------------------------------------------------------------------
# Licensed under the Apache License, Version 2.0 (the "License");
# you may not use this file except in compliance with the License.
# You may obtain a copy of the License at
#
#    http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
#-------------------------------------------------------------------------------
