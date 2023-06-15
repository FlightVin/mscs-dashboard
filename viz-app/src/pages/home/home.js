import {useEffect} from 'react';
import Paths from '../../path';

const HomeRedir = () => {
    useEffect(() => {
        window.location.replace(Paths.home);
    }, []);
}

export default HomeRedir;