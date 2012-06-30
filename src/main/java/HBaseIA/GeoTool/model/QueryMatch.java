package HBaseIA.GeoTool.model;

public class QueryMatch {
  public String id;
  public String hash;
  public double lon, lat;

  public QueryMatch(String id, String hash, double lon, double lat) {
    this.id = id;
    this.hash = hash;
    this.lon = lon;
    this.lat = lat;
  }

  @Override
  public String toString() {
    StringBuilder sb = new StringBuilder();
    sb.append("<QueryMatch: ")
      .append(id).append(", ")
      .append(hash).append(", ")
      .append(lon).append(", ")
      .append(lat).append(">");
    return sb.toString();
  }
}
