var async = require('async');
var debug = require('debug')('Bot:Slack');
var https = require('https');
var slack = {};

module.exports = slack;

if (!process.env.HUBOT_SLACK_TOKEN) {
  console.error("Missing HUBOT_SLACK_TOKEN environment variable.");
  module.exports = {};
}

function slackRequest(url, opts, callback) {
  url = 'https://slack.com/api/' + url + '?token=' + process.env.HUBOT_SLACK_TOKEN;
  for (var opt in opts) {
    if (opts.hasOwnProperty(opt)) {
      url += '&' + opt + "=" + opts[opt];
    }
  }
  debug(url);

  https.get(url, function onSlackResponse(response) {
    var data = '';
    response.setEncoding('utf-8');
    response.on('data', function (chunk) {
      data += chunk;
    });

    response.on('end', function () {
      try {
        data = JSON.parse(data);
        debug(data);
        callback(null, data);
      }
      catch (error) {
        callback(error);
      }
    });
  }).on('error', function (error) {
    console.error(error);
    callback(error);
  });
}

/**
 * List all the users in the current Slack team.
 *
 * @param callback A function to run after the list of users has been fetched and truncated.
 * @return void
 */
slack.listUsers = function listSlackUsers(callback) {
  slackRequest('users.list', {}, function (error, data) {
    if (error) {
      callback(error);
    }
    else if (!data.members) {
      callback(new Error('No members array returned from Slack.'));
    }
    else {
      callback(null, data.members.filter(function removeDeletedUsers(user) {
        return !user.is_deleted && !user.is_bot;
      }).map(function formatUsers(user) {
        return {
          id: user.id,
          name: user.profile.real_name,
          first_name: user.profile.first_name,
          email: user.profile.email
        };
      }));
    }
  });
};

slack.listUsersAndPresence = function listSlackUsersAndPresence(callback) {
  slack.listUsers(function onUsersListed(error, users) {
    if (error) {
      callback(error);
    }
    else {
      slack.getPresenceForTeam(users, callback);
    }
  });
};

slack.getPresenceForTeam = function getPresenceForTeam(users, callback) {
  async.map(
    users,
    function (user, done) {
      slackRequest('users.getPresence', {user: user.id}, function (error, result) {
        if (error) {
          done(error);
        }
        else {
          user.presence = result.presence;
          done(null, user);
        }
      });
    },
    callback
  );
};

if (!module.parent) {
  slack.listUsersAndPresence(function(error, users) {
    console.log(error, users);
  });
}
