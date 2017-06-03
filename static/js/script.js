// Data of different locations being marked on the map.
var locations;
locations = [
    {
        title: "IIT Bombay",
        position: {lat: 19.1334302, lng: 72.91326789999999},
        visible: ko.observable(true),
        id: 1
    },
    {
        title: "Gateway of India",
        position: {lat: 18.9219841, lng: 72.8346543},
        visible: ko.observable(true),
        id: 2
    },
    {
        title: "Mount Mary Basilica",
        position: {lat: 19.046508, lng: 72.82243810000001},
        visible: ko.observable(true),
        id: 3
    },
    {
        title: "Haji Ali Dargah",
        position: {lat: 18.982747, lng: 72.8089648},
        visible: ko.observable(true),
        id: 4
    },
    {
        title: "Chhatrapati Shivaji International Airport (BOM)",
        position: {lat: 19.0895595, lng: 72.8656144},
        visible: ko.observable(true),
        id: 5
    },
    {
        title: "Elephanta Caves",
        position: {lat: 18.9633474, lng: 72.9314864},
        visible: ko.observable(true),
        id: 6
    },
    {
        title: "Sanjay Gandhi National Park",
        position: {lat: 19.2210347, lng: 72.9067922},
        visible: ko.observable(true),
        id: 7
    },
    {
        title: "Siddhivinayak Temple",
        position: {lat: 19.0168986, lng: 72.8303439},
        visible: ko.observable(true),
        id: 8
    },
    {
        title: "Essel World",
        position: {lat: 19.2327242, lng: 72.8055083},
        visible: ko.observable(true),
        id: 9
    },
    {
        title: "Babulnath Temple",
        position: {lat: 18.9592844, lng: 72.8087115},
        visible: ko.observable(true),
        id: 10
    },
    {
        title: "Powai Lake",
        position: {lat: 19.1265972, lng: 72.90619029999999},
        visible: ko.observable(true),
        id: 11
    },
    {
        title: "Jahenger Art Gallery",
        position: {lat: 18.9274559, lng: 72.83170299999999},
        visible: ko.observable(true),
        id: 12
    },
    {
        title: "Navi Mumbai",
        position: {lat: 19.0330488, lng: 73.0296625},
        visible: ko.observable(true),
        id: 13
    }
];

var infowindow;
var map;

// Marker class that initializes the marker with it's data.
var Marker = function(location, markers) {
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

    // function that opens infowindow when clicked on that particular marker.
    google.maps.event.addListener( this.marker, 'click', function() {
        markers.forEach( function(marker) {
            if (marker.marker.getAnimation() !== null) {
                marker.marker.setAnimation(null);
            }
        });
        this.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.setContent('<div>' + this.title + this.position + '</div>');
        infowindow.open(map, this);
    });
};


function AppViewModel() {

    var self = this;

    self.markers = ko.observableArray([]);
    self.query = ko.observable("");
    infowindow = new google.maps.InfoWindow();

    // initMap function initializes the map on page load.
    self.initMap = function() {
        map = new google.maps.Map(document.getElementById('map'), {
            center: {lat: 19.1493839, lng: 72.9238321},
            zoom: 11
        });

        // Event listener function centers the map when window resizes.
        google.maps.event.addDomListener(window, "resize", function() {
            var center = map.getCenter();
            google.maps.event.trigger(map, "resize");
            map.setCenter(center);
        });
    };

    // populateInfoWindow function opens the infowindow on clicking the marker by
    //populating it with the title and position.
    self.populateInfoWindow = function() {
        self.markers().forEach( function(marker) {
            if (marker.marker.getAnimation() !== null) {
                marker.marker.setAnimation(null);
            }
        });
        var marker = self.markers()[this.id - 1].marker;
        marker.setAnimation(google.maps.Animation.BOUNCE);
        infowindow.setContent('<div>' + marker.title + marker.position + '</div>');
        infowindow.open(map, marker);
        infowindow.addListener('closeclick', function() {
            infowindow.marker = null;
        });
    };

    // filterMarkers function filters the markers based on the search input given.
    self.filterMarkers = function() {
        var results = [];
        var query = self.query().toLowerCase();
        self.markers().forEach(function( marker ) {
            if (marker.marker.title.toLowerCase().includes(query)) {
                results.push(marker);
            }
        });
        return results;
    };

    //filterLocations function filters the locations list based on the input query.
    self.filterLocationList = function() {
        var results = [];
        var query = self.query().toLowerCase();
        locations.forEach( function( location ) {
            if(location.title.toLowerCase().includes(query)) {
                results.push( location );
            }
        });
        return results;
    };

    // updateList function updates the locations list and set Markers on the map when the
    // page loads. Also, updates the list whenever search is done.
    self.updateList = function() {
        self.clearMarkers();
        self.clearList();
        self.setLocations( self.filterLocationList() );
        self.setMarkers( self.filterMarkers() );
    };

    // clearList initially empties the locations list to filter the locations.
    self.clearList = function() {
        locations.forEach( function( location ) {
            location.visible( false );
        });
    };

    // clearMarkers erases the markers on the map to trigger search query.
    self.clearMarkers = function() {
        self.markers().forEach(function (marker) {
            marker.marker.setVisible( false );
        });
    };

    //setLocations function displays the filtered locations in the side-menu.
    self.setLocations = function( filterLocations ) {
        filterLocations.forEach( function( location ) {
            location.visible( true );
        });
    };

    //setMarkers function displays the filtered markers on the map
    self.setMarkers = function(filterMarkers) {
        filterMarkers.forEach( function( marker ) {
            marker.marker.setVisible( true );
            if(self.query()) {
                marker.marker.setAnimation(google.maps.Animation.BOUNCE);
            } else {
                marker.marker.setAnimation(google.maps.Animation.DROP);
            }
        });
    };

    // setMarkers creates marker instances for every location when the page loads and
    // when the search is processed.
    self.createMarkers = function() {
        locations.forEach(function(location) {
            var marker = new Marker(location, self.markers());
            self.markers.push(marker);
        });
    };
}

// function that alerts the error message when map doesn't load
function googleError() {
    alert("Failed to load Google Maps API");
}

var viewModel;

function initialize() {

    viewModel = new AppViewModel();

    viewModel.initMap();
    viewModel.createMarkers();

    ko.applyBindings(viewModel);
}

function mediaSize() {

    // condition for smaller screens to keep the page responsive
    if (window.matchMedia('(max-width: 767px)').matches) {
        $('.sidebar').addClass('hide');
        $('.responsive-header').removeClass('hide');

        //hamburger icon to open the locations list
        $('.hamburger').click(function(){
            $('#map').css('left','360px');
            $('.hamburger').addClass('hide');
            $('.cross').removeClass('hide');
        });

        //cross icon to close the locations list
        $('.cross').click(function(){
            $('#map').css('left','0px');
            $('.hamburger').removeClass('hide');
            $('.cross').addClass('hide');
        });
    }

    // bring back to default design when window size increases
    else{
        $('.sidebar').addClass('show');
        $('.responsive-header').addClass('hide');
    }
}

$('document').ready(function() {
    window.addEventListener('resize', mediaSize, false);
});