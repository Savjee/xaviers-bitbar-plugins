#!/usr/bin/env /usr/local/bin/node

const request = require('request-promise-native');
require('dotenv').config({ path: __dirname + '/../.env' });

const reqParams = {
  uri: 'https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' +
  process.env.YOUTUBE_CHANNEL_ID + '&key=' + process.env.YOUTUBE_API_KEY,
  json: true
};

request(reqParams)
  .then(data => {
    if (data.items && data.items[0] && data.items[0].statistics) {
      console.log(numberWithCommas(data.items[0].statistics.subscriberCount));
      console.log('---');
      console.log('Views: ' + numberWithCommas(data.items[0].statistics.viewCount));
      console.log('Video\'s: ' + numberWithCommas(data.items[0].statistics.videoCount));
    }
  })
  .catch(error => {
      console.log('Error');
      console.log('---');
      console.log(error);
  });

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}