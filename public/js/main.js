var twitterStream = angular.module('myApp', ['chart.js']);

twitterStream.controller("mainCtrl", ['$scope', 'socket', '$http',
function ($scope, socket, $http) {
  //chart labels
  $scope.labels = ["positive", "negative", 'mixed'];
  //chart colors
  $scope.colors = ['#5a8527', '#d51028', '#edd711'];
  //intial data values
  $scope.trumpDataiPhone = [0,0,0];
  $scope.trumpDataAndroid = [0,0,0];
  $scope.sandersDataiPhone = [0,0,0];
  $scope.sandersDataAndroid = [0,0,0];

  socket.on('newTweet', function (tweet) {
    console.log(tweet.created_at);
    $scope.tweet = tweet.text;
    $scope.user = tweet.user.screen_name;
    //parse source from payload
    var source = tweet.source.split('>')[1].split('<')[0].split(' ')[2];
    //all hashtags in the tweet
    var hashtags = tweet.entities.hashtags.map(function(el){
      return el.text.toLowerCase();
    });

    var sent;

    $.ajax({
      url: '/analyze?tweet=' + tweet.text,
      method: 'GET',
      success: function(data) {
        sent = data.score;
        //check source and increment for #trump tweets
        if ((hashtags.indexOf('trump') !== -1) && (sent > 0)){
          switch (source) {
            case 'iPhone': $scope.trumpDataiPhone[0]++;
            console.log('trumpiPhone');
            break;
            case 'Android': $scope.trumpDataAndroid[0]++;
            console.log('trumpAndroid');
            break;
          }
        }
        if ((hashtags.indexOf('trump') !== -1) && (sent < 0)){
          switch (source) {
            case 'iPhone': $scope.trumpDataiPhone[1]++;
            console.log($scope.trumpDataiPhone);
            console.log('trumpiPhone');
            break;
            case 'Android': $scope.trumpDataAndroid[1]++;
            console.log('trumpAndroid');
            break;
          }
        }
        if ((hashtags.indexOf('trump') !== -1) && (sent === 0)) {
          switch (source) {
            case 'iPhone': $scope.trumpDataiPhone[2]++;
            console.log($scope.trumpDataiPhone);
            console.log('trumpiPhone');
            break;
            case 'Android': $scope.trumpDataAndroid[2]++;
            console.log('trumpAndroid');
            break;
          }
        }

        //check source and increment for #feelthebern tweets
        if ((hashtags.indexOf('feelthebern') !== -1) && (sent > 0)) {
          switch (source) {
            case 'iPhone': $scope.sandersDataiPhone[0]++;
            console.log('sandersiPhone');
            break;
            case 'Android': $scope.sandersDataAndroid[0]++;
            console.log('sandersAndroid');
            break;
          }
        }
        if ((hashtags.indexOf('feelthebern') !== -1) && (sent < 0)) {
            switch (source) {
              case 'iPhone': $scope.sandersDataiPhone[1]++;
              console.log('sandersiPhone');
              break;
              case 'Android': $scope.sandersDataAndroid[1]++;
              console.log('sandersAndroid');
              break;
            }
          }
          if ((hashtags.indexOf('feelthebern') !== -1) && (sent === 0)) {
            switch (source) {
              case 'iPhone': $scope.trumpDataiPhone[2]++;
              console.log('sandersiPhone');
              break;
              case 'Android': $scope.trumpDataAndroid[2]++;
              console.log('sandersAndroid');
              break;
            }
          }
      }
    });


  }); // closes socket.on
}
]);


/*---------SOCKET IO METHODS (careful)---------*/

twitterStream.factory('socket', function ($rootScope) {
  var socket = io.connect();
  return {
    on: function (eventName, callback) {
      socket.on(eventName, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          callback.apply(socket, args);
        });
      });
    },
    emit: function (eventName, data, callback) {
      socket.emit(eventName, data, function () {
        var args = arguments;
        $rootScope.$apply(function () {
          if (callback) {
            callback.apply(socket, args);
          }
        });
      });
    }
  };
});
