app.factory('ImageManager', ['$q', 'ImageModel', function($q, ImageModel) {
  var ImageManager = {
    canvas: document.createElement('canvas'),
    img : document.createElement("img"),
    load : function(file, scope){
      var that = this,
          deferred = $q.defer(),
          onLoad = function(reader, deferred, scope){
            return function () {
              var image = reader.result;
              that.img.src = image;
              that.canvas.width = that.img.width;
              that.canvas.height = that.img.height;
              that.canvas.getContext('2d').drawImage(that.img, 0,0);
              ImageModel.load(that.canvas);
              ImageModel.reIndex();
              scope.$apply(function () {
                deferred.resolve(true);
              });
            };
        },
        onError = function(reader, deferred, scope){
          return function () {
            scope.$apply(function () {
              deferred.reject(reader.error);
            });
          }
        },
        reader = new FileReader();
        reader.onload = onLoad(reader, deferred, scope);
        reader.onerror = onError(reader, deferred, scope);
        reader.readAsDataURL(file);

        return deferred.promise;
    },
  }
  return ImageManager;
}]);
