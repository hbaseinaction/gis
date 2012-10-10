# HBase In Action: GIS

[http://www.manning.com/dimidukkhurana][0]

## Compiling the project

Code is managed by maven. Be sure to install maven on your platform
before running these commands. Also be aware that HBase is not yet
supported on the OpenJDK platform, the default JVM installed on most
modern Linux distributions. You'll want to install the Oracle (Sun)
Java 6 runtime and make sure it's configured on your `$PATH` before
you continue. Again, on Ubuntu, you may find the [`oab-java6`][1]
utility to be of use.

To build a self-contained jar:

    $ mvn package

The jar created using this by default will allow you to interact with
HBase running in standalone mode on your local machine. If you want
to interact with a remote (possibly fully distributed) HBase
deployment, you can put your hbase-site.xml file in the src/main/resources
directory before compiling the jar.

## External resources

The data used in this example comes from the New York City open data
program. It was pre-processed to simplify the example. The original
shapefile can be found at [https://nycopendata.socrata.com/d/ehc4-fktp][2].

The figures used through this chapter were hand-generated using the
[Leaflet][3] cartography library for JavaScript. The tileset used is
[Watercolor][4] from Stamen Design and is built from
[OpenStreetMap][5] data. The JavaScript geohash library used to aid
those figures is from [David Troy][6] and was slightly modified to produce
the desired effect.  All code used to generate the figures is
under the [`figures`][7] directory.

## Using this GIS example

Before running the queries, you'll need to create a table populate it
with our sample data. For example, to populate a table called `wifi`,
issue these commands:

    $ echo "create 'wifi', 'a'" | hbase shell
    $ java -cp target/hbaseia-gis-1.0.0.jar \
      HBaseIA.GeoTool.Ingest wifi data/wifi_4326.txt

Once your data is loaded, two queries have been implemented. The first
one is k-nearest neighbors. This query is implemented entirely
client-side and can be run immediately.

    $ java -cp target/hbaseia-gis-1.0.0.jar \
      HBaseIA.GIS.KNNQuery -73.97000655 40.76098703 5

The second query is for all points within a query polygon. There are
two implementations, a local and remove version. The local version is
implemented entirely client-side and can be run like the `KNNQuery`.

    $ java -cp target/hbaseia-gis-1.0.0.jar \
      HBaseIA.GIS.WithinQuery local \
      "POLYGON ((-73.980844 40.758703, \
                 -73.987214 40.761369, \
                 -73.990839 40.756400, \
                 -73.984422 40.753642, \
                 -73.980844 40.758703))"

The remote version is partially implemented in a custom `Filter` which
requires installation. This requires editing your
`$HBASE_HOME/conf/hbase-env.sh` file. Add the jar built of out this
repository to your HBASE_CLASSPATH environment variable.

    # Extra Java CLASSPATH elements.  Optional.
    export HBASE_CLASSPATH=/path/to/hbaseia-gis-1.0.0.jar

Restart HBase.

Now you can run the query:

    $ java -cp target/hbaseia-gis-1.0.0.jar \
      HBaseIA.GIS.WithinQuery remote \
      "POLYGON ((-73.980844 40.758703, \
                 -73.987214 40.761369, \
                 -73.990839 40.756400, \
                 -73.984422 40.753642, \
                 -73.980844 40.758703))"

## License

Copyright (C) 2012 Nick Dimiduk, Amandeep Khurana

Distributed under the [Apache License, version 2.0][8], the same as HBase.

[0]: http://www.manning.com/dimidukkhurana
[1]: https://github.com/flexiondotorg/oab-java6
[2]: https://nycopendata.socrata.com/d/ehc4-fktp
[3]: http://leaflet.cloudmade.com/
[4]: http://maps.stamen.com/#watercolor
[5]: http://www.openstreetmap.org
[6]: https://github.com/davetroy/geohash-js/
[7]: https://github.com/hbaseinaction/gis/tree/master/figures
[8]: http://www.apache.org/licenses/LICENSE-2.0.html
