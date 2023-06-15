import data from '../../data/data.json';
import NavBar from '../header/header';

const Societies = () => {
    const stateSet = new Set();
    const stateArray = new Array();
    const districtSet = new Set();
    const districtArray = new Array();
    const sectorTypeSet = new Set();
    const sectorTypeArray = new Array();
    const areaSet = new Set();
    const areaArray = new Array();

    data.forEach(d => {
        stateSet.add(d.state.toUpperCase());
        districtSet.add(d.district.toUpperCase());
        sectorTypeSet.add(d.sector.toUpperCase());

        d.area.split(",").map(word => word.trim()).forEach(w => {
            areaSet.add(w.toUpperCase());
        })
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
    
    return(
        <>
            <NavBar/>
        </>
    )
}

export default Societies;