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
import './trends.css'

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
        setStateFilter(stateArray);
        setDistricts(districtArray);
        setAreas(areaArray);
        setSectors(sectorTypeArray);
        setDates(dateArray);
        setCurDates(dateArray);
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

    const drawChart = () => {
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
                    if (sector === d.sector && stateFilter.includes(d.state) && rowDate.getMonth() === curDate.getMonth() && rowDate.getFullYear() === curDate.getFullYear()){
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

        sectorFilter.forEach(sector => {
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
    
        for (let i = 1; i<=sectorFilter.length; i++){
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
        if (!loading) drawChart();
    }, [loading, screenSize, curDates, stateFilter, sectorFilter]);

    React.useEffect(() => {
        if (myDiv){
            setTimeout(() => {
                for (let i = 0; i<145; i++){
                    setTimeout(() => {
                        myDiv.scrollBy(10, 0);
                    }, i*4);
                }
        }, 500);
        }
    }, [myDiv])

    const bigScreenFilters = () => {
        return (
<div className="filter-div mt-4 flex items-center justify-center flex-row">                   
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
            <div className='flex items-center justify-center flex-col' >
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
                <div className='md:mt-0 mt-5 pl-10 md:pl-0'>
                    <span className="text-2xl font-extrabold md:text-3xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-cyan-400">Registration Trends</span>
                </div>
            </div>


            <div className="flex items-center justify-center align-center mt-1 flex-col text-l">
                    <div className='flex flex items-center justify-center flex-col'>
                        <div className="text-cyan-950 text-sm">
                            See drop down list for other visualizations. 
                        </div>
                        <div className='flex items-center justify-center'>
                            <p className='text-center'>
                            Analyze trends and temporal patterns in number of registrations. Hover over lines for highlighting.
                            </p>
                        </div>
                    </div>
            </div>

            {screenSize.width>=900 ? bigScreenFilters(): smallScreenFilters()}


            <div id="plot-div" className="pt-5 md:pl-10 md:pr-10 pl-4 pr-4">

            </div>
            
        </>
    )
}

export default Trends;