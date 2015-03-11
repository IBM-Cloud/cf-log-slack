// Licensed under the Apache License. See footer for details.

const path = require("path")

const _     = require("underscore")

const debug = require("./debug")

const pkg = require("../package.json")

exports.PROGRAM = pkg.name
exports.VERSION = pkg.version

exports.appName     = pkg.name
exports.JS          = JS
exports.JL          = JL
exports.createDebug = createDebug

//------------------------------------------------------------------------------
function createDebug(name) {
  return debug.createDebug(`${exports.appName}:${name}`)
}

//------------------------------------------------------------------------------
function JS(object) { return JSON.stringify(object) }
function JL(object) { return JSON.stringify(object, null, 4) }

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
