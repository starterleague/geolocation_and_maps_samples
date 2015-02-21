# Geolocation Code Samples

This project is a collection of small samples of many different problems you can solve combining Geolocation and Google Maps JS Api. Every folder in this project is a different scenario.

## Sample1: gmaps_integration

This sample uses a simple jQuery Plugin I wrote long ago to let you pass an address to the Google Maps api and it will find the lat/long automatically and plot the address on the map.

If you check the content of the index.html file the first I do is to make sure I have both Google Maps javascript and jQuery in place (lines 10 and 11). Line 12 I'm also including my jQuery Plugin.

The only element I have on my HTML is a Div with the ID "mapCanvas". The final thing in the file is this script

```javascript
  <script type="text/javascript" charset="utf-8">
    $(function() {
      $("#mapCanvas").geolocate("30 N Racine Chicago");
    });
  </script>
```

The function between $() is only executed when the page is completely loaded, after that I grab the mapCanvas div using `$("#mapCanvas")` and I call the `gelocate` function (created with my jQuery Plugin) passing the adress I want to plot on the map.

## Sample2: html5_geolocation

This sample uses the browser's geolocation api to find where the current user is at the moment. There's no need to use Gems or rely on IP or phone numbers if all you need is to get the current position.

When the user clicks on the button the `getLocation()` function is called. This function checks if the browser has the navigator api available (old browsers doesn't support it) and them it calls the getCurrentPosition function that comes with the browser. In the parenthesis I'm passing the function that should called after the getCurrentPosition works. The showPosition function just gets the lat/long and display in the HTML.

If you want to pass that value in a Rails form you could have a hidden field with latitude and longitude and pass the values to these fields instead of displaying in the HTML.

## Sample3: rails_geolocation

This Sample has a list of Places in the seeds file. So make sure to migrate the database and also run `rake db:migrate` before running `rails server`.

If you check the Gemfile I'm using the **Geocoder** gem. With this gem I can add the columns latitude and longitude on my model Place (check the migrations) and add the following lines into my Place class:


```ruby
class Place < ActiveRecord::Base
  geocoded_by :address
  after_validation :geocode
end

```

Now if you visit the index.html.erb of places you can see a little bit of Javascript. All the code is doing is to transform all places into a json and I use this json as a data source for my Google Maps, plotting every place I have in the database.

Understanding the Javascript code line by line:

```javascript
  window.DataSet = <%= @places.to_json.html_safe %>;
```

In this line I'm creating a DataSet variable and using erb tags to tranform my @places variable I created in my PlacesController into a json object. That way I can use the json in my Javascript code.


```javascript
  window.onload = function() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(function (position) {
    ...
```

I'm waiting for the page to load and after that I check if the browser has support for geolocation. I'm gonna use the browser geolocation to center the map based when the user is.


```javascript
  var currentPosition = new google.maps.LatLng(
    position.coords.latitude,
    position.coords.longitude
  );
```

In the code above I grab the users current position and I create a Google LatLng object with this.

```javascript
  var map = new google.maps.Map(document.getElementById('map'), {
    center: currentPosition,
    zoom: 15,
    mapTypeId: google.maps.MapTypeId.ROADMAP
  });
```

Now I create a map variable that has a Google Maps object and set the center to be users' current position, I adjust the zoom and I set the style of the map. Now the final thing I need is to plot all the places:

```javascript
  for (var i = 0; i < window.DataSet.length; i++) {
    var place = window.DataSet[i];
    var position = new google.maps.LatLng(place.latitude, place.longitude);

    var marker = new google.maps.Marker({
        position: position,
        map: map,
        draggable: false
    });
  };
```

I use a for loop to loop through all the places in the DataSet variable. For each place I create a Google LatLng object with the place's position. The final thing is to call google.maps.Marker passing the map we created before, the position I justed created and also setting the marker to not be draggable, that's the moment when the marker is plotted.

*PS: Is this best way to load that from the Backend into a javascript pieced of code? Nope! But that's a good start.*