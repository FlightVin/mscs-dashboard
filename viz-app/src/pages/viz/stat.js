import React from 'react';
import * as d3 from 'd3';

import data from '../../data/data.json';
import Loader from '../loader/loader';

import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { TextField } from "@mui/material";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Typography from '@mui/material/Typography';
import Pagination from '@mui/material/Pagination';
import OutlinedInput from '@mui/material/OutlinedInput';
import Checkbox from '@mui/material/Checkbox';
import ListItemText from '@mui/material/ListItemText';
import ClearIcon from '@mui/icons-material/Clear';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import RotateLeftIcon from '@mui/icons-material/RotateLeft';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';

import DatamapsIndia from "react-datamaps-india";


const capitalize = (mySentence) => {
    const words = mySentence.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].toLowerCase().substr(1);
    }
    
    return words.join(" ");;
}

export default function Statistics(){
    const [tableData, setTableData] = React.useState([]);
    const [curTableData, setCurTableData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [states, setStates] = React.useState();
    const [districts, setDistricts] = React.useState();
    const [sectors, setSectors] = React.useState();
    const [areas, setAreas] = React.useState();
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
    const [curDistricts, setCurDistricts] = React.useState([]);
    const [curState, setCurState] = React.useState("Kerala");

    const [numPerPage, setNumPerPage] = React.useState(5);
    const [pageNum, setPageNum] = React.useState(1);

    const [sectorColor, setSectorColor] = React.useState(function(str){
        return (str) => {return 'lightblue';}
    });
    const [distColors, setDistColor] = React.useState(function(str){
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

    const loadData = () => {
        const stateSet = new Set();
        const stateArray = new Array();
        const districtSet = new Set();
        const districtArray = new Array();
        const sectorTypeSet = new Set();
        const sectorTypeArray = new Array();
        const areaSet = new Set();
        const areaArray = new Array();

        data.forEach(d => {
            stateSet.add(capitalize(d.state));
            districtSet.add(capitalize(d.district));
            sectorTypeSet.add(capitalize(d.sector));

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
    }

    const drawPie = () => {
        // Copyright 2021 Observable, Inc.
        // Released under the ISC license.
        // https://observablehq.com/@d3/pie-chart
        function PieChart(data, {
            name = ([x]) => x,  // given d in data, returns the (ordinal) label
            value = ([, y]) => y, // given d in data, returns the (quantitative) value
            title, // given d in data, returns the title text
            width = 640, // outer width, in pixels
            height = 400, // outer height, in pixels
            innerRadius = 0, // inner radius of pie, in pixels (non-zero for donut)
            outerRadius = Math.min(width, height) / 2, // outer radius of pie, in pixels
            labelRadius = (innerRadius * 0.2 + outerRadius * 0.8), // center radius of labels
            format = ",", // a format specifier for values (in the label)
            names, // array of names (the domain of the color scale)
            colors, // array of colors for names
            stroke = innerRadius > 0 ? "none" : "white", // stroke separating widths
            strokeWidth = 1, // width of stroke separating wedges
            strokeLinejoin = "round", // line join of stroke separating wedges
            padAngle = stroke === "none" ? 1 / outerRadius : 0, // angular separation between wedges
        } = {}) {
            // Compute values.
            const N = d3.map(data, name);
            const V = d3.map(data, value);
            const I = d3.range(N.length).filter(i => !isNaN(V[i]));
        
            // Unique the names.
            if (names === undefined) names = N;
            names = new d3.InternSet(names);
        
            // Chose a default color scheme based on cardinality.
            if (colors === undefined) colors = d3.schemeSpectral[names.size];
            if (colors === undefined) colors = d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), names.size);
        
            // Construct scales.
            const color = d3.scaleOrdinal(names, colors);
        
            // Compute titles.
            if (title === undefined) {
            const formatValue = d3.format(format);
            title = i => `${N[i]}\n${formatValue(V[i])}`;
            } else {
            const O = d3.map(data, d => d);
            const T = title;
            title = i => T(O[i], i, data);
            }
        
            // Construct arcs.
            const arcs = d3.pie().padAngle(padAngle).sort(null).value(i => V[i])(I);
            const arc = d3.arc().innerRadius(innerRadius).outerRadius(outerRadius);
            const arcLabel = d3.arc().innerRadius(labelRadius).outerRadius(labelRadius);
            
            const svg = d3.create("svg")
                .attr("width", width)
                .attr("height", height)
                .attr("id", "my-svg")
                .attr("viewBox", [-width / 2, -height / 2, width, height])
                .attr("style", "max-width: 100%; height: auto; height: intrinsic;");
        
            svg.append("g")
                .attr("stroke", stroke)
                .attr("stroke-width", strokeWidth)
                .attr("stroke-linejoin", strokeLinejoin)
            .selectAll("path")
            .data(arcs)
            .join("path")
                .attr("fill", d => sectorColor(N[d.data]))
                .attr("d", arc)
            .append("title")
                .text(d => title(d.data));
        
            svg.append("g")
                .attr("font-family", "sans-serif")
                .attr("font-size", 20)
                .attr("text-anchor", "middle")
            .selectAll("text")
            .data(arcs)
            .join("text")
                .attr("transform", d => `translate(${arcLabel.centroid(d)})`)
            .selectAll("tspan")
            .data(d => {
                const lines = `${title(d.data)}`.split(/\n/);
                return (d.endAngle - d.startAngle) > 0.25 ? lines : lines.slice(0, 1);
            })
            .join("tspan")
                .attr("x", 0)
                .attr("y", (_, i) => `${i * 1.1}em`)
                .attr("font-weight", (_, i) => i ? null : "bold")
                .text(d => d);
        
            return Object.assign(svg.node(), {scales: {color}});
        }

        // removing older svgs
        try {   
            d3.selectAll('#my-svg').remove(); 
        } catch {
            // nothing
        }

        const population = [
            {
                name: "a",
                value: 10,
            },
            {
                name: "b",
                value: 20
            }
        ]

        const availableSectors = new Set();
        curTableData.forEach(row => {
            if (row.state === curState){
                availableSectors.add(row.sector);
            }
        })


        const plotData = [];
        availableSectors.forEach(sector => {
            plotData.push({
                "sector": sector,
                "value": 0
            })
        })

        curTableData.forEach(row => {
            plotData.forEach(point => {
                if (row.state === curState && point.sector === row.sector){
                    point.value++;
                }
            })
        })

        const ele = PieChart(plotData, {
            name: d => d.sector,
            value: d => d.value,
            height: 500
          })

        const parent = document.getElementById('pie-div');
        parent.appendChild(ele);
    }

    const MapChart = () => {
        var mapSize = 640;
        if (screenSize.width < mapSize){
            mapSize = screenSize.width;
        }

        const mapSizeStr = mapSize+"px"

        const mapData = {
        }

        const curAreaSet = new Set();
        curTableData.forEach(row => {
            if (row.state === curState){
                const curArr = row.area.split(",");
                curArr.forEach(area => {
                    const areaName = area.trim();
                    curAreaSet.add(areaName);
                })
            }
        });

        curAreaSet.forEach(area => {
            mapData[area] = {
                'value': 0
            }
        })

        curTableData.forEach(row => {
            if (row.state === curState){
                const curArr = row.area.split(",");
                curArr.forEach(area => {
                    const areaName = area.trim();
                    curAreaSet.forEach(curArea => {
                        if (curArea === areaName){
                            mapData[curArea].value++;
                        }
                    })
                })
            }
        });

        return (
            <div style={{ position: "relative", width:mapSizeStr }}>
                <DatamapsIndia
                style={{ postion: "relative", left: "25%" }}
                regionData={mapData}
                hoverComponent={({ value }) => {
                    return (
                    <div>
                        <div>
                        {value.name + ":"} {value.value ? value.value + " Socities" : "No Societies"}
                        </div>
                    </div>
                    );
                }}
                mapLayout={{
                    title: "States in area of Operation",
                    legendTitle: "Number of societies with operations in the state",
                    startColor: "#b3d1ff",
                    endColor: "#005ce6",
                    hoverTitle: "Count",
                    noDataColor: "#f5f5f5",
                    borderColor: "#8D8D8D",
                    hoverColor: "blue",
                    hoverBorderColor: "green",
                    height: 10,
                    weight: 30
                }}
                />
            </div>
        );
      };

    React.useEffect(() => {
        setTimeout(() => {
            loadData();
            setLoading(false);

            if (screenSize.width >= 900){
                setNumPerPage(20);
            }
        }, 1000);
    }, []);


    React.useEffect(() => {
        if (!loading){
            const disSet = new Set();

            curTableData.forEach(row => {
                if (row.state === curState){
                    disSet.add(row.district);
                }
            })
    
            const disArr = [];
            disSet.forEach(d => {
                disArr.push(d);
            })
    
            setCurDistricts(disArr);
            drawPie();
        }
    }, [screenSize, loading, curState]);

    if (loading){
        return (
            <Loader/>
        );
    }  

    const handleStateChange = (e) => {
        console.log(e.target.value);
        if (e.target.value.length > 1){
            setCurState(e.target.value);
        }
    }

    const handlePageChange = (event, value) => {
        setPageNum(value);
    };

    const handleNumPerPageChange = (event) => {
        setNumPerPage(event.target.value);
    };

    const tabularData = () => {
        const filteredData = [];
        curTableData.forEach(row => {
            if (row.state === curState){    
                filteredData.push(row);
            }
        })

        const innerData = [];
        for (let i = numPerPage*(pageNum - 1); i < Math.min(filteredData.length, numPerPage*(pageNum)); i++) {
            const row = filteredData[i];

                innerData.push(
                    <Accordion>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                        className='hover:bg-slate-100'
                        >
                            <Typography>{row.name}
                                <span className="ml-4 pl-2 pr-2 rounded-full whitespace-nowrap" style={{
                                    backgroundColor:sectorColor(row.sector)
                                }}>{row.sector}</span>  
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            <Typography><span className="rounded-lg p-1 text-zinc-50 whitespace-nowrap" style={{
                                    backgroundColor:stateColor(row.state)
                                }}>{row.state}</span></Typography>
                            <div className='h-3'></div>
                            <Typography> <span className='italic border-2 rounded-lg p-1 bg-slate-100'>Address</span> {row.address} </Typography>
                            <div className='h-3'></div>
                            <Typography> <span className='italic border-2 rounded-lg p-1 bg-indigo-100'>District</span> {row.district} </Typography>
                            <div className='h-3'></div>
                            <Typography> <span className='italic border-2 rounded-lg p-1 bg-orange-100'>Date of Registration</span> {row.date} </Typography>
                            <div className='h-3'></div>
                            <Typography> <span className='italic border-2 rounded-lg p-1 bg-green-100'>Area of Operations</span> {row.area} </Typography>
                        </AccordionDetails>
                    </Accordion>
                )

        }

        return (
            <div className='flex items-center justify-center flex-col' id='my-table'>
                <div className="flex items-center justify-center flex-row mt-4">
                    <div className="flex items-center justify-center flex-row">
                        <FormControl sx={{ m: 1, minWidth: 120 }} size="small">
                            <InputLabel id="demo-simple-select-standard-label">No. of Societies</InputLabel>
                            <Select
                                labelId="demo-simple-select-standard-label"
                                id="demo-simple-select-standard"
                                value={numPerPage}
                                onChange={handleNumPerPageChange}
                                label="Age"
                                >
                                    <MenuItem value={5}>5</MenuItem>
                                    <MenuItem value={12}>12</MenuItem>
                                    <MenuItem value={20}>20</MenuItem>
                                    <MenuItem value={30}>30</MenuItem>
                                </Select>
                        </FormControl>
                        
                    </div>
                    <Pagination sx={{width: 120 }} count={Math.ceil(filteredData.length/numPerPage)} page={pageNum} onChange={handlePageChange} />
                </div> 
                <div className="md:ml-32 md:mr-32 ml-1 mr-1 mt-2 mb-10" id="table-div">
                    {innerData}
                </div>
            </div>
        );
    }
    
    return(
        <>
            <div className="flex items-center justify-center pt-5 flex-col">
                <div className='md:mt-0 mt-5'>
                    <span className="text-2xl font-extrabold md:text-3xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-cyan-400">State Statistics</span>
                </div>

                <div className="flex items-center justify-center mt-1 md:mt-4 flex-col">
                        <FormControl style={{minWidth: 250}}>
                        <InputLabel id="demo-simple-select-label">Select State</InputLabel>
                        
                        <Select value={curState} onChange={handleStateChange} x={{ m: 1, width: 200 }}>
                        {states?.map(option => {
                            return (
                                <MenuItem key={option} value={option}>
                                {option}
                                </MenuItem>
                            );
                        })}
                        </Select>
                        </FormControl>
                </div>

                <div className="info-div items-center justify-center mt-5 flex-col">

                    {screenSize.width > 800 ? 

                        <div  class="flex flex-col items-center bg-white border border-gray-200 rounded-lg shadow md:flex-row md:max-w-xl hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:hover:bg-gray-700">
                            <img class="object-cover w-full rounded-t-lg h-96 md:h-auto md:w-48 md:rounded-none md:rounded-l-lg" src="/images/MSCS_LOGO.png" alt="" />
                            <div class="flex flex-col justify-between p-4 leading-normal">
                                <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">General Information on {curState}</h5>
                                    <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">
                                    Lorem ipsum dolor sit amet consectetur, adipisicing elit. Eveniet sunt maxime reprehenderit iusto saepe praesentium quaerat molestiae dolorum, laboriosam itaque totam odit eius rerum! Modi nobis architecto at dignissimos suscipit!
                                    </p>

                                    <p class="mb-1 font-normal text-gray-700 dark:text-gray-400">
                                        Districts with societies:
                                    </p>

                                    <div class="mb-3 ml-2">
                                        {curDistricts.map(dist => 
                                            <div className='mb-0.5'><Typography ><span className="rounded-lg p-0.5 whitespace-nowrap" style={{
                                                backgroundColor:distColors(dist)
                                            }}>{dist}</span></Typography></div>
                                        )}
                                    </div>
                            
                            </div>
                        </div>

                    :
                        <div class="max-w-sm bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">

                                <img class="rounded-t-lg" src="/images/MSCS_LOGO.png" alt="" />

                            <div class="p-5">
                                <a href="#">
                                    <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">General Information on {curState}</h5>
                                </a>
                                <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">Lorem ipsum dolor sit amet consectetur adipisicing elit. Laudantium, numquam iste maxime ipsam sapiente odio doloremque, dolorum ea deserunt tempore impedit distinctio voluptas consequatur asperiores ducimus eveniet totam? Sapiente, iusto.</p>
                            

                                <p class="mb-1 font-normal text-gray-700 dark:text-gray-400">
                                        Districts with societies:
                                    </p>

                                    <div class="mb-3 ml-2">
                                        {curDistricts.map(dist => 
                                            <div className='mb-0.5'><Typography ><span className="rounded-lg p-0.5 whitespace-nowrap" style={{
                                                backgroundColor:distColors(dist)
                                            }}>{dist}</span></Typography></div>
                                        )}
                                    </div>
                            </div>
                        </div>
                    }

                </div>

                <div className="pie-div-class items-center justify-center mt-10 flex-col">
                    <div className="ml-1 items-center justify-center flex-col items-center mb-5">
                        <span className="text-l font-bold lg:text-xl text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-red-400">
                            Distribution of sector wise influence of state
                        </span>
                    </div>
                    <div id="pie-div" >

                    </div>
                </div>

                <div className="flex items-center justify-center mt-10 flex-col">
                    <Accordion className='mb-10'>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                        className='hover:bg-slate-100'
                        >
                            <Typography>Table of societies in {curState}
                                
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
                            {tabularData()}
                        </AccordionDetails>
                    </Accordion>
                </div>

                <div className="pie-div-class items-center justify-center mt-2 flex-col">
                    <div className="ml-1 items-center justify-center flex-col items-center w-full">
                        <span className="text-l font-bold lg:text-xl text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-red-400">
                            Influence on Surrounding States (touch state)
                        </span>
                    </div>
                    <div id="map-div" style={{ position: "relative" }} >
                        <MapChart style={{ position: "relative" }} />
                    </div>
                </div>
                
            </div>
        </>
    )
}