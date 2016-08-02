'use strict';

const config = require('./config');
const Gh = require('github');
const Slack = require('slack-node');
const usersRepo = {
    'alan-andrade': '@alan'
}

let github = new Gh();
let slack = new Slack(config.slack);

github.authenticate(config.github);
github.issues.getForRepo({
    user: 'lumoslabs',
    repo: 'LumosityMobile'
}, function (err, res) {
    // console.log(res);

    var issuesForUser = {};

    for (var issue of res) {
        if (!issue.labels.length) {
            if (!issuesForUser[issue.user.login]) {
                issuesForUser[issue.user.login] = []
            }

            issuesForUser[issue.user.login].push(issue.html_url);
        }
    }

    for (var user in issuesForUser) {
        var issues = issuesForUser[user];
        var slackUser = usersRepo[user];

        console.log(slackUser);

        slack.api('chat.postMessage', {
            text: 'Remember to add a tag to your pull requests: ' + issues.join('\n'),
            channel: slackUser
        }, function(err, response){
            console.log(response);
        });
    }
});

