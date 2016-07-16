app.factory('ImageModel', ['$q', 'BeadManager', function($q, BeadManager) {
  var ImageModel = {
    width : 0,
    height : 0,
    data : null,
    _pixel : null,
    used : new Array(BeadManager.getPaletteSize()).fill(0),
    load : function(canvas){
      this.width = canvas.width;
      this.height = canvas.height;

      this.data = new Array(this.height);
      for(var y = 0; y < this.height; ++y)
      {
        this.data[y] = new Array(this.width);
        for(var x = 0; x < this.width; ++x){
          _pixel = canvas.getContext('2d').getImageData(x, y, 1, 1).data;
          this.data[y][x] = {
            r:_pixel[0],
            g:_pixel[1],
            b:_pixel[2],
            a:_pixel[3]
          };
        }
      }
      this.reIndex();
    },

    reIndex : function(){
      this.used.fill(0);
      for(var y = 0; y < this.height; ++y)
      {
        for(var x = 0; x < this.width; ++x){
          _pixel = this.data[y][x];
          _pixel.index = BeadManager.findClosest(_pixel.r, _pixel.g, _pixel.b);
          this.used[_pixel.index] += 1;
        }
      }
    },

    getPixel : function(x,y){
      if(x < 0 || x >= this.width || y < 0 || y >= this.height){
        return {r:0,g:0,b:0,a:0};
      }
      return this.data[y][x].pixel;
    },

    getIndex : function (x, y) {
      if(x < 0 || x >= this.width || y < 0 || y >= this.height){
        return -1;
      }
      _pixel = this.data[y][x];
      return _pixel.index;
    },

    getWidth : function(){
      return this.width;
    },

    getHeight : function(){
      return this.height;
    }

  }
  return ImageModel;
}]);
