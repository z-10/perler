
app.controller('GridController',
['$scope', 'BeadManager', 'ImageManager', 'ImageModel',
function($scope, BeadManager, ImageManager, ImageModel) {

    $scope.init = function() {
      var pixel, index, color;
      $scope.width = ImageModel.getWidth();
      $scope.height = ImageModel.getHeight();
      $scope.data = new Array($scope.height);
      for(var i = 0; i < $scope.height; ++i)
      {
        $scope.data[i] = new Array($scope.width);
        for(var j = 0; j < $scope.width; ++j){
          $scope.data[i][j] = ImageModel.getIndex(j,i);;
        }
      }
    }

    $scope.getColor = function (x, y) {
      var index = $scope.data[y][x];
      if(index > -1) {
        return BeadManager.getBeadData(index).hex;

      }

    }

    $scope.getName = function(x,y) {
      var index = $scope.data[y][x];
      if(index > -1) {
        var data = BeadManager.getBeadData(index);
        return data.type + " : " +data.code + " : "+ data.name;
      }
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

    $scope.getFile = function () {
            ImageManager.load($scope.file, $scope)
                .then(function(result) {
                    $scope.init();
                });
        };


}]);


app.directive("ngFileSelect",function(){

  return {
    link: function($scope,el){

      el.bind("change", function(e){

        $scope.file = (e.srcElement || e.target).files[0];
        $scope.getFile();
      })

    }

  }


});
