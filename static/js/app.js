function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample /metadata/<sample>
  var url = `/metadata/${sample}`;
  d3.json(url).then(function(sample) {

    // Use d3 to select the panel with id of `#sample-metadata`
    var sample_metadata = d3.select("#sample-metadata");

      // Use `.html("") to clear any existing metadata
      sample_metadata.html("");
      // Use `Object.entries` to add each key and value pair to the panel
      Object.entries(sample).forEach(function ([key, value]) {
        var row = sample_metadata.append("p");
        row.text(`${key}: ${value} \n`);
      });
      // Hint: Inside the loop, you will need to use d3 to append new
      // tags for each key-value in the metadata.
    }  );
}
//==========================================================================================================

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
  var url = `/samples/${sample}`;

  // Piechart

  d3.json(url).then(function(data){
    // var plot_data = d3.select("#selDataset");

    var labels = [];
    var values = [];
    var hovers = [];
    
    for(i=0; i<10; i++) {

      var label = data.otu_ids[i];
      labels.push(label);

      var value = data.sample_values[i];
      values.push(value);

      var hover = data[label - 1];
      hovers.push(hover);
      
    };

    var trace = {

      values: values,
      labels: labels,
      type: "pie",
      text: hovers,
      hoverinfo: "label+text+value+percent",
      textinfo: "percent"

    };
    var data = [trace];
    var layout = {

      margin: {
        l: 20,
        r: 50, 
        b: 150, 
        pad: 4
      },

    };

    Plotly.newPlot("pie", data, layout);      

  });

  //+++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++

//BubbleChart

d3.json(url).then(function(data){
  
    var otuIDs = data.otu_ids;
    var samplevalues = data.sample_values;
    var otuDescriptions = [];
    for(i=0; i<otuIDs.length; i++) {
      otuDescriptions.push(data[otuIDs[i] - 1]);
    };

    var trace = {
      x: [otuIDs],
      y: [samplevalues],
      mode: 'markers',
      type: 'scatter',
      marker: {
        size: sample_values,
        color: otuIDs, 
        colorscale: "Rainbow"
        
      },
      text: otuDescriptions,
    
    };

    var data = [trace];


    Plotly.newPlot('bubble', data);

    });

//===================================================================================================================

}

//====================================================================================================================

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
