import {useEffect} from 'react';
import Paths from '../path';

const Viz = () => {
    useEffect(() => {
        window.location.replace(Paths.base+"/viz");
    }, []);
}

export default Viz;