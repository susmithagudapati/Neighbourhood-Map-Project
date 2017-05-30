var locations = [
    {
        title: 'IIT Bombay',
        position: {lat: 19.1334302, lng: 72.91326789999999},
        visible: ko.observable(true),
        id: 1
    },
    {
        title: 'Gateway of India',
        position: {lat: 18.9219841, lng: 72.8346543},
        visible: ko.observable(true),
        id: 2
    },
    {
        title: 'Mount Mary Basilica',
        position: {lat: 19.046508, lng: 72.82243810000001},
        visible: ko.observable(true),
        id: 3
    },
    {
        title: 'Haji Ali Dargah',
        position: {lat: 18.982747, lng:72.8089648},
        visible: ko.observable(true),
        id: 4
    },
    {
        title: 'Chhatrapati Shivaji International Airport (BOM)',
        position: {lat: 19.0895595, lng: 72.8656144},
        visible: ko.observable(true),
        id: 5
    }
];

var largeInfowindow;
var map;

var Marker = function(location) {
    var position = location.position;
    var title = location.title;
    var id = location.id;

    this.marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: title,
                    animation: null,
                    id: id
                });

    google.maps.event.addListener(this.marker, 'click', function() {
        largeInfowindow.setContent('<div>' + this.title + this.position + '</div>');
        largeInfowindow.open(map, this);
    });
};


function AppViewModel() {

    var self = this;

    self.markers = ko.observableArray([]);
    self.query = ko.observable("");
    self.results = ko.observableArray([]);
    largeInfowindow = new google.maps.InfoWindow();

    self.initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 19.1493839, lng: 72.9238321},
            zoom: 10
        });
    };

    self.populateInfoWindow = function() {
        var marker = self.markers()[this.id - 1].marker;
        largeInfowindow.setContent('<div>' + marker.title + marker.position + '</div>');
        largeInfowindow.open(map, marker);
        largeInfowindow.addListener('closeclick', function() {
            largeInfowindow.marker = null;
        });
    };

    self.filterLocations = function() {
        var results = [];
        var query = self.query().toLowerCase();
        locations.forEach(function(location) {
            if (location.title.toLowerCase().includes(query)) {
                results.push(location);
            }
        });
        return results;
    };

    self.updateList = function() {
        self.clearMarkers();
        self.results(self.filterLocations());
        self.setMarkers(self.filterLocations());
    };

    self.clearMarkers = function() {
        self.markers().forEach(function (marker) {
            marker.marker.setVisible(false);
        });
    };

    self.setMarkers = function(filterLocations) {
        filterLocations.forEach(function(location) {
            var marker = new Marker(location);
            self.markers.push(marker);
        });
    };
}

function googleError() {
    alert("Failed to load Google Maps API");
}

var viewModel;

function initialize() {

    viewModel = new AppViewModel();

    viewModel.initMap();
    viewModel.updateList();

    ko.applyBindings(viewModel);
}





