import {useState, useEffect} from 'react';

export default function ClimateInfo(){

    const divList = [
        ".myContainer1",
        ".myContainer2",
        "#container",
        "#intro_area",
        "#exit_area",
        "#intro_area2",
        "#intro_area3",
        ".hurricaneOuter",
        ".empty_div",
        "#usTemperatureChangeOuter",
        "#usNaturalDisasterDeathsOuter",
        "#usNaturalDisasterDamagesOuter",
    ];

    return (
        <>
        <div className="empty_div"></div>
        <div className="text-center" id="intro_area">
          Effects of Climate Change in Natural Disasters
          <div className="intro_area_names">
            By: Nicholas Jones, Christopher Stone, Ben Robbins, and David Zalewski
          </div>
        </div>
        <div className="text-center" id="intro_area2">
          It feels like every time a natural disaster occurs, whether it be the fire that is continuously tearing its way through California or a hurricane carving through Florida, climate change is the first reason to be thrown into the ring as the culprit.
        </div>
        <div className="text-center" id="intro_area3">
          Our project hopes to visualize data in a way that shows the correlation between a rising global temperature, and increasingly damaging storms.
        </div>
        <div className="text-center" id="exit_area">
          In conclusion, with a warming climate there is a severe increase in the amount of natural disasters, therefore posing a significant economical and human risk.
        </div>
        <div className="text_area1">
            <h1 className="text-center">Wildfire Visualization</h1>
            <br />
            This chart shows information about cumulative wildfire acreage burnt per state. The common trend when going through the years is that there are less and less states in the "Low" areas
            and more states in the "Medium" and "Large" areas.<br /><br />In 1992, the majority of states had many small, in control fires (10,000 acres)
        </div>
        <div className="text_area2">
            <h1 className="text-center">Wildfire Visualization</h1>
            <br />This chart shows information about cumulative wildfire acreage burnt per state. The common trend when going through the years is that there are less and less states in the "Low" areas
            and more states in the "Medium" and "Large" areas.<br /><br />In 2012, a sizable number of states had fires with over 100,000 acres burned. 
        </div>
        <div className="text_area3">
            <h1 className="text-center">US Temperature Change</h1>
            <br />This chart visualizes the US Temperature Change from 1961 to 2020 in a continuous line chart, where each spike in temperature outdoes the previous spike. 
            This steady upward trend is also reflected in our next chart, where we correlate this trend to an increase in disaster damages.
        </div>
        <div className="text_area4">
          <h1 className="text-center">US Natural Disaster Damages</h1>
          <br />This chart represents the correlation between disasters in the US and their cost through time in a scatter plot from 1970-2021. 
          We see that not only are there significantly more Natural Disasters but their costs are at an all-time high.
          In 1970 we saw that the most expensive meteorological disaster was $1 million dollars.
        </div>
        <div className="text_area5">
          <h1 className="text-center">US Natural Disaster Damages</h1>
          <br />Around 1990 we started seeing significantly more Natural disasters and their damage costs only skyrocketed. 
          We see around 1990 a Meteorological disaster (Flood- Storm) caused upwards of 100B USD. 
          As well as a Geophysical disaster (Earthquake Activity) reaching around 100 Billion USD as well. 
        </div>
        <div className="text_area6">
          <h1 className="text-center">US Natural Disaster Deaths</h1>
          <br />In this visualization, we see a stacked bar chart representing the number of deaths throughout each year from 1970 to about 2021. 
          Something to take note of is the fact that the number of deaths fell sharply after 1980, this due to factors including stricter building codes and better early warning systems.
        </div>
        <div className="text_area7">
          <h1 className="text-center">Number of Tornadoes per State</h1>
          <br />This visualization is a treemap which shows the total amount of tornadoes for each state in a period of 5 years. 
          <br /><br />
          Rectangles grow larger depending on the value of the data placed inside them. 
          As years increase, the total amount of tornadoes per state increases by a large margin. 
          <br /><br />
          In addition to this, states in the north-east and west, also experience a rise in tornadoes, demonstrating that the cities once thought far enough away, may not be as safe as previously thought.
        </div>
        <div className="text_area8">
          <h1 className="text-center">Hurricane Innovative Visualization</h1>
          <br />This is our innovative visualization which overlays the path of a hurricane on top of a map of the United States. 
          As the years increase, the strength of the hurricanes increases along with, as well as the duration of high power. 
        </div>

        </>
    );
}