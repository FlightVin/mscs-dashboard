import React from "react";
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  Accordion,
  AccordionHeader,
  AccordionBody,
} from "@material-tailwind/react";
import {
  PresentationChartBarIcon,
  ListBulletIcon,
  HomeModernIcon
} from "@heroicons/react/24/solid";

import { ChevronRightIcon, ChevronDownIcon } from "@heroicons/react/24/outline";
import { Link } from "react-router-dom";
 
export default function NavBar() {

  const [open, setOpen] = React.useState(0);
  const [sidebarOpen, setSidenarOpen] = React.useState(false);
 
  const handleOpen = (value) => {
    setOpen(open === value ? 0 : value);
  };
 
  return (
    sidebarOpen ? 

        <Card className="fixed top-4 left-4 h-[calc(100vh-2rem)] w-full max-w-[20rem] p-4 shadow-xl shadow-blue-gray-900/5">
            <div className="fixed top-4 left-4 h-10 w-16 p-4 pt-6 items-center justify-center hover:cursor-pointer">
                <img src="images/side.svg" width="80%" onClick={() => setSidenarOpen(a => !a)}/>
            </div>
            <div className="mb-2 p-4 flex items-center justify-center">
                <Link to="/"> <img src="images/MSCS_LOGO.png" width="100px" height="100px" /></Link>
            </div>
            <List>
                <Link to="/societies">
                    <ListItem>
                    <ListItemPrefix>
                        <ListBulletIcon className="h-5 w-5" />
                    </ListItemPrefix>
                        Societies
                    </ListItem>
                </Link>

                <Accordion
                open={open === 1}
                icon={
                    <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto h-4 w-4 transition-transform ${open === 1 ? "rotate-180" : ""}`}
                    />
                }
                >
                <ListItem className="p-0" selected={open === 1}>
                    <AccordionHeader onClick={() => handleOpen(1)} className="border-b-0 p-3">
                    <ListItemPrefix>
                        <PresentationChartBarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    <Typography color="blue-gray" className="mr-auto font-normal">
                        Visualizations
                    </Typography>
                    </AccordionHeader>
                </ListItem>
                <AccordionBody className="py-1">
                    <List className="p-0">
                    <ListItem>
                        <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        Analytics
                    </ListItem>
                    <ListItem>
                        <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        Reporting
                    </ListItem>
                    <ListItem>
                        <ListItemPrefix>
                        <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                        </ListItemPrefix>
                        Projects
                    </ListItem>
                    </List>
                </AccordionBody>
                </Accordion>

                <hr className="my-2 border-blue-gray-50" />

                <Link to="/">
                    <ListItem>
                    <ListItemPrefix>
                        <HomeModernIcon className="h-5 w-5" />
                    </ListItemPrefix>
                        Dashboard
                    </ListItem>
                </Link>
                
            </List>
        </Card>
        :
        <Card className="fixed top-4 left-4 h-10 w-16 p-4 pt-9 shadow-xl shadow-blue-gray-900/5 flex items-center justify-center hover:cursor-pointer">
            <img src="images/side.svg" width="80%" onClick={() => setSidenarOpen(a => !a)}/>
        </Card>
  );
}