import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import { Box } from "@mui/system";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";

import { useDispatch, useSelector } from "react-redux";
import {  DELETE_STUDENT,  GET_STUDENTS } from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
// import { clientCreating, setLoading } from "../../Store/Slices/Clients";
import { studentCreating,setLoading } from "../../Store/Slices/Students";

import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: "name", label: "Name", minWidth: 180 },
  { id: "email", label: "Email", minWidth: 180 },
  { id: "phone", label: "Phone", minWidth: 100 },
  { id: "address", label: "Address", minWidth: 180 },
  { id: "actions", label: "ACTIONS", minWidth: 100 },
];

export const RenderStudentsTable = () => {
  const { loading, students, totalStudents } = useSelector(
    (state) => state.Students
  );
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [studentsData, setStudentData] = React.useState([]);

  React.useEffect(() => {
    dispatch(setLoading(true));
    dispatch({ type: GET_STUDENTS });
  }, []);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  React.useEffect(() => {
    dispatch(setLoading(true));
    dispatch({ type: GET_STUDENTS, payload: { page: page, row: rowsPerPage } });
  }, [page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(++newPage);
  };

  const deleteStudent = async (index) => {
    const student_id = students[index].id;
    const payload = {
      clientId: student_id,
      page: page,
      row: rowsPerPage,
    };

    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this client?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (!willDelete) return;
    dispatch(setLoading(true));
    dispatch({ type: DELETE_STUDENT, payload: payload });
  };

  const editStudent = (index) => {
    localStorage.setItem("studentcreating", true);
    const student = students[index];
    dispatch(studentCreating(true));
    navigate(`/update_student/${student.id}`);
  };

  React.useEffect(() => {
    const _students = students?.map((student, ind) => {
      return {
        name: student.name || "-",
        email: student.email || "-",
        phone: student.phone || "-",
        address: student.address || "-",
        actions: "",
      };
    });
    setStudentData(_students);
  }, [students]);

  return (
    <Paper sx={{ width: "100%", overflow: "hidden" }}>
      <Spinner loading={loading} />
      <TableContainer sx={{ minHeight: 440, maxHeight: 440 }}>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align}
                  style={{ minWidth: column.minWidth }}
                >
                  <b>{column.label}</b>
                </TableCell>
              ))}
            </TableRow>
          </TableHead>
          <TableBody>
            {console.log(studentsData, columns, "90493940jidjfoj2034")}
            {studentsData?.length > 0
              ? studentsData?.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={row.code}
                    >
                      {columns.map((column) => {
                        let value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "actions" ? (
                              <Box sx={{ display: "flex" }}>
                                <EditIcon
                                  className="cursor_pointer"
                                  onClick={() => editStudent(index)}
                                />
                                &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;
                                &nbsp; &nbsp;
                                <DeleteForeverIcon
                                  onClick={() => deleteStudent(index)}
                                  className="cursor_pointer"
                                />
                              </Box>
                            ) : (
                              value
                            )}
                          </TableCell>
                        );
                      })}
                    </TableRow>
                  );
                })
              : "No Data is available"}
          </TableBody>
        </Table>
      </TableContainer>
      {console.log(totalStudents, rowsPerPage, "totalStudents")}
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalStudents}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
