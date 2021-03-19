import React, {useRef,useEffect,useState} from 'react'
import {
    select,
    area,
    scaleLinear,
    scaleUtc,
    axisLeft,
    extent,
    axisBottom,
    zoom,
    max,
    curveStepAfter
  } from "d3";
import dataRaw from './data.json'

const ZoomableAreaChart = ()=>{
  const d3ContainerDivRef=useRef()
  const d3ContainerDiv =select(d3ContainerDivRef.current)

  useEffect(()=>{

    if (!d3ContainerDiv){ return}
    d3ContainerDiv.attr("id","d3ContainerDiv")

    const data=dataRaw.map((d)=>{
        let dateObj=new Date(d.date)
        return { 
          date:dateObj,
          value:d.value
        }
      })
      console.log(data)
  const height = 500
  const width=954
  const margin = {top: 20, right: 20, bottom: 30, left: 30}
  const svg = select("#root").append("svg")
      .attr("viewBox", [0, 0, width, height]);
  const x = scaleUtc()
      .domain(extent(data, d=>d.date))
      .range([margin.left, width - margin.right])
  const y = scaleLinear()
      .domain([0, max(data, d => d.value)]).nice()
      .range([height - margin.bottom, margin.top])
  

  // The corresponding code on the observable notebook version is altered
  const areaPath=(data,x)=>{
     let areaTemp= area()
      .curve(curveStepAfter)
      .x(d => x(d.date))
      .y0(y(0))
      .y1(d => y(d.value))
      return areaTemp(data)
    }

  // clip from the Obervable original was altered
  const clip = {id:"clipId"};
      
  svg.append("clipPath")
            .attr("id", clip.id)
            .append("rect")
            .attr("x", margin.left)
            .attr("y", margin.top)
            .attr("width", width - margin.left - margin.right)
            .attr("height", height - margin.top - margin.bottom);
  
  
  const path = svg.append("path")
     .attr("clip-path", `url(#${clip.id})`)// This change from observable original was needed
        .attr("fill", "steelblue")
        .attr("d", areaPath(data,x));


const xAxis = (g, x) => g
      .attr("transform", `translate(0,${height - margin.bottom})`)
      .call(axisBottom(x).ticks(width / 80).tickSizeOuter(0))
  
  const gx = svg.append("g")
        .call(xAxis, x);
  
  const yAxis = (g, y) => g
      .attr("transform", `translate(${margin.left},0)`)
      .call(axisLeft(y).ticks(null, "s"))
      //.call(g => g.select(".domain").remove())
      .call(g => g.select(".tick:last-of-type text").clone()
          .attr("x", 3)
          .attr("text-anchor", "start")
          .attr("font-weight", "bold")
          .text("flights")
        )
svg.append("g")
    .call(yAxis, y);
  
  
  
  
  
  function zoomed(event) {
        const xz = event.transform.rescaleX(x);
        path.attr("d", areaPath(data, xz));
        gx.call(xAxis, xz);
      }
  
  const zoomFunc = zoom()
        .scaleExtent([1, 32])
        .extent([[margin.left, 0], [width - margin.right, height]])
        .translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
        .on("zoom", zoomed);
  
  
  
  
  
  
  
  
svg.call(zoomFunc)
        .transition()
          .duration(750)
          .call(zoomFunc.scaleTo, 4, [x(Date.UTC(2001, 8, 1)), 0]);
  
  
  
  }) 
      return(
        <>
        <div  ref={d3ContainerDivRef}> 
        </div>
         
        
        </>
    )
}

export default ZoomableAreaChart
