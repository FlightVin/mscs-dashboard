import React from 'react';
import * as d3 from 'd3';
import * as d3Sankey from "d3-sankey"

import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

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


import data from '../../data/data.json';
import Loader from '../loader/loader';

        const ITEM_HEIGHT = 48;
        const ITEM_PADDING_TOP = 8;
        const MenuProps = {
          PaperProps: {
            style: {
              maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
              width: 100,
            },
          },
        };

// Inspiration from Observable, Inc.
function SankeyChart({
    nodes,
    links 
}, {
    format = ",", 
    align = "justify", 
    nodeId = d => d.id, 
    nodeGroup, 
    nodeGroups, 
    nodeLabel, 
    nodeTitle = d => `${d.id}\n${format(d.value)}`,
    nodeAlign = align, 
    nodeWidth = 15, 
    nodePadding = 10,
    nodeLabelPadding = 6,
    nodeStroke = "currentColor",
    nodeStrokeWidth,
    nodeStrokeOpacity, 
    nodeStrokeLinejoin, 
    linkSource = ({source}) => source, 
    linkTarget = ({target}) => target, 
    linkValue = ({value}) => value,
    linkPath = d3Sankey.sankeyLinkHorizontal(), 
    linkTitle = d => `${d.source.id} → ${d.target.id}\n${format(d.value)}`,
    linkColor = "source-target",
    linkStrokeOpacity = 0.5,
    linkMixBlendMode = "multiply", 
    colors = d3.schemeTableau10,
    width = 640, 
    height = 400, 
    marginTop = 5, 
    marginRight = 1, 
    marginBottom = 5, 
    marginLeft = 1,
} = {}) {
    if (typeof nodeAlign !== "function") nodeAlign = {
    left: d3Sankey.sankeyLeft,
    right: d3Sankey.sankeyRight,
    center: d3Sankey.sankeyCenter
    }[nodeAlign] ?? d3Sankey.sankeyJustify;

    const LS = d3.map(links, linkSource).map(intern);
    const LT = d3.map(links, linkTarget).map(intern);
    const LV = d3.map(links, linkValue);
    if (nodes === undefined) nodes = Array.from(d3.union(LS, LT), id => ({id}));
    const N = d3.map(nodes, nodeId).map(intern);
    const G = nodeGroup == null ? null : d3.map(nodes, nodeGroup).map(intern);

    nodes = d3.map(nodes, (_, i) => ({id: N[i]}));
    links = d3.map(links, (_, i) => ({source: LS[i], target: LT[i], value: LV[i]}));

    if (!G && ["source", "target", "source-target"].includes(linkColor)) linkColor = "currentColor";

    if (G && nodeGroups === undefined) nodeGroups = G;

    const color = nodeGroup == null ? null : d3.scaleOrdinal(nodeGroups, colors);

    d3Sankey.sankey()
        .nodeId(({index: i}) => N[i])
        .nodeAlign(nodeAlign)
        .nodeWidth(nodeWidth)
        .nodePadding(nodePadding)
        .extent([[marginLeft, marginTop], [width - marginRight, height - marginBottom]])
    ({nodes, links});

    if (typeof format !== "function") format = d3.format(format);
    const Tl = nodeLabel === undefined ? N : nodeLabel == null ? null : d3.map(nodes, nodeLabel);
    const Tt = nodeTitle == null ? null : d3.map(nodes, nodeTitle);
    const Lt = linkTitle == null ? null : d3.map(links, linkTitle);

    const uid = `O-${Math.random().toString(16).slice(2)}`;

    const svg = d3.create("svg")
        .attr("width", width)
        .attr("height", height)
        .attr('id', 'my-svg')
        .attr("viewBox", [0, 0, width, height])
        .attr("style", "max-width: 100%; height: auto; height: intrinsic;");

    const node = svg.append("g")
        .attr("stroke", nodeStroke)
        .attr("stroke-width", nodeStrokeWidth)
        .attr("stroke-opacity", nodeStrokeOpacity)
        .attr("stroke-linejoin", nodeStrokeLinejoin)
    .selectAll("rect")
    .data(nodes)
    .join("rect")
        .attr("x", d => d.x0)
        .attr("y", d => d.y0)
        .attr('class', 'title-rect')
        .attr("height", d => d.y1 - d.y0)
        .attr("width", d => d.x1 - d.x0);

    if (G) node.attr("fill", ({index: i}) => color(G[i]));
    if (Tt) node.append("title").text(({index: i}) => Tt[i]);

    const link = svg.append("g")
        .attr("fill", "none")
        .attr("stroke-opacity", linkStrokeOpacity)
        .attr("class", "disaster-path")
    .selectAll("g")
    .data(links)
    .join("g")
        .style("mix-blend-mode", linkMixBlendMode);

    if (linkColor === "source-target") link.append("linearGradient")
        .attr("id", d => `${uid}-link-${d.index}`)
        .attr("gradientUnits", "userSpaceOnUse")
        .attr("x1", d => d.source.x1)
        .attr("x2", d => d.target.x0)
        .call(gradient => gradient.append("stop")
            .attr("offset", "0%")
            .attr("stop-color", ({source: {index: i}}) => color(G[i])))
        .call(gradient => gradient.append("stop")
            .attr("offset", "100%")
            .attr("stop-color", ({target: {index: i}}) => color(G[i])));

    link.append("path")
        .attr("d", linkPath)
        .attr("stroke", linkColor === "source-target" ? ({index: i}) => `url(#${uid}-link-${i})`
            : linkColor === "source" ? ({source: {index: i}}) => color(G[i])
            : linkColor === "target" ? ({target: {index: i}}) => color(G[i])
            : linkColor)
        .attr("stroke-width", ({width}) => Math.max(1, width))
        .call(Lt ? path => path.append("title").text(({index: i}) => Lt[i]) : () => {});

    if (Tl) svg.append("g")
        .attr("font-family", "sans-serif")
        .attr("font-size", 15)
    .selectAll("text")
    .data(nodes)
    .join("text")
        .attr("x", d => d.x0 < width / 2 ? d.x1 + nodeLabelPadding : d.x0 - nodeLabelPadding)
        .attr("y", d => (d.y1 + d.y0) / 2)
        .attr("dy", "0.35em")
        .attr("text-anchor", d => d.x0 < width / 2 ? "start" : "end")
        .text(({index: i}) => Tl[i]);

    function intern(value) {
    return value !== null && typeof value === "object" ? value.valueOf() : value;
    }

    return Object.assign(svg.node(), {scales: {color}});
    // return <></>
}

