var popOpts = {closeButton:false};

var boxStyle = {
  style: {
    color: "#457FCD",
    weight: 2,
    opacity: 0.8
  }
};

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

var polyFromCorners = function(a, b) {
  return [[a[0], a[1]],
          [a[0], b[1]],
          [b[0], b[1]],
          [b[0], a[1]],
          [a[0], a[1]]];
};

var midpointFromCorners = function(a, b) {
  return [(a[0] + b[0]) / 2,
          (a[1] + b[1]) / 2];
};

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
  },
  addPolygon: function(props, coords) {
    var polygon = {
      type: "Feature",
      properties: props,
      geometry: {
        type: "Polygon",
        coordinates: coords
      }
    };
    this.features.push(polygon);
    return this;
  }
});

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
  if (e.properties && e.properties.style && e.layer.setStyle) {
    e.layer.setStyle(e.properties.style);
  }
});
map82points.addGeoJSON(wifiSample);
// for 8.3:
//map82points.addGeoJSON(wifiSampleXYLine);
// for 8.7(a)
map82points.addGeoJSON(wifiSampleGeohashLine);
map82.setView(new L.LatLng(40.761690947411594, -73.97137641906738), 16)
     .addLayer(map82base)
     .addLayer(map82points);

////
// figure 8.4
//

var map84 = new L.Map('map8.4');
var map84base = new L.StamenTileLayer('watercolor', {opacity: 0.4});
var map84polys = new L.GeoJSON();
map84polys.on('featureparse', function(e) {
  if (e.properties && e.properties.geohash) {
    e.layer.bindPopup(e.properties.geohash);
  }
  if (e.properties && e.properties.style && e.layer.setStyle) {
    e.layer.setStyle(e.properties.style);
  }
});
var map84hashes = new L.FeatureCollection();
// dr5ruzb8wnfr
map84hashes.addPolygon(
  boxStyle,
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5ruzb'))]
);
map84hashes.addPolygon(
  boxStyle,
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5ruz'))]
);
map84hashes.addPolygon(
  boxStyle,
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5ru'))]
);
map84polys.addGeoJSON(map84hashes);
map84.setView(new L.LatLng(40.75974059207392, -73.98262023925781), 13)
     .addLayer(map84base)
     .addLayer(map84polys);

////
// figure 8.5
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

var map85 = new L.Map('map8.5');
var fig85 = new L.LayerGroup();
fig85.addLayer(centralPark.mark);
fig85.addLayer(centralPark.pop);
fig85.addLayer(laGuardia.mark);
fig85.addLayer(laGuardia.pop);
fig85.addLayer(jfk.mark);
fig85.addLayer(jfk.pop);
var map85base = new L.StamenTileLayer('watercolor');
map85.setView(new L.LatLng(40.72852712420599,-73.90777587890625), 11)
     .addLayer(map85base)
     .addLayer(fig85);

////
// figure 8.7(b)
//

var wifiSampleGeohashBoxes = new L.FeatureCollection();
// wifiSampleGeohashBoxes.addPolygon(
//   boxStyle,
//   [polyFromCorners.apply(undefined, decodeGeoHash('dr5rugb'))]
// );
// wifiSampleGeohashBoxes.addPolygon(
//   boxStyle,
//   [polyFromCorners.apply(undefined, decodeGeoHash('dr5rugc'))]
// );
// wifiSampleGeohashBoxes.addPolygon(
//   boxStyle,
//   [polyFromCorners.apply(undefined, decodeGeoHash('dr5ruu1'))]
// );
// wifiSampleGeohashBoxes.addPolygon(
//   boxStyle,
//   [polyFromCorners.apply(undefined, decodeGeoHash('dr5ruu2'))]
// );
// wifiSampleGeohashBoxes.addPolygon(
//   boxStyle,
//   [polyFromCorners.apply(undefined, decodeGeoHash('dr5ruu3'))]
// );
wifiSampleGeohashBoxes.addPolygon(
  boxStyle,
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5ruu6'))]
);

wifiSampleGeohashBoxes.addPolygon(
  {style: {
     color: "#EF3236",
     weight: 2,
     opacity: 0.8
   }},
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5rug'))]
);
wifiSampleGeohashBoxes.addPolygon(
  {style: {
     color: "#EF3236",
     weight: 2,
     opacity: 0.8
   }},
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5ruu'))]
);

