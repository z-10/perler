angular.module('PerlerApp').factory("fileReader",["$q", "$log", "ImageManager", function($q, $log){
        var onLoad = function(reader, deferred, scope) {
              return function () {
                  scope.$apply(function () {
                      deferred.resolve(reader.result);
                  });
              };
          };

          var onError = function(reader, deferred, scope) {
                return function () {
                    scope.$apply(function () {
                        deferred.reject(reader.result);
                    });
                };
            };

          var getReader = function(deferred, scope) {
              var reader = new FileReader();
              reader.onload = onLoad(reader, deferred, scope);
              reader.onerror = onError(reader, deferred, scope);

              return reader;
          };

          var readAsDataURL = function (file, scope) {
              var deferred = $q.defer();

              var reader = getReader(deferred, scope);
              reader.readAsDataURL(file);

              return deferred.promise;
          };

          return {
              readAsDataUrl: readAsDataURL
          };
}]);

angular.module('PerlerApp').controller('GridController',
['$scope', 'BeadManager', 'ImageManager', 'fileReader',
function($scope, BeadManager, imageManager, fileReader) {

    $scope.init = function() {
      var pixel, index, color;
      $scope.width = imageManager.getWidth();
      $scope.height = imageManager.getHeight();
      $scope.data = new Array($scope.height);
      for(var i = 0; i < $scope.height; ++i)
      {
        $scope.data[i] = new Array($scope.width);
        for(var j = 0; j < $scope.width; ++j){
          pixel = imageManager.getPixel(j,i);
          index = (pixel[3] > 0) ? BeadManager.findClosest(pixel[0], pixel[1], pixel[2]) : -1;
          $scope.data[i][j] = index;
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

            fileReader.readAsDataUrl($scope.file, $scope)
                .then(function(result) {
                    imageManager.load(result);
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
