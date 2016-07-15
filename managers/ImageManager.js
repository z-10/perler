app.factory('ImageManager', ['$q', function($q) {
  var ImageManager = {
    canvas: document.createElement('canvas'),
    img : document.createElement("img"),
    load : function(image){
      this.img.src = image;
      this.canvas.width = this.img.width;
      this.canvas.height = this.img.height;
      this.canvas.getContext('2d').drawImage(this.img, 0, 0, this.img.width, this.img.height);
    },
    getPixel : function(x,y){
      if(!this.canvas){
        return [0,0,0,0];
      }
      return this.canvas.getContext('2d').getImageData(x, y, 1, 1).data;
    },
    getWidth : function(){
      return this.canvas ? this.canvas.width : 0;
    },

    getHeight : function(){
      return this.canvas ? this.canvas.height : 0;
    }

  }
  return ImageManager;
}]);
