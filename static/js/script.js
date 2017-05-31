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
    },
    {
        title: 'Elephanta Caves',
        position: {lat: 18.9633474, lng: 72.9314864},
        visible: ko.observable(true),
        id: 6
    },
    {
        title: 'Sanjay Gandhi National Park',
        position: {lat: 19.2210347, lng: 72.9067922},
        visible: ko.observable(true),
        id: 7
    },
    {
        title: 'Siddhivinayak Temple',
        position: {lat: 19.0168986, lng: 72.8303439},
        visible: ko.observable(true),
        id: 8
    },
    {
        title: 'Essel World',
        position: {lat: 19.2327242, lng: 72.8055083},
        visible: ko.observable(true),
        id: 9
    },
    {
        title: 'Babulnath Temple',
        position: {lat: 18.9592844, lng: 72.8087115},
        visible: ko.observable(true),
        id: 10
    },
    {
        title: 'Powai Lake',
        position: {lat: 19.1265972, lng: 72.90619029999999},
        visible: ko.observable(true),
        id: 11
    },
    {
        title: 'Jahenger Art Gallery',
        position: {lat: 18.9274559, lng: 72.83170299999999},
        visible: ko.observable(true),
        id: 12
    },
    {
        title: 'Navi Mumbai',
        position: {lat: 19.0330488, lng: 73.0296625},
        visible: ko.observable(true),
        id: 13
    },
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
            zoom: 11
        });

        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
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
