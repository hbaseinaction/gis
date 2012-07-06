package HBaseIA.GIS.model;

public class QueryMatch {
  public String id;
  public String hash;
  public double lon, lat;
  public double distance = Double.NaN;

  public QueryMatch(String id, String hash, double lon, double lat) {
    this.id = id;
    this.hash = hash;
    this.lon = lon;
    this.lat = lat;
  }

  @Override
  public String toString() {
    return String.format("<QueryMatch: %4s, %12s, %3.4f, %3.4f, %2.5f >",
                         id, hash, lon, lat, distance);
  }
}
