app.factory('BeadManager', ['$http', '$q', function($http, $q) {
    var BeadManager = {
      _beadsByName : {},
      _beadsById : [],
      _loaded : false,
      load : function() {
        if(this._loaded){
          return $q.resolve();
        }
        var deferred = $q.defer();
        var that = this;

        this._beadsByName = {};
        this._beadsById = [];
        $http.get('colors.xml')
        .success(function(data) {
              var x2js = new X2JS();
              colorData = x2js.xml_str2json(data);
              for(var i = 0; i < colorData.xml.color.length; ++i) {
                var cd = colorData.xml.color[i];
                var bead = {
                  name  : cd._name,
                  id    : i,
                  red   : parseInt(cd._red),
                  green : parseInt(cd._green),
                  blue  : parseInt(cd._blue),
                  html  : that.rgbToHex(parseInt(cd._red), parseInt(cd._green), parseInt(cd._blue))
                }
                that._beadsByName[bead.name] = bead;
                that._beadsById.push(bead);
              }
              deferred.resolve();
            })
        .error(function() {
          deferred.reject();
        });

        return deferred.promise;
      },
      componentToHex : function (c) {
        var hex = c.toString(16);
        return hex.length == 1 ? "0" + hex : hex;
      },

      rgbToHex : function (r, g, b) {
        return "#" + this.componentToHex(r) + this.componentToHex(g) + this.componentToHex(b);
      },

      getBeadByName : function(name){
        return this._beadsByName[name];
      },

      getBeadById : function(id){
        return this._beadsById[id];
      }
    };
    return BeadManager;
}]);
