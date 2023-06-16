import CircularProgress from '@mui/material/CircularProgress';
import Box from '@mui/material/Box';

const Loading = () => {
    return (  
        <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
        >
            <CircularProgress size={70}/>
        </Box>
    );
}
 
export default Loading;