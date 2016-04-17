(function() {

  var app = angular.module('app', []);

  app.filter('videoSize', function() {
    var sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    return function(bytes) {
      var posttxt = 0;
      if (bytes == 0 || !bytes)
        return 'n/a';
      if (bytes < 1024) {
        return Number(bytes) + "" + sizes[posttxt];
      }
      while (bytes >= 1024) {
        posttxt++;
        bytes = bytes / 1024;
      }
      return bytes.toPrecision(4) + "" + sizes[posttxt];
    };
  });

  app.filter('videoDate', function() {
    return function(time) {
      var now = new Date().getTime();
      var diff = (now - time) / 1000;
      return diff + " seconds ago";
    };
  });

  // get videos from currect tab
  app.service('videoService', ['$log', '$q', function($log, $q) {

    var deferred = $q.defer();
    chrome.tabs.getSelected(null, function(tab) {
      var videos = chrome.extension.getBackgroundPage().tab2videos[tab.id];
      $log.debug('found videos', videos);
      deferred.resolve({
        tabId: tab.id,
        videos: videos
      });
    });

    return {
      videos: deferred.promise
    };
  }]);

  // chrome cast tv service
  app.service('tvService', ['$log', function($log) {
    $log.debug('tsService, chrome.cast', chrome.cast);

    return {
      play: function(tabId, video) {
        $log.debug('playing', video);
        chrome.tabs.sendMessage(tabId, {
          id: "video",
          video: video
        }, function() {
          window.close();
        });
      }
    };
  }]);

  // popup controller
  app.controller('PopupCtrl', ['$scope', '$log', 'videoService', 'tvService',
    function($scope, $log, videoService, tvService) {
      $log.debug('in popup controller');
      $scope.videos = [];
      $scope.tabId = null;
      videoService.videos.then(function(msg) {
        $scope.videos = msg.videos;
        $scope.tabId = msg.tabId;
      });
      $scope.play = function(video) {
        tvService.play($scope.tabId, video);
      };
    }
  ]);

})();