
/*
  Program: Assignment 11
  Author: Brandon Smith
  Purpose: 
  
*/


// create spec
var spec = { 
    $schema: "https://vega.github.io/schema/vega/v5.json",
    description: "Bigfoot Sightings in the United States",
    width:  1000,
    height:  500,
    padding:  10,
  
    signals: [
      { 
          name: "Year", // Add elements to select with a dropdown menu
          value: ["1980"],
          bind: {
              input: "select",
              options: ["1980", "1981", "1982", "1983", "1984", "1985", "1986", "1987", "1988", "1989",
                        "1990", "1991", "1992", "1993", "1994", "1995", "1996", "1997", "1998", "1999",
                        "2000", "2001", "2002", "2003", "2004", "2005", "2006", "2007", "2008", "2009",
                        "2010", "2011", "2012", "2013", "2014", "2015", "2016", "2017", "2018", "2019", 
                        "2020", "2021"],
              element: "#selector"
          }
      }
    ], // End signals

    data: [
        {
          name: "bigfoot",
          url: "https://raw.githubusercontent.com/blsmith86/444_Assignment11/main/bigfoot.csv",
          format: { type: "csv"},
          transform:
          [
            {
              type: "aggregate",
              groupby: ["state", "date", "latitude", "longitude", "number"], // Maybe include county too?
              as:      ["sightings"]
            }

            // Add filter later to filter by the year selected in the dropdown

          ]
         
        },
        
        {
          name: "states",
          url: "https://raw.githubusercontent.com/vega/vega/main/docs/data/us-10m.json",
          format: {"type": "topojson", "feature": "states"},
          
          transform: 
          [
            {
              type: "lookup",
              from: "bigfoot",
              key:  "id",
              fields: ["id"],
              values: ["sightings", "latitude", "longitude"]
            },
          ]
        }
    ], // End data

    scales: [
      {
          name: "xScale",
          type: "linear",
          domain: { data: "bigfoot", field: "latitude" },
          range: "width",
          
      },
      
      {
          name: "yScale",
          type: "linear",
          domain: { data: "bigfoot", field: "longitude" }, 
          range: "height",
          
      },
  ], // End scales

    projections: [
        {
            name: "projection",
            type: "albersUsa"
        }
    ], // End projection

    marks: [
        {
          type: "shape",
          from: { data: "states"},
            encode: {
               x: {field: "latitude", scale:"xScale"},
               y: {field: "longitude", scale:"yScale"},
              // size: {value: 10}
              // hover: { tooltip: { signal: "format(datum.awardCount, '.1%')"}}, // Need to the change this to display the count of awards
          }, // End marks
          

          transform: [{
            type: "geoshape",
            projection: "projection"
          }],

        //   transform: [
        //     { 
        //       type: "geopoint",
        //       projection: "projection" ,
        //       fields: ["latitude", "longitude"],
        //       as: ["lat", "lon"]
        //     } 
        //   ]
        // } // End marks


      }, // REMOVE THIS BRACKET IF THE ABOVE CODE IS UNCOMMENTED
      {
        type: "symbol",
          from: { data: "states"},
            encode: {
               x: {field: "latitude", scale:"xScale"},
               y: {field: "longitude", scale:"yScale"},
            }
      }
    ],

    title: {
      text: "Bigfoot Sightings in the United States",
      fontSize: "20"
    }

}; // End spec

// create runtime
var runtime = vega.parse(spec);

// create view
var view = new vega.View(runtime)
                   .logLevel(vega.Error)
                   .renderer("svg")
                   .initialize("#view")
                   .hover();

// run it
view.run();