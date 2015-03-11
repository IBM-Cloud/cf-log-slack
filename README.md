cf-log-slack - Cloud Foundry loggregator drain that can post to Slack
================================================================================

cf-log-slack is a log drain for the Cloud Foundry loggregator, which can post
messages to Slack.

For more info, see:

* [incoming Slack Webhook]:  <https://api.slack.com/incoming-webhooks>
* [syslog message format]:   <https://tools.ietf.org/html/rfc5424>
* [Cloud Foundry log drain]: <http://docs.cloudfoundry.org/devguide/services/log-management.html>

Here's what you need to do:

* run this app on Cloud Foundry, which will act as a log drain.  The URL of
  the log drain that you will later configure will be `<app https URL>/<channel>`;
  eg, `https://my-slack-logger.example.com/my-channel`

* create a user-provided service, that will you will bind to this app, which
  should have the same name as the channel used in the log drain URL.  With
  the example above, the user-provided service should be named `my-channel`

  This service needs can have the following credential properties:

  * url (required)
  * username (optional, same as slack payload property)
  * icon_url (optional, same as slack payload property)
  * icon_emoji (optional, same as slack payload property)
  * channel (optional, same as slack payload property)
  * username (optional, same as slack payload property)


* create another user-provided service that you will bind to the app you want
  to have the logs posted to slack.  This should be a user-provided service
  created with the -l option, whose value will be URL of the log app.  In
  the example above, it will be `https://my-slack-logger.example.com/my-channel`

Putting it all together, here's what you might be doing:

* create a new incoming Slack Webhook; eg, the URL is
  `https://hooks.slack.com/services/AAA/BBB/CCC`

* create a new user-provided service with the url in the credentials:

      cf cups my-channel -p url

  When prompted for the `url`, enter the new incoming Slack Webhook URL

* create a manifest.yml by copying manifest-sample.yml, customizing the host

* push the app

      cf push

* bind the `my-channel` service to the app

      cf bind-service cf-log-slack my-channel

* create a new user-provided service log drain; note the URL **MUST**
  be an `https://` URL and not a `http://` URL

      cf cups slack-log-drain -l https://<cf-log-slack URL>/my-channel

* bind the app you want to have the logs posted to slack, to the new log drain
  service

      cf bind-service my-favorite-app slack-log-drain

* restart things as needed, and watch the fun on Slack

hacking
================================================================================

This project uses [cake](http://coffeescript.org/#cake) as it's
build tool.  To rebuild the project continuously, use the command

    npm run watch

Other `cake` commands are available (assuming you are using npm v2) with
the command

    npm run cake -- <command here>

Run `npm run cake` to see the other commands available in the `Cakefile`.



license
================================================================================

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

<http://www.apache.org/licenses/LICENSE-2.0>

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
