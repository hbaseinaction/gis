package HBaseIA.GeoTool.model;

import java.awt.geom.Point2D;
import java.util.Comparator;

import org.apache.log4j.Logger;

public class DistanceComparator implements Comparator<QueryMatch> {
  static final Logger LOG = Logger.getLogger(DistanceComparator.class);

  Point2D origin;

  public DistanceComparator(double lon, double lat) {
    this.origin = new Point2D.Double(lon, lat);
  }

  public int compare(QueryMatch o1, QueryMatch o2) {
    double dist1 = origin.distance(o1.lon, o1.lat);
    double dist2 = origin.distance(o2.lon, o2.lat);
    if (dist1 < 0 || dist2 < 0)
      LOG.warn("negative distance detected!");
    return Double.compare(dist1, dist2);
  }
}
