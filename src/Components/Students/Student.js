import { Box } from "@mui/material";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import ProtectedRoute from "../../Routes/ProtectedRoute";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clientCreating } from "../../Store/Slices/Clients";
import { Navbar } from "../Navbar/Navbar";
import { Footer } from "../Footer/Footer";
import { RenderStudentsTable } from "./RenderStudentsTable";

export const Student = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  localStorage.setItem("clientcreating", false);

  const addStudent = () => {
    localStorage.setItem("clientcreating", true);
    dispatch(clientCreating(true));
    navigate("/create_student");
  };

  return (
    <ProtectedRoute>
      <Navbar />
      <Box mt={10} ml={2} mr={2} className="minHeight">
        <Box className="client_table_upper">
          <Typography variant="h5">ALL STUDENTS</Typography>
          <Button sx={{ border: "1px solid" }} onClick={addStudent}>
            Create Student
          </Button>
        </Box>
        <Box mt={2}>{<RenderStudentsTable/>}</Box>
      </Box>
      <Footer />
    </ProtectedRoute>
  );
};
