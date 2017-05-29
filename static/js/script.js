
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

var map, largeInfowindow;

var Marker = function(location) {
    var position = location.position;
    var title = location.title;
    var id = location.id;

    this.marker = new google.maps.Marker({
                    position: position,
                    map: map,
                    title: title,
                    animation: google.maps.Animation.DROP,
                    id: id
                });

    google.maps.event.addListener(this.marker, 'click', function() {
        largeInfowindow.setContent('<div>' + this.title + this.position + '</div>');
        largeInfowindow.open(map, this);
    });
};


function AppViewModel() {

    var self = this;

    self.map = null;
    self.markers = ko.observableArray([]);
    self.query = ko.observable("");
    largeInfowindow = new google.maps.InfoWindow();

    self.initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 19.1493839, lng: 72.9238321},
            zoom: 10,
        });
    };

    self.setMarkers = function() {
        locations.forEach(function(location) {
            var marker = new Marker(location);
            self.markers.push(marker);
        });
    };

    self.clearMarkers = function() {

    };

    self.searchMarkers = function(){

    };
}

function googleError() {
    alert("Failed to load Google Maps API");
}

var viewModel;

function initialize() {

    viewModel = new AppViewModel();

    viewModel.initMap();
    viewModel.setMarkers();

    ko.applyBindings(viewModel);
};





