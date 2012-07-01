var popOpts = {closeButton:false};

L.PopupLeft = L.Popup.extend({
  initialize: function(options, source) {
    opts = {
      className: $.trim(options.className) + ' leaflet-popup-left'
    };
    opts = $.extend(true, opts, options);
    L.Util.setOptions(this, opts);
    this._source = source;
  },
   _updateLayout: function() {
     this._container.style.width = '';
     this._container.style.whitespace = 'nowrap';
     var width = this._container.offsetWidth;
     width = (width > this.options.maxWidth ?
              this.options.maxWidth :
              (width < this.options.minWidth ? this.options.minWidth : width));
     width += this._tipContainer.offsetWidth;
     this._container.style.width = width + 'px';
     this._container.style.whiteSpace = '';
     this._containerWidth = this._container.offsetWidth;
   }
});

var contentStr = function(name, lat, lon) {
  return "<p><b>" + name + "</b><br />" + lat + ", " + lon + "</p>";
};

var addMarker = function(x) {
  x.mark = new L.Marker(x.position);
  return x;
};

var addPopup = function(x, dir) {
  opts = $.extend(true, {offset: x.mark.options.icon.popupAnchor}, popOpts);
  if (!dir) {
    dir = 'top';
  }

  if (dir === 'top') {
    x.pop = new L.Popup(opts).setContent(x.content)
                             .setLatLng(x.position);
  } else if (dir === 'left') {
    x.pop = new L.PopupLeft(opts).setContent(x.content)
                                 .setLatLng(x.position);
  }
  return x;
};

////
// figure 8.1
//

var bogota = {
  position: new L.LatLng(4.598056,-74.075833),
  content: contentStr("Bogotá", "4.60°N", "74.08°W")
};
addMarker(bogota);
addPopup(bogota);

var nyc = {
  position: new L.LatLng(40.664167,-73.938611),
  content: contentStr("New York City", "40.66°N", "73.94°W")
};
addMarker(nyc);
addPopup(nyc);

var dc = {
  position: new L.LatLng(38.895111,-77.036667),
  content: contentStr("Washington, DC", "38.90°N", "77.04°W")
};
addMarker(dc);
addPopup(dc);

var map81 = new L.Map('map8.1');
var fig81 = new L.LayerGroup();
fig81.addLayer(dc.mark);
fig81.addLayer(dc.pop);
fig81.addLayer(nyc.mark);
fig81.addLayer(nyc.pop);
fig81.addLayer(bogota.mark);
fig81.addLayer(bogota.pop);
var map81base = new L.StamenTileLayer('watercolor');
map81.setView(new L.LatLng(26.03704188651584,-78.0908203125), 4)
     .addLayer(map81base)
     .addLayer(fig81);

////
// figures 8.2, 8.3, 8.6
//

L.FeatureCollection = L.Class.extend({
  initialize: function() {
    this.type = "FeatureCollection";
    this.features = [];
  },
  addPoint: function(props, coords) {
    var point = {
      type: "Feature",
      properties: props,
      geometry: {
        type: "Point",
        coordinates: coords
      }
    };
    this.features.push(point);
    return this;
  },
  addLineString: function(props, coords) {
    var line = {
      type: "Feature",
      properties: props,
      geometry: {
        type: "LineString",
        coordinates: coords
      }
    };
    this.features.push(line);
    return this;
  }
});

var wifiSample = new L.FeatureCollection();
wifiSample.addPoint({id: 441, name: "Fedex Kinko's"}, [-73.96974759, 40.75890919])
          .addPoint({id: 442, name: "Fedex Kinko's"}, [-73.96993203, 40.75815170])
          .addPoint({id: 463, name: "Smilers 707"}, [-73.96873588, 40.76107453])
          .addPoint({id: 472, name: "Juan Valdez NYC"}, [-73.96880474, 40.76048717])
          .addPoint({id: 219, name: "Startegy Atrium and Cafe"}, [-73.96974993, 40.76170883])
          .addPoint({id: 388, name: "Barnes & Noble"}, [-73.96978387, 40.75850573])
          .addPoint({id: 525, name: "McDonalds"}, [-73.96746533, 40.76089302])
          .addPoint({id: 564, name: "Public Telephone"}, [-73.96910155, 40.75873061])
          .addPoint({id: 593, name: "Starbucks"}, [-73.97000655, 40.76098703]);

