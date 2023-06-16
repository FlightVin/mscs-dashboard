import React from 'react';
import * as d3 from 'd3';
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
import NavBar from '../header/header';
import Loader from '../loader/loader';

const capitalize = (mySentence) => {
    const words = mySentence.split(" ");

    for (let i = 0; i < words.length; i++) {
        words[i] = words[i][0].toUpperCase() + words[i].toLowerCase().substr(1);
    }
    
    return words.join(" ");;
}

const Societies = () => {
    const [tableData, setTableData] = React.useState([]);
    const [curTableData, setCurTableData] = React.useState([]);
    const [loading, setLoading] = React.useState(true);
    const [states, setStates] = React.useState();
    const [districts, setDistricts] = React.useState();
    const [sectors, setSectors] = React.useState();
    const [areas, setAreas] = React.useState();
    const [searchParam, setSearchParam] = React.useState("");
    const [stateFilter, setStateFilter] = React.useState();
    const [sectorFilter, setSectorFilter] = React.useState();
    const [sortCriteria, setSortCriteria] = React.useState(
        {
            "attribute": null,
            "order": 1
        }
    )

    const [numPerPage, setNumPerPage] = React.useState(5);
    const [pageNum, setPageNum] = React.useState(1);

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
            return d3.scaleOrdinal(d3.schemePastel2)
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

    React.useEffect(() => {
        setTimeout(() => {
            loadData();
            setLoading(false);

            if (screenSize.width >= 900){
                setNumPerPage(20);
            }
        }, 1000);
    }, []);

    const handlePageChange = (event, value) => {
        setPageNum(value);
    };

    const handleNumPerPageChange = (event) => {
        setNumPerPage(event.target.value);
    };

    const handleSearchText = (event) => {
        setSearchParam(event.target.value.toLowerCase());
    };

    const handleStateFilterChange = (event) => {
        setStateFilter(event.target.value);
    }
    const clearStateFilters = () => {
        setStateFilter([]);
    }

    const handleSectorFilterChange = (event) => {
        setSectorFilter(event.target.value);
    }
    const clearSectorFilter = () => {
        setSectorFilter([]);
    }

    const deleteFilters = () => {
        setSectorFilter(sectors);
        setStateFilter(states);
    }

    const handleSortCriteriaChange = (event) => {
        setSortCriteria({
            "order": sortCriteria.order,
            "attribute": event.target.value,
        })
    }

    const toggleSort = () => {
        setSortCriteria({
            "attribute": sortCriteria.attribute,
            "order": sortCriteria.order*-1
        })
    }

    const smallScreenAcc = () => {

        const filteredData = [];
        curTableData.forEach(row => {
            const searchSatis = (row.name.toLowerCase().search(searchParam) !== -1);
            const stateFilterSatis = (stateFilter.includes(row.state));
            const sectorFilterSatis = sectorFilter.includes(row.sector);

            if (searchSatis && stateFilterSatis && sectorFilterSatis){
                filteredData.push(row);
            }
        })

        if (sortCriteria.attribute){
            // console.log(sortCriteria.attribute, sortCriteria.order)
            filteredData.sort((a, b) => {
                const firstEle = a[sortCriteria.attribute].toLowerCase();
                const secondEle = b[sortCriteria.attribute].toLowerCase();

                // console.log(firstEle, secondEle);

                if (firstEle > secondEle){
                    return sortCriteria.order;
                }

                if (secondEle > firstEle){
                    return -sortCriteria.order;
                }
                
                return 0;
            })
        }

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
        
        return (
            <div className='flex items-center justify-center flex-col' id='my-table'>
                    <Accordion>
                        <AccordionSummary
                        expandIcon={<ExpandMoreIcon />}
                        aria-controls="panel2a-content"
                        id="panel2a-header"
                        classN> Filters </AccordionSummary>
                        <AccordionDetails>
                        <div className="filter-div flex items-center justify-center flex-col">
                            <div className='pb-2 border-b mb-1'>
                                <TextField  type="search" id="search" label="Search" sx={{ width: 350 }} size="small"
                                    onSelect={handleSearchText}
                                />
                            </div>
                            
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
                        

                        <div className='sort-div mt-2 border-t flex items-center justify-center flex-row'>
                            <div className="flex items-center justify-center flex-row">
                                    <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
                                        <InputLabel id="demo-simple-select-standard-label">Sort by</InputLabel>
                                        <Select
                                            labelId="demo-simple-select-standard-label"
                                            id="demo-simple-select-standard"
                                            value={sortCriteria.attribute}
                                            onChange={handleSortCriteriaChange}
                                            label="Age"
                                            >
                                                <MenuItem value={null}>
                                                    <em>None</em>
                                                </MenuItem>
                                                <MenuItem value={"name"}>Society Name</MenuItem>
                                                <MenuItem value={"state"}>States</MenuItem>
                                                <MenuItem value={"district"}>District</MenuItem>
                                            </Select>
                                    </FormControl>
                                    
                            </div>

                            <div className='ml-2 border-2 border-black-500'>
                                    {sortCriteria.order > 0 ?

                                        <Tooltip title="Sort in DESCENDING order instead" onClick={toggleSort}>
                                                <IconButton size="small">
                                                    <ArrowDownwardIcon />
                                                </IconButton>
                                        </Tooltip>

                                    :

                                        <Tooltip title="Sort in ASCENDING order instead" onClick={toggleSort}>
                                                <IconButton size="small">
                                                    <ArrowUpwardIcon />
                                                </IconButton>
                                        </Tooltip>
                                    }
                            </div>
                        </div>
                        </AccordionDetails>
                    </Accordion>
                
                
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

    const bigScreenAcc = () => {

        const filteredData = [];
        curTableData.forEach(row => {
            const searchSatis = (row.name.toLowerCase().search(searchParam) !== -1);
            const stateFilterSatis = (stateFilter.includes(row.state));
            const sectorFilterSatis = sectorFilter.includes(row.sector);

            if (searchSatis && stateFilterSatis && sectorFilterSatis){
                filteredData.push(row);
            }
        })

        if (sortCriteria.attribute){
            // console.log(sortCriteria.attribute, sortCriteria.order)
            filteredData.sort((a, b) => {
                const firstEle = a[sortCriteria.attribute].toLowerCase();
                const secondEle = b[sortCriteria.attribute].toLowerCase();

                // console.log(firstEle, secondEle);

                if (firstEle > secondEle){
                    return sortCriteria.order;
                }

                if (secondEle > firstEle){
                    return -sortCriteria.order;
                }
                
                return 0;
            })
        }

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
                                <span className="ml-4 pl-2 pr-2 text-zinc-50 whitespace-nowrap" style={{
                                    backgroundColor:stateColor(row.state)
                                }}>{row.state}</span> 
                            </Typography>
                        </AccordionSummary>

                        <AccordionDetails>
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
        
        return (
            <div className='flex items-center justify-center flex-col' id='my-table'>

                <div className="filter-div mt-10 flex items-center justify-center flex-row">
                    <div>
                        <TextField  type="search" id="search" label="Search" sx={{ width: 350 }} size="small"
                            onSelect={handleSearchText}
                        />
                    </div>
                    
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

                <div className='sort-div mt-4 flex items-center justify-center flex-row'>
                    <div className="flex items-center justify-center flex-row">
                            <FormControl sx={{ m: 1, minWidth: 300 }} size="small">
                                <InputLabel id="demo-simple-select-standard-label">Sort by</InputLabel>
                                <Select
                                    labelId="demo-simple-select-standard-label"
                                    id="demo-simple-select-standard"
                                    value={sortCriteria.attribute}
                                    onChange={handleSortCriteriaChange}
                                    label="Age"
                                    >
                                        <MenuItem value={null}>
                                            <em>None</em>
                                        </MenuItem>
                                        <MenuItem value={"name"}>Society Name</MenuItem>
                                        <MenuItem value={"state"}>States</MenuItem>
                                        <MenuItem value={"district"}>District</MenuItem>
                                        {/* <MenuItem value={"date"}>Date of Registration</MenuItem> */}
                                    </Select>
                            </FormControl>
                            
                    </div>

                    <div className='ml-2 border-2 border-black-500'>
                            {sortCriteria.order > 0 ?

                                <Tooltip title="Sort in DESCENDING order instead" onClick={toggleSort}>
                                        <IconButton size="small">
                                            <ArrowDownwardIcon />
                                        </IconButton>
                                </Tooltip>

                            :

                                <Tooltip title="Sort in ASCENDING order instead" onClick={toggleSort}>
                                        <IconButton size="small">
                                            <ArrowUpwardIcon />
                                        </IconButton>
                                </Tooltip>
                            }
                    </div>
                </div>
                
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
                    <Pagination count={Math.ceil(filteredData.length/numPerPage)} page={pageNum} onChange={handlePageChange} />
                </div>
                
                <div className="md:ml-32 md:mr-32 ml-2 mr-2 mt-2 mb-10" id="table-div">
                    {innerData}
                </div>
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
                {/* <div className='md:mt-0 mt-5' onClick={deleteAllRows}> */}
                <div className='md:mt-0 mt-5'>
                    <span className="text-2xl font-extrabold md:text-3xl lg:text-5xl text-transparent bg-clip-text bg-gradient-to-r to-red-600 from-cyan-400">Societies</span>
                </div>

                {screenSize.width>=1100 ? bigScreenAcc(): smallScreenAcc()}

            </div>
        </>
    )
}

export default Societies;