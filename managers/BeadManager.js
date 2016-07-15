app.factory('BeadManager', ['$http', '$q', function($http, $q) {
    var BeadManager = {
      _cache : {},
      findClosest : function(r,g,b){
        var id = r + "-" + g + "-" + b,
        lab1,
        index = -1,
        minDist = 10000000,
        dist,
        lab2;
        if(this._cache.hasOwnProperty(id)){
          return this._cache[id];
        }
        lab1 = window.RGB_TO_LAB(r,g,b);
        for(var i = 0; i < window.GLOBAL_PALETTE.length; ++i){
          lab2 = window.GLOBAL_PALETTE[i].lab;
          dist = window.DELTA_E_00(lab1[0],lab1[1],lab1[2], lab2[0],lab2[1],lab2[2]);
          if(dist <= minDist){
            index = i;
            minDist = dist;
          }
        }
        this._cache[id] = index;
        return index;

      },
      getBeadData : function(index){
        return window.GLOBAL_PALETTE[index];
      }
    };
    return BeadManager;
}]);
