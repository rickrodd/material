import Sidebar from "./components/Sidebar";
import Feed from "./components/Feed";
import Rightbar from "./components/Rightbar";
import { Box, createTheme, Stack, ThemeProvider } from "@mui/material";
import Navbar from "./components/Navbar";
import Add from "./components/Add";
import { useState } from "react";
import Roles from "./components/Roles";
import CommentBox from "./components/CommentBox";
import PriorityList from "./components/PriorityList";

function App() {
  const [mode, setMode] = useState("light");

  const darkTheme = createTheme({
    palette: {
      mode: mode,
    },
  });
  return (
    <div>
      <PriorityList />
    </div>
  )
}
// <ThemeProvider theme={darkTheme}>
{/* <Box bgcolor={"background.default"} color={"text.primary"}> */ }

{/* <Roles /> */ }
{/* <CommentBox /> */ }
{/* <Stack direction="row" spacing={2} justifyContent="space-between">
        <Sidebar setMode={setMode} mode={mode}/>
        <Feed />
        <Rightbar />
        </Stack>
        <Add /> */}
{/* </Box> */ }
// </ThemeProvider>
//   );
// }

export default App;
