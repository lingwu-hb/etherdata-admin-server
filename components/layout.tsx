import {
  Badge,
  Box,
  Card,
  Collapse,
  Divider,
  Fade,
  Icon,
  ListItemText,
  Slide,
  Stack,
} from "@material-ui/core";
import {
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  Tooltip,
  Hidden,
  ListItemButton,
  IconButton,
} from "@material-ui/core";
import { useRouter } from "next/dist/client/router";
import Link from "next/link";
import AddIcon from "@material-ui/icons/Add";
import React from "react";
import Spacer from "./Spacer";
import { UIProviderContext } from "../pages/model/UIProvider";
import ErrorIcon from "@material-ui/icons/Error";
import SearchBar from "./SearchBar";
import { Configurations } from "../utils/configurations";

export interface Menu {
  title: string;
  icon: JSX.Element;
  link: string;
}

interface Props {
  children?: any;
  menus: Menu[];
}

const drawerWidth = 60;

export default function Layout(props: Props) {
  const { children, menus } = props;
  const router = useRouter();

  const [selectedIndex, setSelectedIndex] = React.useState(0);
  const { drawerOpen, setDrawerOpen, appBarTitle, appBarTitleShow } =
    React.useContext(UIProviderContext);

  React.useEffect(() => {
    if (router.pathname !== "/") {
      let found = menus.findIndex(
        (m) => router.pathname.includes(m.link) && m.link !== "/"
      );
      if (found) {
        setSelectedIndex(found);
      }
    } else {
      setSelectedIndex(0);
    }
  }, [router.pathname]);

  const listContent = (
    <div>
      {menus.map((m, i) => (
        <Link href={m.link} key={`item-${i}`}>
          <ListItemButton selected={selectedIndex === i}>
            <Tooltip title={m.title}>
              <ListItemIcon>{m.icon}</ListItemIcon>
            </Tooltip>
            <Hidden smUp>
              <ListItemText>{m.title}</ListItemText>
            </Hidden>
          </ListItemButton>
        </Link>
      ))}
    </div>
  );

  const tools = (
    <Stack direction={"row"}>
      <Tooltip title={"Bind Device"}>
        <IconButton>
          <AddIcon />
        </IconButton>
      </Tooltip>
      <Tooltip title={"errors"}>
        <IconButton>
          <Badge badgeContent={4} color={"error"}>
            <ErrorIcon />
          </Badge>
        </IconButton>
      </Tooltip>
    </Stack>
  );

  const appbar = (
    <AppBar elevation={0} position={"fixed"}>
      <Toolbar style={{ marginLeft: drawerWidth }}>
        <div style={{ width: 200 }}>
          <Collapse
            in={appBarTitleShow}
            timeout={150}
            mountOnEnter
            unmountOnExit
          >
            <Typography style={{ color: "black" }} variant={"h6"}>
              {appBarTitle}
            </Typography>
          </Collapse>
          <Fade in={!appBarTitleShow}>
            <Typography
              style={{ color: "black", position: "absolute", top: 15 }}
              variant={"h6"}
            >
              {Configurations.title}
            </Typography>
          </Fade>
        </div>
        <Divider
          orientation={"vertical"}
          style={{ marginRight: 10, height: 35 }}
        />
        <SearchBar />
        <Box sx={{ flexGrow: 1 }} />
        {tools}
      </Toolbar>
    </AppBar>
  );

  if (router.pathname === "/") {
    return <div>{children}</div>;
  }

  return (
    <div>
      <Hidden only={["xs"]}>
        {/**Desktop**/}
        {appbar}
        <Drawer variant="permanent">
          <List style={{ width: drawerWidth, overflowX: "hidden" }}>
            {listContent}
          </List>
        </Drawer>
      </Hidden>
      <Hidden mdUp>
        {/**mobile**/}
        <Drawer
          open={drawerOpen}
          onClose={() => {
            setDrawerOpen(false);
          }}
        >
          <List style={{ overflowX: "hidden", width: 200 }}>{listContent}</List>
        </Drawer>
      </Hidden>

      <Hidden only={["xs"]}>
        {/**Desktop**/}
        <main style={{ marginLeft: drawerWidth, padding: 30, marginTop: 50 }}>
          {children}
        </main>
      </Hidden>
      <Hidden smUp>
        {/**Mobile**/}
        <Spacer height={70} />
        <main style={{ paddingLeft: 30, paddingRight: 30, paddingBottom: 30 }}>
          {children}
        </main>
      </Hidden>
    </div>
  );
}
