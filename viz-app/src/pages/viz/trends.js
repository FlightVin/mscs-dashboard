import React from 'react';
import * as d3 from 'd3';

import data from '../../data/data.json';
import Loader from '../loader/loader';
import Slider from '@mui/material/Slider';
import ArrowCircleLeftIcon from '@mui/icons-material/ArrowCircleLeft';

import './trends.css'

const capitalize = (mySentence) => {
    const words = mySentence.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].toLowerCase().substr(1);
    }
    
    return words.join(" ");;
}

const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];

const Trends = () => {
    const [myDiv, setMyDiv] = React.useState(null);
    const [tableData, setTableData] = React.useState([]);
    const [curTableData, setCurTableData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [states, setStates] = React.useState();
    const [districts, setDistricts] = React.useState();
    const [sectors, setSectors] = React.useState([]);
    const [areas, setAreas] = React.useState([]);
    const [dates, setDates] = React.useState([]);
    const [curDates, setCurDates] = React.useState([]);
    const [tableHeadings, setTableHeadings] = React.useState([
        {"Sr. No": "no"},
        {"Name of Society": "name"},
        {"Address": "address"},
        {"State": "state"},
        {"District": "district"},
        {"Date of Registration": "date"},
        {"Sector": "sector"},
        {"Area of Operation": "area"},
    ]);

    const [sectorColor, setSectorColor] = React.useState(function(str){
        return (str) => {return 'lightblue';}
    });
    const [stateColor, setStateColor] = React.useState(function(str){
        return (str) => {return 'lightred';}
    });

    function getCurrentDimension(){
        return {
              width: window.innerWidth,
              height: window.innerHeight
        }
    }
    const [screenSize, setScreenSize] = React.useState(getCurrentDimension());
    React.useEffect(() => {
        const updateDimension = () => {
          setScreenSize(getCurrentDimension())
        }
        window.addEventListener('resize', updateDimension);
        
        return(() => {
            window.removeEventListener('resize', updateDimension);
        })
    }, [screenSize])

    const strToDate = (dateStr) => {
        const [month, day, year] = dateStr.split('/');
        const dateObject = new Date(year, month - 1, day);
        return dateObject;
    }

    const loadData = () => {
        const stateSet = new Set();
        const stateArray = new Array();
        const districtSet = new Set();
        const districtArray = new Array();
        const sectorTypeSet = new Set();
        const sectorTypeArray = new Array();
        const areaSet = new Set();
        const areaArray = new Array();
        const dateSet = new Set();
        const dateArray = new Array();



        const myConvert = (dateStr) =>{
            const arr = dateStr.split('/');
            arr[1] = "01";
            return arr.join("/");
        }

        data.forEach(d => {

            stateSet.add(capitalize(d.state));
            districtSet.add(capitalize(d.district));
            sectorTypeSet.add(capitalize(d.sector));
            dateSet.add(myConvert(d.date));

            d.area.split(",").map(word => word.trim()).forEach(w => {
                areaSet.add(capitalize(w));
            })

            setTableData(oldArray => [
                ...oldArray,
                {
                    "no": Number(d.no),
                    "name": capitalize(d.name),
                    "address": capitalize(d.address),
                    "state": capitalize(d.state),
                    "district": capitalize(d.district),
                    "sector": capitalize(d.sector),
                    "date": d.date,
                    "area": capitalize(d.area),
                }
            ])
            setCurTableData(oldArray => [
                ...oldArray,
                {
                    "no": Number(d.no),
                    "name": capitalize(d.name),
                    "address": capitalize(d.address),
                    "state": capitalize(d.state),
                    "district": capitalize(d.district),
                    "sector": capitalize(d.sector),
                    "date": d.date,
                    "area": capitalize(d.area),
                }
            ])
        })

        stateSet.forEach(d => {
            stateArray.push(d);
        })
        stateArray.sort();

        districtSet.forEach(d => {
            districtArray.push(d);
        })
        districtArray.sort();

        sectorTypeSet.forEach(d => {
            sectorTypeArray.push(d);
        })
        sectorTypeArray.sort();

        areaSet.forEach(d => {
            areaArray.push(d);
        })
        areaArray.sort();

        dateSet.forEach(d => {
            dateArray.push(strToDate(d));
        })
        dateArray.sort((a, b) => a - b);
        
        setSectorColor(function(){
            return d3.scaleOrdinal(d3.schemePaired)
        })
        setStateColor(function(){
            return d3.scaleOrdinal(d3.schemeDark2)
        })
        setStates(stateArray);
        setDistricts(districtArray);
        setAreas(areaArray);
        setSectors(sectorTypeArray);
        setDates(dateArray);
        setCurDates(dateArray);


    }

    const drawChart = () => {

        /*
        var margin = {top: 10, right: 30, bottom: 30, left: 60},
            width = screenSize.width*0.7 - margin.left - margin.right,
            height = screenSize.height*0.7 - margin.top - margin.bottom;

        if (screenSize.width < 1000){
            margin = {top: 10, right: 10, bottom: 30, left: 10}
        }

        // append the svg object to the body of the page
        var svg = d3.select("#plot-div")
        .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
        .append("g")
            .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");

        var xScale = d3.scaleBand().domain(curDates).range([margin.left, width * 100 - margin.right]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(xScale));
        */

        d3.select("#chart-div").remove();        

        var margin = ({top: 20, right: 20, bottom: 30, left: 30});
        var height = screenSize.height*0.7;
        var width = screenSize.width*0.5;
        var factor = 3;

        if (screenSize.width <= 1150){
            factor = (1150/screenSize.width)*3.5;
        }

        var maxNum = 14;

        var xScale = d3.scaleBand().domain(curDates).range([margin.left, width*factor - margin.right])
        var yScale = d3.scaleLinear().domain([0, maxNum]).range([height - margin.bottom, margin.top]);

        var parent = d3.select("#plot-div")
                .append("div")
                .attr("id", "chart-div");
            
        var ySvg = parent.append("svg")
            .attr("width", screenSize.width - margin.left - 10)
            .attr("height", height)
            .style("position", "absolute")
            .style("pointer-events", "none")
            .style("z-index", 1) 
        
        ySvg.append("g")
                .attr("transform", `translate(${margin.left},0)`)
                .call(d3.axisLeft(yScale));

        const body = parent.append("div")
            .style("overflow-x", "scroll")
            .attr("width", width)
            .style("-webkit-overflow-scrolling", "touch");
        setMyDiv(body.node());

        const overWidth = xScale.bandwidth()*(curDates.length + 1);        
        const xSvg = body.append("svg")
            .attr("width", overWidth)
            .attr("height", height)
            .style("display", "block")
            

        xSvg.append("g")
            .attr("transform", `translate(0,${height - margin.bottom})`)
            .call(d3.axisBottom(xScale).tickFormat((d,i) => {
                return months[d.getMonth()] + " '"+ (d.getFullYear())%100;
            }))

        const getNum = (curDate, sector) => {
            var ret = 0;

            curTableData.forEach(d => {
                const rowDate = strToDate(d.date);

                if (!sector){
                    if (rowDate.getMonth() === curDate.getMonth() && rowDate.getFullYear() === curDate.getFullYear()){
                        ret++;
                    }
                } else {
                    if (sector === d.sector && rowDate.getMonth() === curDate.getMonth() && rowDate.getFullYear() === curDate.getFullYear()){
                        ret++;
                    }
                }
            })

            return ret;
        }

        xSvg.append("g")
            .attr("transform", `translate(${xScale.bandwidth()/2},0)`)
            .append("path")
            .datum(curDates)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("id", "line-path-all")
            .attr("stroke-width", 8)
            .attr("d", d3.line()
                .x(function(d) { return xScale(d) })
                .y(function(d) { return yScale(getNum(d, null)) })
            )
            .on('mouseover', (e, d) => {
                d3.select('#'+e.target.id).attr("stroke-width", 10)
            }).on('mouseout', (e, d) => {
                d3.select('#'+e.target.id).attr("stroke-width", 8)
            })

        sectors.forEach(sector => {
            xSvg.append("g")
                .attr("transform", `translate(${xScale.bandwidth()/2},0)`)
                .append("path")
                .datum(curDates)
                .attr("id", "line-path-"+sector.slice(0, 4))
                .attr("fill", "none")
                .attr("stroke", sectorColor(sector))
                .attr("stroke-width", 4)
                .attr("d", d3.line()
                    .x(function(d) { return xScale(d) })
                    .y(function(d) { return yScale(getNum(d, sector)) })
                )
                .on('mouseover', (e, d) => {
                    d3.select('#'+e.target.id).attr("stroke-width", 8)
                    const curSec = e.target.id.split('-').slice(-1)[0];
                    d3.select('#legend-'+curSec).style("font-size", "17px")
                }).on('mouseout', (e, d) => {
                    d3.select('#'+e.target.id).attr("stroke-width", 4)
                    const curSec = e.target.id.split('-').slice(-1)[0];
                    d3.select('#legend-'+curSec).style("font-size", "15px")
                })
        })

        ySvg.append("circle").attr("cx",100).attr("cy",70).attr("r", 6).style("fill", "steelblue")
        ySvg.append("text").attr("x", 110).attr("y", 70).text("Total number of registrations").style("font-size", "15px").style("font-size", "15px").attr("alignment-baseline","middle")
    
        for (let i = 1; i<=sectors.length; i++){
            ySvg.append("circle").attr("cx",100).attr("cy",70+i*20).attr("r", 6).style("fill", sectorColor(sectors[i-1]))
            ySvg.append("text").attr("x", 110).attr("y", 70+i*20).text(sectors[i-1])
                .attr("id", "legend-"+sectors[i-1].slice(0, 4))
                .style("font-size", "15px").attr("alignment-baseline","middle")          
        }
    }

    React.useEffect(() => {
        setTimeout(() => {
            loadData();
            setLoading(false);
        }, 1000);
    }, []);

    React.useEffect(() => {
        drawChart();
    }, [loading, screenSize, curDates]);

    React.useEffect(() => {
        if (myDiv){
            setTimeout(() => {
                for (let i = 0; i<35; i++){
                    setTimeout(() => {
                        myDiv.scrollBy(1, 0);
                    }, i*20);
                }
        }, 500);
        }
    }, [myDiv])


    if (loading){
        return (
            <Loader/>
        );
    }

    return(
        <>
            <div className="flex items-center justify-center pt-5 flex-col">
                <div className='md:mt-0 mt-5 pl-10 md:pl-0'>
                    <span className="text-2xl font-extrabold md:text-3xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-cyan-400">Registration Trends</span>
                </div>
            </div>

            <div id="plot-div" className="pt-10 md:pl-10 md:pr-10 pl-4 pr-4">

            </div>
            
        </>
    )
}

export default Trends;