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
        const capitalize = (mySentence) => {
            const words = mySentence.split(" ");
        
            for (let i = 0; i < words.length; i++) {
                words[i] = words[i][0].toUpperCase() + words[i].toLowerCase().substr(1);
            }
            
            return words.join(" ");;
        }


export default function Areas(){
    

    const [vizValue, setVizValue] = React.useState(0);
    const handleVizToggle = (event, value) => {
        setVizValue(value);
    }
    const [packingSize, setPackingSize] = React.useState(500);
    const [tableData, setTableData] = React.useState([]);
    const [curTableData, setCurTableData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [states, setStates] = React.useState();
    const [districts, setDistricts] = React.useState();
    const [sectors, setSectors] = React.useState();
    const [areas, setAreas] = React.useState([]);
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

    const [stateFilter, setStateFilter] = React.useState([]);
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
        setStateFilter(areaArray);
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
        setStateFilter(areas);
    }

    const drawPacking = (width, height, data, padding=6) => {
        var color = d3.scaleLinear()
            .domain([0, 5])
            .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
            .interpolate(d3.interpolateHcl)
    
        var pack = data => d3.pack()
            .size([width, height])
            .padding(padding)
        (d3.hierarchy(data)
            .sum(d => d.value)
            .sort((a, b) => b.value - a.value))
    
        const root = pack(data);
        let focus = root;
        let view;
      
        const svg = d3.create("svg")
            // .attr("viewBox", `-${width / 2} -${height / 2} ${width} ${height}`)
            .attr("height", `${height}px`)
            .attr("width", `${width}px`)
            .style("display", "block")
            .attr("id", "my-svg")
            .style("margin", "0 -14px")
            .style("background", color(0))
            .style("cursor", "pointer")
            .on("click", (event) => zoom(event, root));
      
        const node = svg.append("g")
            .attr("transform", `translate(${width/2},${height/2})`)
            .selectAll("circle")
            .data(root.descendants().slice(1))
            .join("circle")
            .attr("fill", d => d.children ? color(d.depth) : "white")
            .attr("pointer-events", d => !d.children ? "none" : null)
            .on("mouseover", function() { d3.select(this).attr("stroke", "#000"); })
            .on("mouseout", function() { d3.select(this).attr("stroke", null); })
            .on("click", (event, d) => focus !== d && (zoom(event, d), event.stopPropagation()));
      
        const myFont = screenSize.width < 500 ? 15 : 20;

        const label = svg.append("g")
            .attr("transform", `translate(${width/2},${height/2})`)
            .style("font", `${myFont}px sans-serif`)
            .attr("pointer-events", "none")
            .attr("text-anchor", "middle")
          .selectAll("text")
          .data(root.descendants())
          .join("text")
            .style("fill-opacity", d => d.parent === root ? 1 : 0)
            .style("display", d => d.parent === root ? "inline" : "none")
            .text(d => d.parent === root ? d.data.name : d.data.name + " - " + d.data.value);
      
        zoomTo([root.x, root.y, root.r * 2]);
      
        function zoomTo(v) {
          const k = width / v[2];
      
          view = v;
      
          label.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
          node.attr("transform", d => `translate(${(d.x - v[0]) * k},${(d.y - v[1]) * k})`);
          node.attr("r", d => d.r * k);
        }
      
        function zoom(event, d) {
          const focus0 = focus;
      
          focus = d;
      
          const transition = svg.transition()
              .duration(event.altKey ? 7500 : 750)
              .tween("zoom", d => {
                const i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2]);
                return t => zoomTo(i(t));
              });
      
          label
            .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
            .transition(transition)
              .style("fill-opacity", d => d.parent === focus ? 1 : 0)
              .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
              .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
        }
      
        return svg.node();
    }

    const drawSectors = () => {
        console.log("Drawing sectors as heading and areas as circles");

        // removing older svgs
        try {   
            d3.selectAll('#my-svg').remove();
        } catch {
            // nothing
        }

        const plotData = {
            name: "sectors",
            children: [
            ]
        }

        sectorFilter.forEach(sector => {
            const stateArr = [];
            curTableData.forEach(row => {
                if (row.sector === sector){
                    
                    stateFilter.forEach(area => {
                            const rowAreasStr = row.area.split(",");
                            const rowAreaArr = [];
                            rowAreasStr.forEach(d => {
                                rowAreaArr.push(d.trim());
                            })
                            
                            if (rowAreaArr.includes(area)){
                                var found = false;
                                stateArr.forEach(d => {
                                    if (d.name === area){
                                        d.value++;
                                        found = true;
                                    }
                                })

                                if (!found){
                                    stateArr.push({
                                        name: area,
                                        value: 1
                                    })
                                }
                            }
                    })
                }
            })

            if (stateArr.length > 0){
                plotData.children.push({
                    name: sector,
                    children: stateArr
                })
            }
        });
        

        const ele = drawPacking(packingSize, packingSize, plotData);

        const parent = document.getElementById('chart-div');
        parent.appendChild(ele);
    }

    const drawStates = () => {
        console.log("Drawing sectors as heading and areas as circles");

        // removing older svgs
        try {   
            d3.selectAll('#my-svg').remove();
        } catch {
            // nothing
        }

        const plotData = {
            name: "areas",
            children: [
            ]
        }

        stateFilter.forEach(area => {
            const sectorArr = [];
            curTableData.forEach(row => {
                const rowAreasStr = row.area.split(",");
                const rowAreaArr = [];
                rowAreasStr.forEach(d => {
                    rowAreaArr.push(d.trim());
                })

                if (rowAreaArr.includes(area)){
                    sectorFilter.forEach(sector => {                    
                            if (row.sector === sector){
                                var found = false;
                                sectorArr.forEach(d => {
                                    if (d.name === sector){
                                        d.value++;
                                        found = true;
                                    }
                                })

                                if (!found){
                                    sectorArr.push({
                                        name: sector,
                                        value: 1
                                    })
                                }
                            }
                    })
                }
            })

            if (sectorArr.length > 0){
                plotData.children.push({
                    name: area,
                    children: sectorArr
                })
            }
        });
        

        const ele = drawPacking(packingSize, packingSize, plotData);

        const parent = document.getElementById('chart-div');
        parent.appendChild(ele);
    }

    React.useEffect(() => {
        setTimeout(() => {
            loadData();
            setLoading(false);
        }, 1000);
    }, []);

    React.useEffect(() => {
        if (screenSize.width >= 900){
            setPackingSize(850);
        } else {
            setPackingSize(screenSize.width*0.9);
        }
    }, [screenSize]);

    React.useEffect(() => {
        if (!loading){
            if (vizValue === 0){
                drawSectors();
            } else {
                drawStates();
            }
        }
    }, [loading, vizValue, screenSize, stateFilter, sectorFilter]);

    const bigScreenFilters = () => {
        return (
<div className="filter-div mt-10 flex items-center justify-center flex-row">                   
                    <div className='ml-10 flex items-center justify-center flex-row'>
                        <FormControl sx={{ m: 1, width: 200 }} size="small">
                            <InputLabel id="demo-multiple-checkbox-label">Areas under consideration</InputLabel>
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
                                {areas.map((name) => (
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
                                    <InputLabel id="demo-multiple-checkbox-label">Areas under consideration</InputLabel>
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
                                        {areas.map((name) => (
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
                    <span className="text-2xl font-extrabold md:text-3xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-cyan-400">Area of Operations</span>
                </div>
            </div>

            <div className="flex items-center justify-center pt-5 flex-col">
                <Tabs value={vizValue} onChange={handleVizToggle} aria-label="disabled tabs example">
                    <Tab label="Areas per Sector" />
                    <Tab label="Sectors per Area" />
                </Tabs>               
            </div>

            {screenSize.width>=900 ? bigScreenFilters(): smallScreenFilters()}

            <div className="flex items-center justify-center align-center flex-col text-l mt-1">
                    <div className='flex flex items-center justify-center flex-col'>
                        <div className="text-cyan-950 text-sm">
                            See drop down list for other visualizations. 
                        </div>
                        <div className='flex items-center justify-center'>
                            <p className='text-center'>
                            Two ways of viewing how many areas are supported by which sectors. Touch the circles for expansion.
                            </p>
                        </div>
                    </div>
            </div>

            <div id="chart-div" className="flex items-center justify-center pt-1 flex-co mb-10">

            </div>
        </>
    )
}