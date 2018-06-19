#!/usr/bin/env /usr/local/bin/node

const request = require('request-promise-native');
const fs = require('fs');
require('dotenv').config({ path: __dirname + '/../.env' });

const reqParams = {
  uri: 'https://www.googleapis.com/youtube/v3/channels?part=statistics&id=' +
  process.env.YOUTUBE_CHANNEL_ID + '&key=' + process.env.YOUTUBE_API_KEY,
  json: true
};

request(reqParams)
  .then(async (data) => {
    if (data.items && data.items[0] && data.items[0].statistics) {

      const subCount = numberWithCommas(data.items[0].statistics.subscriberCount);
      cacheSubs(subCount);
      console.log(subCount);
      console.log('---');
      console.log('Subs: ' + numberWithCommas(data.items[0].statistics.subscriberCount));
      console.log('Views: ' + numberWithCommas(data.items[0].statistics.viewCount));
      console.log('Video\'s: ' + numberWithCommas(data.items[0].statistics.videoCount));
      console.log('---');
      console.log('Socialblade | href=https://socialblade.com/youtube/channel/UCnxrdFPXJMeHru_b4Q_vTPQ')
      console.log('Channel | href=https://www.youtube.com/savjee')
    }
  })
  .catch(async (error) => {
      console.log(await getCachedSubs() + '!');
      console.log('---');
      console.log('No internet connection.');
      console.log('This data was retrieved from cache.');
  });

function numberWithCommas(x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * 
 */
function cacheSubs(subCount){
  return new Promise((resolve, reject) => {
    fs.writeFile('/tmp/youtube-subs.cache', subCount, (err) => {
      if (err) return reject(err);

      return resolve();
    });
  });
}

function getCachedSubs(){
    return new Promise((resolve, reject) => {
      fs.readFile('/tmp/youtube-subs.cache', (err, data) => {
        if (err) return reject(err);

        return resolve(data);
      });
  });
}