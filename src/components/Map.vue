<template>
  <div ref="chartdiv" class="map" />
</template>

<script>
import * as am5 from "@amcharts/amcharts5";
import * as am5map from "@amcharts/amcharts5/map";
import am5geodata_worldLow from "@amcharts/amcharts5-geodata/worldLow";
import am5themes_Animated from "@amcharts/amcharts5/themes/Animated";
//import { useCarsStore } from "../store/carsStore";
//import am5geodata_data_countries from "@amcharts/amcharts5-geodata/data/countries";
// const carsStore = useCarsStore();

export default {
  props: {
    arr: Array,
  },
  name: "HelloWorld",
  mounted() {
    let root = am5.Root.new(this.$refs.chartdiv);
    console.log(this.arr);
    root.setThemes([am5themes_Animated.new(root)]);

    let chart = root.container.children.push(
      am5map.MapChart.new(root, {
        panX: "rotateX",
        panY: "rotateY",
        projection: am5map.geoOrthographic(),
        paddingBottom: 20,
        paddingTop: 20,
        paddingLeft: 20,
        paddingRight: 20,
      })
    );

    var polygonSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {
        geoJSON: am5geodata_worldLow,
      })
    );

    polygonSeries.mapPolygons.template.setAll({
      tooltipText: "{name}",
      toggleKey: "active",
      interactive: true,
    });

    polygonSeries.mapPolygons.template.states.create("hover", {
      fill: root.interfaceColors.get("primaryButtonHover"),
    });

    polygonSeries.mapPolygons.template.states.create("active", {
      fill: root.interfaceColors.get("primaryButtonHover"),
    });

    // Create series for background fill
    // https://www.amcharts.com/docs/v5/charts/map-chart/map-polygon-series/#Background_polygon
    var backgroundSeries = chart.series.push(
      am5map.MapPolygonSeries.new(root, {})
    );
    backgroundSeries.mapPolygons.template.setAll({
      fill: root.interfaceColors.get("alternativeBackground"),
      fillOpacity: 0.1,
      strokeOpacity: 0,
    });
    backgroundSeries.data.push({
      geometry: am5map.getGeoRectangle(90, 180, -90, -180),
    });

    var graticuleSeries = chart.series.unshift(
      am5map.GraticuleSeries.new(root, {
        step: 10,
      })
    );

    graticuleSeries.mapLines.template.set("strokeOpacity", 0.1);

    // Set up events
    var previousPolygon;

    polygonSeries.mapPolygons.template.on("active", function (active, target) {
      if (previousPolygon && previousPolygon != target) {
        previousPolygon.set("active", false);
      }
      if (target.get("active")) {
        selectCountry(target.dataItem.get("id"));
      }
      previousPolygon = target;
    });

    function selectCountry(id) {
      var dataItem = polygonSeries.getDataItemById(id);
      var target = dataItem.get("mapPolygon");
      if (target) {
        var centroid = target.geoCentroid();
        if (centroid) {
          chart.animate({
            key: "rotationX",
            to: -centroid.longitude,
            duration: 1500,
            easing: am5.ease.inOut(am5.ease.cubic),
          });
          chart.animate({
            key: "rotationY",
            to: -centroid.latitude,
            duration: 1500,
            easing: am5.ease.inOut(am5.ease.cubic),
          });
        }
      }
    }

    var pointSeries = chart.series.push(
      am5map.ClusteredPointSeries.new(root, {
        latitudeField: "latitude",
        longitudeField: "longitude",
      })
    );

    // pointSeries.data.setAll([
    //   {
    //     longitude: -73.778137,
    //     latitude: 40.641312,
    //   },
    //   {
    //     longitude: -0.454296,
    //     latitude: 51.47002,
    //   },
    //   {
    //     longitude: 116.597504,
    //     latitude: 40.072498,
    //   },
    // ]);

    //pointSeries.data.setAll(this.arr);

    pointSeries.set("clusteredBullet", function (root) {
      var container = am5.Container.new(root, {
        cursorOverStyle: "pointer",
      });

      var circle1 = container.children.push(
        am5.Circle.new(root, {
          radius: 8,
          tooltipY: 0,
          fill: am5.color(0xff8c00),
        })
      );

      var circle2 = container.children.push(
        am5.Circle.new(root, {
          radius: 12,
          fillOpacity: 0.3,
          tooltipY: 0,
          fill: am5.color(0xff8c00),
        })
      );

      var circle3 = container.children.push(
        am5.Circle.new(root, {
          radius: 16,
          fillOpacity: 0.3,
          tooltipY: 0,
          fill: am5.color(0xff8c00),
        })
      );

      var label = container.children.push(
        am5.Label.new(root, {
          centerX: am5.p50,
          centerY: am5.p50,
          fill: am5.color(0xffffff),
          populateText: true,
          fontSize: "8",
        })
      );

      container.events.on("click", function (e) {
        pointSeries.zoomToCluster(e.target.dataItem);
      });

      return am5.Bullet.new(root, {
        sprite: container,
      });
    });

    // Create regular bullets
    pointSeries.bullets.push(function () {
      var circle = am5.Circle.new(root, {
        radius: 6,
        tooltipY: 0,
        fill: am5.color(0xff8c00),
      });

      return am5.Bullet.new(root, {
        sprite: circle,
      });
    });

    for (var i = 0; i < this.arr.length; i++) {
      var car = this.arr[i];
      addCar(car.longitude, car.latitude);
    }

    function addCar(longitude, latitude) {
      pointSeries.data.push({
        geometry: { type: "Point", coordinates: [longitude, latitude] },
      });
    }

    //pointSeries.data.setAll(this.arr);

    chart.appear(1000, 100);

    this.root = root;
  },

  beforeUnmount() {
    if (this.root) {
      this.root.dispose();
    }
  },
};
</script>
