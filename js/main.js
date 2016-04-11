L.mapbox.accessToken = 'pk.eyJ1IjoiYWxleGxldmFjaGVyIiwiYSI6ImNpa3lkcW90cjAxNHJ1OWtza3l3ampkZTEifQ.8fnKQh9ZikZtU60vxzwSvw';

var geocoder = L.mapbox.geocoder('mapbox.places');
var map = L.mapbox.map('map', 'mapbox.dark').setView([37.8, -96], 5);

var markers = new L.MarkerClusterGroup();
var myLayer = new L.layerGroup();

$.getJSON( "./resources/banklistVer2.json", function( list ) {
    var i = 0;
    while (i < list.length) {
        (function(i) {
            var current = list[i];
            geocoder.query(list[i].City + ', ' + list[i].ST + ' United States', function(err, data) {
                if (data.latlng !== undefined) {
                    // Display summary when user hovers over marker
                    var summary = list[i]['Bank Name']; 
                        // + ' closed on ' + list[i]['Closing Date'] + '.';
                    var marker = L.marker(new L.LatLng(data.latlng[0], data.latlng[1]), {
                        icon: L.mapbox.marker.icon({
                            'marker-symbol': 'town-hall',
                            'marker-size': 'large',
                            'marker-color': '0044FF'
                        }),
                        title: summary
                    });
                    var details = 
                        '<b>' + list[i]['Bank Name'] + '</b>' +
                        '<br/> Date Closed: ' + list[i]['Closing Date'] +
                        '<br/> Acquired By: ' + list[i]['Acquiring Institution'];
                    // Display details when user clicks on marker
                    marker.bindPopup(details);
                    markers.addLayer(marker);
                    myLayer.addLayer(marker);
                }
            })
        })(i);
        i++;
    }
});

// STATES
var statesLayer = L.geoJson(statesData,  {
    style: getStyle,
    onEachFeature: onEachFeature
});

function getStyle(feature) {
    return {
        weight: 2,
        opacity: 0.1,
        color: 'black',
        fillOpacity: 0.7,
        fillColor: getColor(feature.properties.density)
    };
}

function getColor(d) {
    return d > 90 ? '#8c2d04' :
        d > 70  ? '#cc4c02' :
        d > 60  ? '#ec7014' :
        d > 20  ? '#fe9929' :
        d > 10   ? '#fec44f' :
        d > 5   ? '#fee391' :
        d > 2   ? '#fff7bc' :
        '#ffffe5';
}
var popup = new L.Popup({ autoPan: false });

function onEachFeature(feature, layer) {
    layer.on({
        mousemove: mousemove,
        mouseout: mouseout
    });
}
var closeTooltip;

function mousemove(e) {
    var layer = e.target;

    popup.setLatLng(e.latlng);
    popup.setContent('<div class="marker-title">' + layer.feature.properties.name + '</div>' +
        layer.feature.properties.density + ' banks');

    if (!popup._map) popup.openOn(map);
    window.clearTimeout(closeTooltip);

    // highlight feature
    layer.setStyle({
        weight: 3,
        opacity: 0.3,
        fillOpacity: 0.9
    });

    if (!L.Browser.ie && !L.Browser.opera) {
        layer.bringToFront();
    }
}

function mouseout(e) {
    statesLayer.resetStyle(e.target);
    closeTooltip = window.setTimeout(function() {
        map.closePopup();
    }, 100);
}
// END STATES

map.addLayer(markers);
var layers = {
    //Markers: myLayer,
    Cluster: markers,
    States: statesLayer
};

L.control.layers(layers).addTo(map);


// Define start and end axis for timeline by Brian
// Month of Jan = 0 in JS
var startDate = new Date(2000, 0);
var endDate = new Date(2016, 0);
// Create timeline using D3 library by Brian
d3.select('#slider3').call(d3.slider().scale(d3.time.scale()
     .domain([startDate, endDate]))
     .axis(d3.svg.axis()).value([startDate, endDate]) 
);

// Adding credits bar at bottom
var credits = L.control.attribution({
  prefix: '<a href="http://catalog.data.gov/dataset/fdic-failed-bank-list" target="_blank">Dataset From DATA.GOV</a>'
}).addTo(map);