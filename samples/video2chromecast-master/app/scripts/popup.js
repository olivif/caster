/*global angular:false */
'use strict';

var app = angular.module('v2cPopup', []);

app.filter('videoSize', function() {
  var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  return function(bytes) {
    var posttxt = 0;
    if (bytes === 0 || !bytes) {
      return 'n/a';
    }
    if (bytes < 1024) {
      return Number(bytes) + '' + sizes[posttxt];
    }
    while (bytes >= 1024) {
      posttxt++;
      bytes = bytes / 1024;
    }
    return bytes.toPrecision(4) + '' + sizes[posttxt];
  };
});

app.filter('videoDate', function() {
  return function(time) {
    var now = new Date().getTime();
    var diff = (now - time) / 1000;
    return diff + ' seconds ago';
  };
});

// get videos from currect tab
app.service('videoService', ['$log', '$q',
  function($log, $q) {

    var deferred = $q.defer();
    chrome.tabs.getSelected(null, function(tab) {
      var videos = chrome.extension.getBackgroundPage().videos[tab.id];
      $log.debug('found videos', videos);
      deferred.resolve({
        tabId: tab.id,
        videos: videos
      });
    });

    return {
      videos: deferred.promise
    };
  }
]);

// messenger
app.service('messenger', ['$q',
  function($q) {
    return {
      send: function(tabId, msgId, video) {
        var deferred = $q.defer();
        chrome.tabs.sendMessage(tabId, {
          id: msgId,
          video: video
        }, function() {
          deferred.resolve(arguments);
        });
        return deferred.promise;
      }
    };
  }
]);


// popup ctrl
app.controller('PopupCtrl', ['$scope', '$log', 'videoService', 'messenger',
  function($scope, $log, videoService, messenger) {
    $log.debug('in popup controller');
    $scope.videos = [];
    $scope.tabId = null;
    videoService.videos.then(function(msg) {
      $scope.videos = msg.videos;
      $scope.tabId = msg.tabId;
    });
    $scope.play = function(video) {
      messenger.send($scope.tabId, 'video', video).then(function() {
        window.close();
      });
    };
    $scope.highlight = function(video) {
      messenger.send($scope.tabId, 'highlight', video);
    };
    $scope.unhighlight = function(video) {
      messenger.send($scope.tabId, 'unhighlight', video);
    };
  }
]);