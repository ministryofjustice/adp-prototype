var angular = require('angular');

require('mojular');
require('mojular-moj-elements/assets/scripts/modules/skip-to-content');
require('./modules/file-upload');
require('./modules/tabs');

Mojular.init();

var app = angular.module('adp', []);

app.factory('getCases', function($http) {
  return function() {
    return $http({
      url: '/cases.json'
    });
  }
});

app.directive('cases', function(getCases) {
  return {
    restrict: 'A',
    replace: true,
    templateUrl: '/partials/cases.html',
    link: function($scope, $element) {
      getCases().then(function(res) {
        $scope.cases = res.data;
      });
    }
  };
});

angular.bootstrap(document.body, ['adp']);