var map87b = new L.Map('map8.7b');
var map87bbase = new L.StamenTileLayer('watercolor', {opacity: 0.4});
var map87bpoints = new L.GeoJSON(null, {
  pointToLayer: function (latLon) {
    return new L.CircleMarker(latLon, {
      radius: 4,
      fillColor: "#457FCD",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    });
  }
});
map87bpoints.on('featureparse', function(e) {
  if (e.properties && e.properties.id) {
    e.layer.bindPopup("" + e.properties.id);
  }
  if (e.properties && e.properties.style && e.layer.setStyle) {
    e.layer.setStyle(e.properties.style);
  }
});
map87bpoints.addGeoJSON(wifiSample);
map87bpoints.addGeoJSON(wifiSampleGeohashLine);
// for 8.7(b)
map87bpoints.addGeoJSON(wifiSampleGeohashBoxes);
map87b.setView(new L.LatLng(40.761690947411594, -73.97137641906738), 15)
      .addLayer(map87bbase)
      .addLayer(map87bpoints);

////
// figure 8.8
//

var geohashNeighbors = new L.FeatureCollection();
geohashNeighbors.addPolygon(
  boxStyle,
  // dr72h8p
  [polyFromCorners([-73.97232055664062, 40.782623291015625],
                   [-73.970947265625, 40.78125]),
   // dr72hb0
   polyFromCorners([-73.970947265625, 40.782623291015625],
                   [-73.96957397460938, 40.78125]),
   // dr72hb1
   polyFromCorners([-73.96957397460938, 40.782623291015625],
                   [-73.96820068359375, 40.78125]),
   // dr5ruxz
   polyFromCorners([-73.97232055664062, 40.78125],
                   [-73.970947265625, 40.779876708984375]),
   // dr5ruzb
   polyFromCorners([-73.970947265625, 40.78125],
                   [-73.96957397460938, 40.779876708984375]),
   // dr5ruzc
   polyFromCorners([-73.96957397460938, 40.78125],
                   [-73.96820068359375, 40.779876708984375]),
   // dr5ruxx
   polyFromCorners([-73.97232055664062, 40.779876708984375],
                   [-73.970947265625, 40.77850341796875]),
   // dr5ruz8
   polyFromCorners([-73.970947265625, 40.779876708984375],
                   [-73.96957397460938, 40.77850341796875]),
   // dr5ruz9
   polyFromCorners([-73.96957397460938, 40.779876708984375],
                   [-73.96820068359375, 40.77850341796875])]
);

geohashNeighbors.addPoint(
  {id: "dr72h8p"},
  midpointFromCorners([-73.97232055664062, 40.782623291015625],
                      [-73.970947265625, 40.78125])
);
geohashNeighbors.addPoint(
  {id: "dr72hb0"},
  midpointFromCorners([-73.970947265625, 40.782623291015625],
                      [-73.96957397460938, 40.78125])
);
geohashNeighbors.addPoint(
  {id: "dr72hb1"},
  midpointFromCorners([-73.96957397460938, 40.782623291015625],
                      [-73.96820068359375, 40.78125])
);
geohashNeighbors.addPoint(
  {id: "dr5ruxz"},
  midpointFromCorners([-73.97232055664062, 40.78125],
                      [-73.970947265625, 40.779876708984375])
);
geohashNeighbors.addPoint(
  {id: "dr5ruzb"},
  midpointFromCorners([-73.970947265625, 40.78125],
                      [-73.96957397460938, 40.779876708984375])
);
geohashNeighbors.addPoint(
  {id: "dr5ruzc"},
  midpointFromCorners([-73.96957397460938, 40.78125],
                      [-73.96820068359375, 40.779876708984375])
);
geohashNeighbors.addPoint(
  {id: "dr5ruxx"},
  midpointFromCorners([-73.97232055664062, 40.779876708984375],
                      [-73.970947265625, 40.77850341796875])
);
geohashNeighbors.addPoint(
  {id: "dr5ruz8"},
  midpointFromCorners([-73.970947265625, 40.779876708984375],
                      [-73.96957397460938, 40.77850341796875])
);
geohashNeighbors.addPoint(
  {id: "dr5ruz9"},
  midpointFromCorners([-73.96957397460938, 40.779876708984375],
                      [-73.96820068359375, 40.77850341796875])
);

