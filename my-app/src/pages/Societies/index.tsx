import {useEffect} from 'react';
import Paths from '../path';

const Societies = () => {
    useEffect(() => {
        window.location.replace(Paths.base+"/societies");
    }, []);
}

export default Societies;