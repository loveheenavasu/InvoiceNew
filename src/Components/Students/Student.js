import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import TextField from '@mui/material/TextField';
import Button from "@mui/material/Button";
import ProtectedRoute from "../../Routes/ProtectedRoute";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
// import { clientCreating } from "../../Store/Slices/Clients";
import { studentCreating } from "../../Store/Slices/Students";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { RenderStudentsTable } from "./RenderStudentsTable";
import { FILTER_STUDENT } from "../../Store/Action_Constants";
import { useDebouncedCallback } from "use-debounce";

export const Student = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  localStorage.setItem("clientcreating", false);

  const addStudent = () => {
    localStorage.setItem("studentcreating", true);
    dispatch(studentCreating(true));
    navigate("/create_student");
  };

  const debounced = useDebouncedCallback((e) => {
    dispatch({
      type: FILTER_STUDENT,
      payload: e.target.value,
    });
  }, 1000);



  return (
    <ProtectedRoute>
      <Navbar />
      <Box mt={10} ml={2} mr={2} className="minHeight">
        <Box className="client_table_upper">
          <Typography variant="h5">ALL STUDENTS</Typography>

          <Box display="flex">
            <TextField
              id="search_student"  
              label="Search ..."
              name="search_student"
              autoComplete="deposit_amount"
              sx={{ mr: 10 }}
              inputProps={{ sx: { pr:3 } }}
              onChange={debounced}
              size="small"
            />
            
            <Button sx={{ border: "1px solid" }} onClick={addStudent}>
              Add Student
            </Button>
          </Box>

        </Box>
        <Box mt={2}>{<RenderStudentsTable />}</Box>
      </Box>
      <Footer />
    </ProtectedRoute>
  );
};