var wifiSampleXYLine = new L.FeatureCollection();
wifiSampleXYLine.addLineString(
  {style: {
     color: "#457FCD",
     weight: 2,
     opacity: 0.8
   }},
  [[-73.96746533, 40.76089302],
   [-73.96873588, 40.76107453],
   [-73.96880474, 40.76048717],
   [-73.96910155, 40.75873061],
   [-73.96974759, 40.75890919],
   [-73.96974993, 40.76170883],
   [-73.96978387, 40.75850573],
   [-73.96993203, 40.75815170],
   [-73.97000655, 40.76098703]]);

var wifiSampleGeohashLine = new L.FeatureCollection();
wifiSampleGeohashLine.addLineString(
  {style: {
     color: "#457FCD",
     weight: 2,
     opacity: 0.8
   }},
    [[-73.96993203, 40.75815170],
     [-73.96978387, 40.75850573],
     [-73.96974759, 40.75890919],
     [-73.96910155, 40.75873061],
     [-73.96880474, 40.76048717],
     [-73.97000655, 40.76098703],
     [-73.96974993, 40.76170883],
     [-73.96873588, 40.76107453],
     [-73.96746533, 40.76089302]]);

var map82 = new L.Map('map8.2');
var map82base = new L.StamenTileLayer('watercolor', {opacity: 0.4});
var map82points = new L.GeoJSON(null, {
  pointToLayer: function (latLon) {
    return new L.CircleMarker(latLon, {
      radius: 8,
      fillColor: "#457FCD",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    });
  }
});
map82points.on('featureparse', function(e) {
  if (e.properties && e.properties.id) {
    e.layer.bindPopup("" + e.properties.id);
  }
  if (e.geometryType == "LineString") {
    console.log(e);
  }
  if (e.properties && e.properties.style && e.layer.setStyle) {
    e.layer.setStyle(e.properties.style);
  }
});
map82points.addGeoJSON(wifiSample);
// for 8.3:
//map82points.addGeoJSON(wifiSampleXYLine);
// for 8.6
map82points.addGeoJSON(wifiSampleGeohashLine);
map82.setView(new L.LatLng(40.761690947411594, -73.97137641906738), 16)
     .addLayer(map82base)
     .addLayer(map82points);

////
// figure 8.4
//

var centralPark = {
  position: new L.LatLng(40.78, -73.97),
  content: contentStr("Central Park", "40.78°N", "73.97°W")
};
addMarker(centralPark);
addPopup(centralPark);

var laGuardia = {
  position: new L.LatLng(40.77, -73.87),
  content: contentStr("LaGuardia Airport", "40.77°N", "73.87°W")
};
addMarker(laGuardia);
addPopup(laGuardia);

var jfk = {
  position: new L.LatLng(40.64, -73.78),
  content: contentStr("JFK International", "40.64°N", "73.78°W")
};
addMarker(jfk);
addPopup(jfk);

var map84 = new L.Map('map8.4');
var fig84 = new L.LayerGroup();
fig84.addLayer(centralPark.mark);
fig84.addLayer(centralPark.pop);
fig84.addLayer(laGuardia.mark);
fig84.addLayer(laGuardia.pop);
fig84.addLayer(jfk.mark);
fig84.addLayer(jfk.pop);
var map84base = new L.StamenTileLayer('watercolor');
map84.setView(new L.LatLng(40.72852712420599,-73.90777587890625), 11)
     .addLayer(map84base)
     .addLayer(fig84);
