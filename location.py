from geopy.geocoders import Nominatim
import sys

def reverse_geocode(lat, long):
    geolocator = Nominatim(user_agent="reverse_geocode_app")
    location = geolocator.reverse((lat, long), exactly_one=True)
    if location:
        return location.raw['display_name']
    else:
        return "No address found"

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python3 location.py <latitude> <longitude>")
        sys.exit(1)

    try:
        latitude = float(sys.argv[1])
        longitude = float(sys.argv[2])
    except ValueError:
        print("Latitude and longitude must be valid numbers")
        sys.exit(1)

    address = reverse_geocode(latitude, longitude)
    print(address)
