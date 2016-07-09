angular.module('PerlerApp').controller('GridController', ['$scope', 'BeadManager', function($scope, BeadManager) {
    $scope.width = 29;
    $scope.height = 29;

    $scope.init = function(width, height) {
      $scope.width = width;
      $scope.height = height;
      $scope.data = new Array(height);
      for(var i = 0; i < height; ++i)
      {
        $scope.data[i] = new Array(width);
        $scope.data[i].fill(-1);
      }
    }

    $scope.getColor = function (x, y) {
      var index = $scope.data[y][x];
      return BeadManager.getBeadById(index).html;
    }

    $scope.setColor = function(x,y) {
        $scope.data[y][x] = 100;
    }

    $scope.isSet = function(x, y) {
      return $scope.data[y][x] > -1;
    }

    $scope.remove = function(x,y) {
      $scope.data[y][x] = -1;
    }

    BeadManager.load().then(function()
    {
      $scope.init(29,29);
    });

}]);
