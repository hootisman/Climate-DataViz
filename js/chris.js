Promise.all([
    d3.csv("data/Temperature_change_Data.csv"),
    d3.csv("data/1970-2021_DISASTERS.csv"),
  ]).then(([tempChangeData, disastersData]) => {
    /**
     * Process data
     */
    tempChangeData = tempChangeData
      .filter((d) => d["Country Code"] === "USA") // Only keep US data
      .map((d) => ({
        year: +d["year"],
        tempChange: +d["tem_change"],
      }));
    console.log("tempChangeData", tempChangeData);
  
    disastersData = disastersData
      .filter((d) => d["ISO"] === "USA") // Only keep US data
      .map((d) => ({
        year: +d["Year"],
        disasterType: d["Disaster Subgroup"],
        deaths: d["Total Deaths"] ? +d["Total Deaths"] : null,
        damages: d["Total Damages ('000 US$)"]
          ? +d["Total Damages ('000 US$)"] * 1000
          : null,
      }));
    console.log("disastersData", disastersData);
  
    drawUSTemperatureChangeLineGraph(
      d3.select("#usTemperatureChange"),
      tempChangeData
    );
  
    drawUSNaturalDisastersDeathsStackedAreaGraph(
      d3.select("#usNaturalDisasterDeaths"),
      disastersData
    );
  
    drawUSNaturalDisastersDamagesScatterPlot(
      d3.select("#usNaturalDisasterDamages"),
      disastersData
    );
  });
  
  /**
   * US Temperature Change Line Graph
   */
  function drawUSTemperatureChangeLineGraph(container, data) {
    const width = 1082;
    const height = 400;
    const margin = {
      top: 10,
      right: 20,
      bottom: 45,
      left: 80,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
    const lineWidth = 2;
  
    const lineColor = d3.schemeSet2[0];
  
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year))
      .range([0, innerWidth])
      .nice();
    const yScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.tempChange))
      .range([innerHeight, 0])
      .nice();
    const line = d3
      .line()
      .x((d) => xScale(d.year))
      .y((d) => yScale(d.tempChange));
  
    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("class", "chart");
    const xAxisG = g
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
    const xAxisTitle = g
      .append("text")
      .attr("class", "x-axis-title")
      .attr("transform", `translate(${innerWidth / 2},${innerHeight + 40})`)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .text("Year");
    const yAxisG = g
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).ticks(5));
    const yAxisTitle = g
      .append("text")
      .attr("class", "y-axis-title")
      .attr(
        "transform",
        `translate(${-margin.left + 20},${innerHeight / 2})rotate(-90)`
      )
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .text("Temperature Change (°C)");
    const zeroLine = g
      .append("line")
      .attr("class", "zero-line")
      .attr("stroke", "currentColor")
      .attr("stroke-dasharray", "4")
      .attr("x1", xScale.range()[0])
      .attr("x2", xScale.range()[1])
      .attr("y1", yScale(0))
      .attr("y2", yScale(0));
    const linePath = g
      .append("path")
      .attr("class", "line-path")
      .attr("fill", "none")
      .attr("stroke-width", lineWidth)
      .attr("stroke", lineColor)
      .attr("d", line(data));
  }
  
  /**
   * US Natural Disasters Deaths Stacked Area Graph
   */
  function drawUSNaturalDisastersDeathsStackedAreaGraph(container, data) {
    // Order disaster types by total deaths
    const deathsByDisasterType = d3
      .rollups(
        data,
        (v) => d3.sum(v, (d) => d.deaths),
        (d) => d.disasterType
      )
      .sort((a, b) => d3.descending(a[1], b[1]));
    const disasterTypes = deathsByDisasterType.map((d) => d[0]);
    // Transform the data to the shape the d3.stack expects
    const years = d3.range(
      d3.min(data, (d) => d.year),
      d3.max(data, (d) => d.year) + 1
    );
    const transformedData = [];
    years.forEach((year) => {
      const d = {
        year,
      };
      disasterTypes.forEach((disasterType) => {
        const found = data.find(
          (e) => e.year === year && e.disasterType === disasterType
        );
        d[disasterType] = found ? found.deaths : 0;
      });
      transformedData.push(d);
    });
    // Compute the stack layout
    const stack = d3
      .stack()
      .keys(disasterTypes)
      .order(d3.stackOrderNone)
      .offset(d3.stackOffsetNone);
    const stackedData = stack(transformedData);
  
    const width = 1082;
    const height = 600;
    const margin = {
      top: 10,
      right: 20,
      bottom: 45,
      left: 80,
    };
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
    const xScale = d3
      .scaleBand()
      .paddingInner(0.1)
      .domain(years)
      .range([0, innerWidth]);
    const yScale = d3
      .scaleLinear()
      .domain([0, d3.max(stackedData[stackedData.length - 1], (d) => d[1])])
      .range([innerHeight, 0])
      .nice();
    const colorScale = d3
      .scaleOrdinal()
      .domain(disasterTypes)
      .range(d3.schemeSet2);
  
    const area = d3
      .area()
      .x((d) => xScale(d.data.year))
      .y0((d) => yScale(d[0]))
      .y1((d) => yScale(d[1]));
  
    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("class", "chart");
    const xAxisG = g
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(
        d3.axisBottom(xScale).tickValues(years.filter((year) => year % 5 === 0))
      );
    const xAxisTitle = g
      .append("text")
      .attr("class", "x-axis-title")
      .attr("transform", `translate(${innerWidth / 2},${innerHeight + 40})`)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .text("Year");
    const yAxisG = g
      .append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale).ticks(5));
    const yAxisTitle = g
      .append("text")
      .attr("class", "y-axis-title")
      .attr(
        "transform",
        `translate(${-margin.left + 20},${innerHeight / 2})rotate(-90)`
      )
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .text("Deaths");
    const barRect = g
      .append("g")
      .selectAll(".series-g")
      .data(stackedData)
      .join("g")
      .attr("class", "series-g")
      .attr("fill", (d) => colorScale(d.key))
      .selectAll(".bar-rect")
      .data((d) => d)
      .join("rect")
      .attr("class", "bar-rect")
      .attr("x", (d) => xScale(d.data.year))
      .attr("y", (d) => yScale(d[1]))
      .attr("width", xScale.bandwidth())
      .attr("height", (d) => yScale(d[0]) - yScale(d[1]));
  
    // Color legend
    const legendRow = svg
      .append("g")
      .attr("transform", `translate(${width - 150},${margin.top})`)
      .selectAll(".legend-row")
      .data(disasterTypes)
      .join("g")
      .attr("class", "legend-row")
      .attr("transform", (d, i) => `translate(0, ${(i + 0.5) * 25})`);
  
    legendRow
      .append("rect")
      .attr("y", -10)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", (d) => colorScale(d));
  
    legendRow
      .append("text")
      .attr("fill", "currentColor")
      .attr("x", 25)
      .attr("dy", "0.32em")
      .text((d) => d);
  }
  
  /**
   * US Natural Disasters Damages Scatter Plot
   */
  function drawUSNaturalDisastersDamagesScatterPlot(container, data) {
    // Order disaster types by total deaths
    const deathsByDisasterType = d3
      .rollups(
        data,
        (v) => d3.sum(v, (d) => d.deaths),
        (d) => d.disasterType
      )
      .sort((a, b) => d3.descending(a[1], b[1]));
    const disasterTypes = deathsByDisasterType.map((d) => d[0]);
  
    // Only keep data with damages
    data = data
      .filter((d) => d.damages)
      .sort((a, b) => d3.descending(a.damages, b.damages));
  
    const width = 1082;
    const height = 800;
    const margin = {
      top: 40,
      right: 20,
      bottom: 45,
      left: 80,
    };
    const minRadius = 2;
    const maxRadius = 80;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;
  
    const xScale = d3
      .scaleLinear()
      .domain(d3.extent(data, (d) => d.year))
      .range([0, innerWidth])
      .nice();
    const yScale = d3
      .scaleLog()
      .domain(d3.extent(data, (d) => d.damages))
      .range([innerHeight, 0])
      .nice();
    const rScale = d3
      .scaleSqrt()
      .domain(d3.extent(data, (d) => d.damages))
      .range([minRadius, maxRadius]);
    const colorScale = d3
      .scaleOrdinal()
      .domain(disasterTypes)
      .range(d3.schemeSet2);
  
    const svg = container
      .append("svg")
      .attr("width", width)
      .attr("height", height);
    const g = svg
      .append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`)
      .attr("class", "chart");
    const xAxisG = g
      .append("g")
      .attr("class", "x-axis")
      .attr("transform", `translate(0,${innerHeight})`)
      .call(d3.axisBottom(xScale).tickFormat(d3.format("d")));
    const xAxisTitle = g
      .append("text")
      .attr("class", "x-axis-title")
      .attr("transform", `translate(${innerWidth / 2},${innerHeight + 40})`)
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .text("Year");
    const yAxisG = g
      .append("g")
      .attr("class", "y-axis")
      .call(
        d3
          .axisLeft(yScale)
          .ticks(5)
          .tickFormat((d) => d3.format("~s")(d).replace("G", "B")) // d3.format uses "G" instead of "B" for billions
      );
    const yAxisTitle = g
      .append("text")
      .attr("class", "y-axis-title")
      .attr(
        "transform",
        `translate(${-margin.left + 20},${innerHeight / 2})rotate(-90)`
      )
      .attr("text-anchor", "middle")
      .attr("fill", "currentColor")
      .text("Damages ($)");
    const bubble = g
      .append("g")
      .selectAll(".bubble-circle")
      .data(data)
      .join("circle")
      .attr("class", "bubble-circle")
      .attr("stroke", "#fff")
      .attr("fill", (d) => colorScale(d.disasterType))
      .attr("r", (d) => rScale(d.damages))
      .attr("cx", (d) => xScale(d.year))
      .attr("cy", (d) => yScale(d.damages));
  
    // Color legend
    const legendRow = svg
      .append("g")
      .attr(
        "transform",
        `translate(${width - 150},${height - margin.bottom - 150})`
      )
      .selectAll(".legend-row")
      .data(disasterTypes)
      .join("g")
      .attr("class", "legend-row")
      .attr("transform", (d, i) => `translate(0, ${(i + 0.5) * 25})`);
  
    legendRow
      .append("rect")
      .attr("y", -10)
      .attr("width", 20)
      .attr("height", 20)
      .attr("fill", (d) => colorScale(d));
  
    legendRow
      .append("text")
      .attr("fill", "currentColor")
      .attr("x", 25)
      .attr("dy", "0.32em")
      .text((d) => d);
  
    // Size legend
    const legendItem = svg
      .append("g")
      .attr(
        "transform",
        `translate(${margin.left + maxRadius + 10},${margin.top + maxRadius * 2})`
      )
      .selectAll(".legend-item")
      .data([1e6, 1e9, 1e10, 1e11])
      .join("g")
      .attr("class", "legend-item");
  
    legendItem
      .append("circle")
      .attr("fill", "none")
      .attr("stroke", "currentColor")
      .attr("cy", (d) => -rScale(d))
      .attr("r", (d) => rScale(d));
  
    legendItem
      .append("line")
      .attr("stroke", "currentColor")
      .attr("stroke-dasharray", "4")
      .attr("x2", maxRadius)
      .attr("y1", (d) => -rScale(d) * 2)
      .attr("y2", (d) => -rScale(d) * 2);
  
    legendItem
      .append("text")
      .attr("fill", "currentColor")
      .attr("dy", "0.32em")
      .attr("x", maxRadius + 5)
      .attr("y", (d) => -rScale(d) * 2)
      .text((d) => `$${d3.format("~s")(d).replace("G", "B")}`);
  }
  