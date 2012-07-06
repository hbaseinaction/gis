package HBaseIA.GIS.filter;

import java.io.DataInput;
import java.io.DataOutput;
import java.io.IOException;
import java.util.List;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.hadoop.hbase.KeyValue;
import org.apache.hadoop.hbase.filter.FilterBase;
import org.apache.hadoop.hbase.util.Bytes;

import com.vividsolutions.jts.geom.Coordinate;
import com.vividsolutions.jts.geom.Geometry;
import com.vividsolutions.jts.geom.GeometryFactory;
import com.vividsolutions.jts.io.ParseException;
import com.vividsolutions.jts.io.WKTReader;

public class WithinFilter extends FilterBase {

  static final byte[] TABLE = "wifi".getBytes();
  static final byte[] FAMILY = "a".getBytes();
  static final byte[] ID = "id".getBytes();
  static final byte[] X_COL = "lon".getBytes();
  static final byte[] Y_COL = "lat".getBytes();

  static final Log LOG = LogFactory.getLog(WithinFilter.class);

  final GeometryFactory factory = new GeometryFactory();
  Geometry query = null;
  boolean exclude = false;

  public WithinFilter() {}

  public WithinFilter(Geometry query) {
    this.query = query;
  }

  @Override
  public boolean hasFilterRow() { return true; }

  @Override
  public void filterRow(List<KeyValue> kvs) {
    double lon = Double.NaN;
    double lat = Double.NaN;

    if (null == kvs || 0 == kvs.size()) {
      LOG.debug("skipping empty row.");
      this.exclude = true;
      return;
    }

    for (KeyValue kv : kvs) {
      byte[] qual = kv.getQualifier();
      if (Bytes.equals(qual, X_COL))
        lon = Double.parseDouble(new String(kv.getValue()));
      if (Bytes.equals(qual, Y_COL))
        lat = Double.parseDouble(new String(kv.getValue()));
    }

    if (Double.isNaN(lat) || Double.isNaN(lon)) {
      LOG.debug(kvs.get(0).getKeyString() + " is not a point.");
      this.exclude = true;
      return;
    }

    Coordinate coord = new Coordinate(lon, lat);
    Geometry point = factory.createPoint(coord);
    if (!query.contains(point)) {
      this.exclude = true;
    }
  }

  @Override
  public boolean filterRow() {
    if (LOG.isDebugEnabled())
      LOG.debug("filter applied. " + (this.exclude ? "rejecting" : "keeping"));
    return this.exclude;
  }

  @Override
  public void reset() {
    this.exclude = false;
  }

  @Override
  public void write(DataOutput out) throws IOException {
    out.writeUTF(query.toText());
  }

  @Override
  public void readFields(DataInput in) throws IOException {
    String wkt = in.readUTF();
    WKTReader reader = new WKTReader(factory);
    try {
      this.query = reader.read(wkt);
	} catch (ParseException e) {
      throw new IOException(e);
	}
  }  
}
