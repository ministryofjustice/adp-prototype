var angular = require('angular');
var $ = require('jquery');

require('mojular');
require('mojular-moj-elements/assets/scripts/modules/skip-to-content');
require('./modules/file-upload');
require('./modules/tabs');

Mojular.init();

var app = angular.module('adp', []);

app.factory('getCases', function($http) {
  return function() {
    return $http({
      url: window.BASE_PATH + 'cases.json'
    });
  };
});

app.directive('cases', function(getCases) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: window.BASE_PATH + 'partials/cases.html',
    link: function($scope, $element) {
      getCases().then(function(res) {
        $scope.cases = res.data;
      });
    }
  };
});

app.directive('messages', function(getCases) {
  return {
    restrict: 'E',
    replace: true,
    templateUrl: window.BASE_PATH + 'partials/messages.html',
    link: function($scope, $element) {
      getCases().then(function(res) {
        $scope.messages = window.messages;
      });

      $scope.postMessage = function() {
        if(!$scope.newMessage) {
          return;
        }
        $scope.messages.push({
          id: $scope.messages.length,
          body: $scope.newMessage,
          author: 'Bob Smith',
          author_type: 'advocate',
          created_at: (new Date()).toLocaleString('en-GB')
        });
        $scope.newMessage = '';

        var $messagesScreen = $($element).find('.messages-screen');
        $messagesScreen.animate({
          scrollTop: $messagesScreen.height()
        });
      };
    }
  };
});

app.filter('reverse', function() {
  return function(items) {
    return items.slice().reverse();
  };
});

angular.bootstrap(document.body, ['adp']);
