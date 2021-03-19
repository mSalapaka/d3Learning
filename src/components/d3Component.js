import React, {useRef,useEffect,useState} from 'react'
import {
    select,
    forceSimulation,
    forceManyBody,
    forceX,
    forceY,
    forceCollide,
    forceLink,
    path,
    line,
    area,
    curveCardinal,
    scaleLinear,
    scaleBand,
    scaleTime,
    scaleUtc,
    axisLeft,
    extent,
    min,
    max,
    median,
    csv,
    parseDate,
    csvParse,
    utcParse,
    utcFormat,
    format,
    axisBottom,
    axisTop,
    zoom,
    brushX,
    pairs,
    Delaunay,
    bisector,
    zoomTransform,
    curveStepAfter
  } from "d3";
import fruits from '../data/fruits.json'
import appleStockData from '../data/appleStockData.json'

const D3Component = ()=>{
    const [renderState,setRenderState]=useState(false)
    const [currentZoomState, setCurrentZoomState] = useState()
    const [data,setData]=useState([])
    const d3ContainerDivRef=useRef()
    const d3ContainerDiv =select(d3ContainerDivRef.current)
    const toolTipDivRef=useRef()
    const tooltipDiv=select(toolTipDivRef.current)
   
    const toolTipDivStyle={
        opacity:0,
        position:"absolute",
        border:"solid",
        backgroundColor:"white",
    }
    //console.log(values)
    console.log(appleStockData)

    const width=1200
    const height=300

const reRender=()=>{
    setRenderState(!renderState)
}
useEffect(()=>{
    if (!d3ContainerDiv){ return}
    d3ContainerDiv.attr("id","d3ContainerDiv")
// Paste d3 code here

//barChart
   /*  const barChartSvg=d3ContainerDiv.append('svg').attr("height","100%").attr("width",width)
   const barChartGroup=barChartSvg.append('g')
                     .attr("fill","blue").attr("transform",`translate(20,30)`)
    const y=scaleBand()
        .domain(fruits.map((d)=>d.name))
        .range([0,height])
    const x=scaleLinear()
            .domain([0,max(fruits.map(d=>d.count))])
            .range([0,width])

    let bar=barChartGroup.append("g")
            .attr("fill", "steelblue")
          .selectAll("rect")
          .data(fruits, d => d.name)
          .join("rect")
            .style("mix-blend-mode", "multiply")
            .attr("x", x(0))
            .attr("y", d=>y(d.name))  
            .attr("width", d => x(d.count) - x(0))
            .attr("height", y.bandwidth() -3);

    let xAxis=barChartGroup.append("g")
                        .call(axisTop(x))

    let yAxis=barChartGroup.append("g")
                        .call(axisLeft(y))
            
   */          
    /**  Line Chart  */ 
    const lineChartSvg=d3ContainerDiv.append('svg').attr("height","100%").attr("width",width)
    var tooltip = select("body").append("div")
                        .style("opacity","0")
                        .style("position","absolute")
                        .style("border", "solid")
                        .style("background-color", "white")
                        .style("padding", "5px")
                        .style("border-radius", "5px");
    var tooltipCircle = select("body").append("svg").style("opacity","0").style("position","absolute");
    //.style("position","absolute");

    const strictIsoParse = utcParse("%Y-%m-%dT%H:%M:%S.%LZ");
    let ans=strictIsoParse("2019-08-02T23:00:00.000Z")
    console.log(ans.getMonth(),ans.getFullYear())

    const lineChartGroup=lineChartSvg.append('g').attr('transform',`translate(40,500)`)
    let lineChartHeight=200
    let lineChartWidth=width*0.95
    let datesArray= appleStockData.map(d=>strictIsoParse(d.date))
   
    console.log(extent(datesArray))
    console.log(datesArray)
    // Scale the data to fit window range

    let xLine = scaleUtc() 
                    .domain(extent(datesArray))
                    .range([0,lineChartWidth])

    if (currentZoomState) {
        const newXScale = currentZoomState.rescaleX(xLine);
        xLine.domain(newXScale.domain());
        console.log(newXScale.domain())
        }

    let yLine = scaleLinear()
                .domain(extent(appleStockData,d=>d.close))
                .range([lineChartHeight,0])

    //Draw the axes

    let xAxisLine=lineChartGroup.append("g")
                .call(axisBottom(xLine))
                .attr("transform", `translate(0,${lineChartHeight })`)

    let yAxisLine=lineChartGroup.append("g")
    .call(axisLeft(yLine))

    //draw the line
    var myLine=area()
         .x(d=>xLine(strictIsoParse(d.date)))
         .y(d=>yLine(d.close))

    lineChartGroup.append("path")
             .attr("d",myLine(appleStockData))
             .attr("stroke","blue")
             .attr("fill","none")
    let infoDiv=lineChartGroup.append("div")
                    .attr("id","infoDiv")
             

    lineChartGroup.selectAll("circle")
                    .data(appleStockData)
                    .join("circle")
                    .attr("cx",d=>xLine(strictIsoParse(d.date)))
                    .attr("cy",d=>yLine(d.close))
                    .attr("r","2")
                    .on("mouseover",function(event,d){
                        
                        tooltipDiv.style("opacity","1")
                        .style("left",event.pageX+"px")
                        .style("top",event.pageY+"px");
                        tooltipDiv.html(`
                        
                       ${strictIsoParse(d.date).getMonth()}/${strictIsoParse(d.date).getFullYear()}
                        ${d.close}
                      `);

                  
                });
// Zoom Example

    const margin ={top: 20, right: 20, bottom: 30, left: 30}
    const zoom = zoom()
      .scaleExtent([1, 32])
      .extent([[margin.left, 0], [width - margin.right, height]])
      .translateExtent([[margin.left, -Infinity], [width - margin.right, Infinity]])
      .on("zoom", zoomed);
    const x = scaleUtc()
      .domain(extent(data, d => d.date))
      .range([margin.left, width - margin.right])
    const svg = create("svg")
      .attr("viewBox", [0, 0, width, height]);
    svg.append("clipPath")
      .attr("id", "clipId")
      .append("rect")
      .attr("x", margin.left)
      .attr("y", margin.top)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom);


    const area = (data, x) => area()
      .curve(curveStepAfter)
      .x(d => x(d.date))
      .y0(y(0))
      .y1(d => y(d.value))
    
     const path = svg.append("path")
      .attr("clip-path", clip)
      .attr("fill", "steelblue")
      .attr("d", area(data, x));
    // const zoomBehavior=zoom()
    //                         .scaleExtent([1,1])
    //                         .translateExtent([0,0],[lineChartWidth,lineChartHeight])
    //                         .on("zoom",()=>{
    //                             const zoomState=zoomTransform(lineChartGroup.node())
    //                             setCurrentZoomState(zoomState)
    //                             console.log("zoomed")
    //                         })
    // lineChartGroup.call(zoomBehavior)

      

                // const brush=brushX()
                //     .extent([[0,0],[lineChartWidth,lineChartHeight]])
                //     .on("start brush end",(event)=>{
                //         const indexSelection=event.selection.map(xLine.invert)
                //         console.log(indexSelection)

                //     })
                // lineChartGroup.append("g")
                //                 .call(brush)
                //                 .call(brush.move,[0,100])

//Zoom
    //         function zoomed() {
    //            console.log("zoomed")
    //         }
    // lineChartGroup.call(zoom()
    //                         .on("zoom",zoomed)
    
    // )
     

})






    return(
        <>
        <div  ref={d3ContainerDivRef}> 
            <div>
                <button onClick={reRender}> Rerender</button>
            </div>
        

        
        </div>
        <div  style={toolTipDivStyle} ref={toolTipDivRef} > 
        </div>
        </>
    )
}

export default D3Component
