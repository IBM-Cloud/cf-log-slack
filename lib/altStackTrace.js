// Licensed under the Apache License. See footer for details.

"use strict"

//------------------------------------------------------------------------------
// provides an alternate stack trace for v8; for more info, see:
//    https://code.google.com/p/v8-wiki/wiki/JavaScriptStackTraceApi
//------------------------------------------------------------------------------

const path = require("path")

const old_prepareStackTrace = Error.prepareStackTrace

//------------------------------------------------------------------------------
// enable the alternate stack trace
//------------------------------------------------------------------------------
exports.enable = function () {
  Error.prepareStackTrace = altStackTrace
}

//------------------------------------------------------------------------------
// disable the alternate stack trace
//------------------------------------------------------------------------------
exports.disable = function () {
  Error.prepareStackTrace = old_prepareStackTrace
}

//------------------------------------------------------------------------------
// called to format the stack trace
//------------------------------------------------------------------------------
function altStackTrace(error, callSites) {
  let frames = []

  // walk the callSites (stack frames)
  callSites.forEach(function(callSite) {
    let frame = {}

    // get a function name
    frame.name = callSite.getFunctionName() || callSite.getMethodName() || "<anon>"

    // get line number, file name, and directory of file
    const line = "" + callSite.getLineNumber()
    let   file = callSite.getFileName()
    let   dir  = path.dirname(file)

    // resolve path name to current dir
    dir  = path.relative(process.cwd(), dir)
    file = path.join(dir, path.basename(file))

    // build the displayed file name/line no
    frame.file = file + ":" + line

    frames.push(frame)
  })

  // calculate the longest file name/line no
  const maxFileFrame = frames.reduce(function(max, frame) {
    if (max.file.length > frame.file.length) return max

    return frame
  })

  const maxFileLen = maxFileFrame.file.length

  // build the stack frames, formatting file/line no and function
  frames = frames.map(function(frame){
    const blanks = " ".repeat(1 + maxFileLen - frame.file.length)
    return "  " + frame.file + ":" + blanks + frame.name + "()"
  })

  // return as "err.stack"
  return error + "\n" + frames.join("\n")
}

//------------------------------------------------------------------------------
// self-test
//------------------------------------------------------------------------------
if (require.main == module) {
  function a() {b()}
  function b() {c()}
  function c() {throw new Error("gotcha")}

  exports.enable()

  process.on("uncaughtException", function(err) {
    console.log("exception: " + err.stack)
  })

  a()
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