var map88 = new L.Map('map8.8');
var map88base = new L.StamenTileLayer('watercolor', {opacity: 0.4});
var map88points = new L.GeoJSON(null, {
  pointToLayer: function (latLon) {
    return new L.CircleMarker(latLon, {
      radius: 4,
      fillColor: "#457FCD",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 1
    });
  }
});
map88points.on('featureparse', function(e) {
  if (e.properties && e.properties.id) {
    e.layer.bindPopup("" + e.properties.id);
  }
  if (e.properties && e.properties.style && e.layer.setStyle) {
    e.layer.setStyle(e.properties.style);
  }
});
map88points.addGeoJSON(geohashNeighbors);
map88.setView(new L.LatLng(40.780557679970805, -73.97030353546143), 16)
     .addLayer(map88base)
     .addLayer(map88points);

////
// figure 8.9
//

var knnResults = new L.FeatureCollection();
knnResults.addPoint({score: 1}, [-73.97000655, 40.76098703])
          .addPoint({score: 2}, [-73.96873588, 40.76107453])
          .addPoint({score: 3}, [-73.96880474, 40.76048717])
          .addPoint({score: 4}, [-73.96974993, 40.76170883])
          .addPoint({score: 5}, [-73.96881406, 40.76110682]);

var geohashOverlay = new L.FeatureCollection();
var geohashOverlayProps = {
  style: {
    color: "#457FCD",
    weight: 2,
    opacity: 0.2
  }
};
geohashOverlay.addPolygon(
  $.extend({geohash: 'dr5ruu2'}, geohashOverlayProps),
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5ruu2'))]);
geohashOverlay.addPolygon(
  $.extend({geohash: 'dr5ruu8'}, geohashOverlayProps),
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5ruu8'))]);
geohashOverlay.addPolygon(
  $.extend({geohash: 'dr5ruu9'}, geohashOverlayProps),
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5ruu9'))]);
geohashOverlay.addPolygon(
  $.extend({geohash: 'dr5ruu3'}, geohashOverlayProps),
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5ruu3'))]);
geohashOverlay.addPolygon(
  $.extend({geohash: 'dr5ruu1'}, geohashOverlayProps),
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5ruu1'))]);
geohashOverlay.addPolygon(
  $.extend({geohash: 'dr5ruu0'}, geohashOverlayProps),
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5ruu0'))]);
geohashOverlay.addPolygon(
  $.extend({geohash: 'dr5rusp'}, geohashOverlayProps),
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5rusp'))]);
geohashOverlay.addPolygon(
  $.extend({geohash: 'dr5rusr'}, geohashOverlayProps),
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5rusr'))]);
geohashOverlay.addPolygon(
  $.extend({geohash: 'dr5rusx'}, geohashOverlayProps),
  [polyFromCorners.apply(undefined, decodeGeoHash('dr5rusx'))]);

var map89 = new L.Map('map8.9');
var map89base = new L.StamenTileLayer('watercolor', {opacity: 0.4});
var map89results = new L.GeoJSON(null, {
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
map89results.on('featureparse', function(e) {
  if (e.properties && e.properties.score) {
    e.layer.bindPopup("" + e.properties.score);
    if (e.properties.score == 1 && e.layer.setStyle) {
      e.layer.setStyle({fillColor: "#EF3236"});
    }
  }
  if (e.properties && e.properties.style && e.layer.setStyle) {
    e.layer.setStyle(e.properties.style);
  }
});
map89results.addGeoJSON(knnResults);
var map89geohash = new L.GeoJSON();
map89geohash.on('featureparse', function(e) {
  if (e.properties && e.properties.geohash) {
    e.layer.bindPopup("" + e.properties.geohash);
  }
  if (e.properties && e.properties.style && e.layer.setStyle) {
    e.layer.setStyle(e.properties.style);
  }
});
map89geohash.addGeoJSON(geohashOverlay);
var map89all = new L.GeoJSON(null, {
  pointToLayer: function(latLon) {
    return new L.CircleMarker(latLon, {
      radius: 4,
      fillColor: "#CECECE",
      color: "#000",
      weight: 1,
      opacity: 1,
      fillOpacity: 0.8
    });
  }
});
map89all.addGeoJSON(wifiAll);
map89.setView(new L.LatLng(40.761690947411594, -73.97137641906738), 16)
     .addLayer(map89base)
     .addLayer(map89geohash)
     .addLayer(map89all)
     .addLayer(map89results);
