// Licensed under the Apache License. See footer for details.

"use strict"

const _ = require("underscore")

const pkg = require("..")

//------------------------------------------------------------------------------
module.exports = tester

//------------------------------------------------------------------------------
function tester(T) {

  //----------------------------------------------------------------------------
  T.test("- version should be a semver", function(t) {
    let match = pkg.version.match(/^\d+\.\d+\.\d+(.*)$/)

    t.ok(match, "package version not acceptable: ${pkg.version}")
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