const capitalize = (mySentence) => {
    const words = mySentence.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].toLowerCase().substr(1);
    }
    
    return words.join(" ");;
}

const minScreenSanky = 200;

export default function SectorsInStates(){
    

    const [vizValue, setVizValue] = React.useState(0);
    const handleVizToggle = (event, value) => {
        setVizValue(value);
        if (value === 1){
            setStateFilter([states[0], states[1], states[2], states[3]])
        }
    }

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

    const [stateFilter, setStateFilter] = React.useState();
    const [sectorFilter, setSectorFilter] = React.useState();

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
        setStateFilter(stateArray);
        setDistricts(districtArray);
        setAreas(areaArray);
        setSectors(sectorTypeArray);
        setSectorFilter(sectorTypeArray);
    }

    const handleStateFilterChange = (event) => {
        if (event.target.value.length === 0){
            setStateFilter(["Andhra Pradesh"]);
        } else {
            setStateFilter(event.target.value);
        }
    }
    const clearStateFilters = () => {
        setStateFilter(["Andhra Pradesh"]);
    }

    const handleSectorFilterChange = (event) => {
        if (event.target.value.length === 0){
            setSectorFilter(["Agro"]);
        } else {
            setSectorFilter(event.target.value);
        }
    }
    const clearSectorFilter = () => {
        setSectorFilter(["Agro"]);
    }

    const deleteFilters = () => {
        setSectorFilter(sectors);
        setStateFilter(states);
    }

    const drawSankey = () => {
        console.log("Drawing Sankey");

        // removing older svgs
        try {   
            d3.selectAll('#my-svg').remove();
        } catch {
            // nothing
        }

        const plotData = [];

        stateFilter.forEach(state => {
            sectorFilter.forEach(sector => {
                plotData.push({
                    source: state,
                    target: sector,
                    value: 0
                })
            })
        })

        curTableData.forEach(row => {
            plotData.forEach(point => {
                if (point.source === row.state && point.target === row.sector){
                    point.value++;
                }
            })
        })

        const ele = SankeyChart({
            links: plotData
            }, {
            nodeGroup: d => d.id,
            nodeAlign:'justify', 
            linkColor:'source', 
            format: (f => d => `${f(d)} Occurances`)(d3.format(",.1~f")),
            width:Math.min(screenSize.width*0.8, 1300),
            height:Math.min(screenSize.height*0.8, 900),
            });

        const parent = document.getElementById('chart-div');
        parent.appendChild(ele);
    }

    const drawBar = () => {
        console.log("Drawing Bar");

        // removing older svgs
        try {   
            d3.selectAll('#my-svg').remove();
        } catch {
            // nothing
        }

        const plotData = [];

        stateFilter.forEach(state => {
            sectorFilter.forEach(sector => {
                plotData.push({
                    source: state,
                    target: sector,
                    value: 0
                })
            })
            plotData.push({
                source: state,
                target: "total",
                value: 0
            })
        })

        curTableData.forEach(row => {
            plotData.forEach(point => {
                if (point.source === row.state && point.target === row.sector){
                    point.value++;
                }

                if (point.source === row.state && point.target === "total"){
                    point.value++;
                }
            })
        })

        var maxNum = 0;
        plotData.forEach(row => {
            maxNum = Math.max(maxNum, row.value);
        })

        var margin = {top: 10, right: 30, bottom: 20, left: 50},
            width = screenSize.width*0.8 - margin.left - margin.right,
            height = screenSize.height*0.6 - margin.top - margin.bottom;

        if (screenSize.width < 500){
            margin.left = 20;
            width = screenSize.width*0.9 - margin.left - margin.right
        }

        const svg = d3.select("#chart-div")
            .append("svg")
            .attr("width", width + margin.left + margin.right)
            .attr("height", height + margin.top + margin.bottom)
            .attr("id", "my-svg")
            .append("g")
            .attr("transform",`translate(${margin.left},${margin.top})`);
    
        const subgroups = sectorFilter;
        const groups = stateFilter;
        
        // Add X axis
        const x = d3.scaleBand()
            .domain(groups)
            .range([0, width])
            .padding([0.2])
        svg.append("g")
            .attr("transform", `translate(0, ${height})`)
            .call(d3.axisBottom(x).tickSizeOuter(0));

        // Add Y axis
        const y = d3.scaleLinear()
            .domain([0, maxNum*1.4])
            .range([ height, 0 ]);
        svg.append("g")
            .call(d3.axisLeft(y));

        const color = sectorColor;

        const chartData = [];

        stateFilter.forEach(state => {
            var addedData = {
                'group': state,
            }
            sectorFilter.forEach(sector => {
                plotData.forEach(row => {
                    if (row.source === state && row.target === sector){
                        addedData[sector] = row.value
                    }
                })
            })
            chartData.push(addedData);
        })

        const stackedData = d3.stack()
        .keys(subgroups)
        (chartData)
        // console.log(stackedData)

        const tooltip = d3.select("#chart-div")
            .append("div")
            .style("opacity", 0)
            .style("position", "absolute")
            .attr("class", "tooltip")
            .style("background-color", "white")
            .style("border", "solid")
            .attr("id", "my-svg")
            .style("border-width", "1px")
            .style("border-radius", "5px")
            .style("padding", "2px")
            .style("z-index", "10")
            .style("font-size", "13px")

        const mouseover = function(event, d) {
            // console.log(d);
            const subgroupName = d3.select(this.parentNode).datum().key;
            const subgroupValue = d.data[subgroupName];
            // console.log(subgroupName, subgroupValue)
            tooltip
                .html("Sector: " + subgroupName + "<br>" + "Societies: " + subgroupValue)
                .style("opacity", 1)

        }
        const mousemove = function(e, d) {
            tooltip
                .style("left", e.pageX + 20 + "px")
                .style("top", e.pageY + "px");
        }
        const mouseleave = function(event, d) {
            tooltip
            .style("opacity", 0)
        }

        // Show the bars
        svg.append("g")
            .selectAll("g")
            .data(stackedData)
            .join("g")
            .attr("fill", d => color(d.key))
            .selectAll("rect")
            .data(d => d)
            .join("rect")
                .attr("x", d =>  x(d.data.group))
                .attr("y", d => y(d[1]))
                .attr("height", d => y(d[0]) - y(d[1]))
                .attr("width",x.bandwidth())
                .attr("stroke", "grey")
                .on("mouseover", mouseover)
                .on("mousemove", mousemove)
                .on("mouseleave", mouseleave)

        for (let i = 1; i<=sectors.length; i++){
            svg.append("circle").attr("cx",30).attr("cy",10+i*20).attr("r", 6).style("fill", sectorColor(sectors[i-1]))
            svg.append("text").attr("x", 45).attr("y", 10+i*20).text(sectors[i-1])
                .attr("id", "legend-"+sectors[i-1].slice(0, 4))
                .style("font-size", "11px").attr("alignment-baseline","middle")          
        }

    }

    React.useEffect(() => {
        setTimeout(() => {
            loadData();
            setLoading(false);
        }, 1000);
    }, []);

    React.useEffect(() => {
        if (screenSize.width < minScreenSanky){
            setVizValue(1);
        }
    }, [screenSize]);

    React.useEffect(() => {
        if (!loading){
            if (vizValue === 0){
                drawSankey();
            } else {
                drawBar();
            }
        }
    }, [loading, vizValue, screenSize, stateFilter, sectorFilter]);

    const bigScreenFilters = () => {
        return (
<div className="filter-div mt-10 flex items-center justify-center flex-row">                   
                    <div className='ml-10 flex items-center justify-center flex-row'>
                        <FormControl sx={{ m: 1, width: 200 }} size="small">
                            <InputLabel id="demo-multiple-checkbox-label">States</InputLabel>
                            <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={stateFilter}
                            onChange={handleStateFilterChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                            >
                                {states.map((name) => (
                                    <MenuItem key={name} value={name}>
                                    <Checkbox checked={stateFilter.includes(name)} />
                                    <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Tooltip title="Remove all filters" onClick={clearStateFilters}>
                            <IconButton  size="small">
                                <ClearIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>

                    <div className='ml-6 flex items-center justify-center flex-row'>
                        <FormControl sx={{ m: 1, width: 200 }} size="small">
                            <InputLabel id="demo-multiple-checkbox-label">Sectors</InputLabel>
                            <Select
                            labelId="demo-multiple-checkbox-label"
                            id="demo-multiple-checkbox"
                            multiple
                            value={sectorFilter}
                            onChange={handleSectorFilterChange}
                            input={<OutlinedInput label="Tag" />}
                            renderValue={(selected) => selected.join(', ')}
                            MenuProps={MenuProps}
                            >
                                {sectors.map((name) => (
                                    <MenuItem key={name} value={name}>
                                    <Checkbox checked={sectorFilter.includes(name)} />
                                    <ListItemText primary={name} />
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>

                        <Tooltip title="Remove all filters" onClick={clearSectorFilter}>
                            <IconButton  size="small">
                                <ClearIcon/>
                            </IconButton>
                        </Tooltip>
                    </div>

                    <div className='ml-6 border-2 border-indigo-500 rounded-full'>
                        <Tooltip title="Reset all filters" onClick={deleteFilters}>
                                <IconButton>
                                    <RotateLeftIcon/>
                                </IconButton>
                        </Tooltip>
                    </div>
                </div>
        );
    }

    const smallScreenFilters = () => {
        return (
            <div className='flex items-center mt-4 justify-center flex-col' >
            <Accordion>
            <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                        classN> Filters </AccordionSummary>
                        <AccordionDetails>
                        <div className="filter-div flex items-center justify-center flex-col">
  
                            
                            <div className='ml-10 flex items-center justify-center flex-row'>
                                <FormControl sx={{ m: 1, width: 200 }} size="small">
                                    <InputLabel id="demo-multiple-checkbox-label">States</InputLabel>
                                    <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={stateFilter}
                                    onChange={handleStateFilterChange}
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                    >
                                        {states.map((name) => (
                                            <MenuItem key={name} value={name}>
                                            <Checkbox checked={stateFilter.includes(name)} />
                                            <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Tooltip title="Remove all filters" onClick={clearStateFilters}>
                                    <IconButton  size="small">
                                        <ClearIcon/>
                                    </IconButton>
                                </Tooltip>
                            </div>

        
                            <div className='ml-10 flex items-center justify-center flex-row'>
                                <FormControl sx={{ m: 1, width: 200 }} size="small">
                                    <InputLabel id="demo-multiple-checkbox-label">Sectors</InputLabel>
                                    <Select
                                    labelId="demo-multiple-checkbox-label"
                                    id="demo-multiple-checkbox"
                                    multiple
                                    value={sectorFilter}
                                    onChange={handleSectorFilterChange}
                                    input={<OutlinedInput label="Tag" />}
                                    renderValue={(selected) => selected.join(', ')}
                                    MenuProps={MenuProps}
                                    >
                                        {sectors.map((name) => (
                                            <MenuItem key={name} value={name}>
                                            <Checkbox checked={sectorFilter.includes(name)} />
                                            <ListItemText primary={name} />
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>

                                <Tooltip title="Remove all filters" onClick={clearSectorFilter}>
                                    <IconButton  size="small">
                                        <ClearIcon/>
                                    </IconButton>
                                </Tooltip>


                            </div>

                            <div className='border-2 border-indigo-500 rounded-full'>
                                <Tooltip title="Reset all filters" onClick={deleteFilters}>
                                        <IconButton size="small">
                                            Clear filters <RotateLeftIcon/>
                                        </IconButton>
                                </Tooltip>
                            </div> 
                        </div>
                        </AccordionDetails>
            </Accordion>
            </div>
        );
    }

    if (loading){
        return (
            <Loader/>
        );
    }  
    
    return(
        <>
            <div className="flex items-center justify-center pt-5 flex-col">
                <div className='md:mt-0 mt-5'>
                    <span className="text-2xl font-extrabold md:text-3xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-cyan-400">Sectors in States</span>
                </div>
            </div>

            <div className="flex items-center justify-center pt-5 flex-col">
                <Tabs value={vizValue} onChange={handleVizToggle} aria-label="disabled tabs example">
                { screenSize.width>=minScreenSanky?
                    <Tab label="Sanky Chart" />
                :
                    <Tab label="Sanky Chart" disabled/>
                }
                <Tab label="Bar CHart" />
                </Tabs>
            </div>
            
            {screenSize.width>=900 ? bigScreenFilters(): smallScreenFilters()}

            <div id="chart-div" className="flex items-center justify-center pt-5 flex-co mb-10">

            </div>
        </>
    )
}