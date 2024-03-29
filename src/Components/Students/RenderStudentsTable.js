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
import VisibilityIcon from "@mui/icons-material/Visibility";
import DownloadIcon from "@mui/icons-material/Download";
import { useDispatch, useSelector } from "react-redux";

import {
  DELETE_STUDENT,
  DOWNLOAD_PDF,
  GET_STUDENTS,
} from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
import { studentCreating, setLoading } from "../../Store/Slices/Students";
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";
import { Tooltip } from "@mui/material";

const columns = [
  { id: "student_id", label: "Student Id", minWidth: 100 },
  { id: "name", label: "Student Name", minWidth: 100 },
  { id: "email", label: "Email", minWidth: 100 },
  { id: "phone", label: "Phone", minWidth: 100 },
  { id: "address", label: "Address", minWidth: 100 },
  { id: "course", label: "Course", minWidth: 100 },
  { id: "duration", label: "Course Duration", minWidth: 100 },
  { id: "fee", label: "Course Fee (Rs)", minWidth: 100 },
  { id: "discount", label: "Discount (%)", minWidth: 100 },
  { id: "after_discount_fee", label: "Fee After Discount (Rs)", minWidth: 100 },
  { id: "pending", label: "Pending (Rs)", minWidth: 100 },
  // { id: "deposit", label: "Deposit (Rs)", minWidth: 100 },
  { id: "actions", label: "ACTIONS", minWidth: 100 },
];

export const RenderStudentsTable = () => {
  const { loading, students, totalStudents, searchQuery } = useSelector(
    (state) => state.Students
  );

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [studentsData, setStudentData] = React.useState([]);


  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  React.useEffect(() => {
    dispatch(setLoading(true));
    dispatch({ type: GET_STUDENTS, payload: { page: page, row: rowsPerPage, search: searchQuery } });
  }, [dispatch, page, rowsPerPage, searchQuery]);

  const handleChangePage = React.useCallback(
    (event, newPage) => {
      setPage(++newPage);
    },
    [setPage]
  );

  React.useEffect(() => {
    const currentPageDataStart = (page - 1) * rowsPerPage;
    const currentPageDataEnd = Math.min(page * rowsPerPage, totalStudents);

    if (currentPageDataStart >= currentPageDataEnd) {
      setPage(1);
    }
  }, [totalStudents, rowsPerPage, page, setPage]);


  const deleteStudent = async (index) => {
    const student_id = students[index].id;
    const payload = {
      clientId: student_id,
      page: page,
      row: rowsPerPage,
    };

    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this student?",
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
  const viewInvoice = (index) => {
    const invoice_id = students[index]?.id;
    navigate("/viewInvoice", { state: { invoice_id: invoice_id } });
  };
  const downloadInvoicePdf = (index) => {
    const invoice_id = students[index].id;
    console.log("DOWNLOAD_PDF")
    dispatch(setLoading(true));
    dispatch({ type: DOWNLOAD_PDF, payload: invoice_id });
  };

  React.useEffect(() => {
    if (students?.length > 0) {
      const _students = students?.map((student, ind) => {
        return {
          student_id: student.id || "_",
          name: student.name || "-",
          email: student.email || "-",
          phone: student.phone || "-",
          address: student.address || "-",
          course: student.course || "_",
          duration: student.course_duration || "_",
          fee: student.course_fee || "_",
          discount: student.discount || "_",
          pending: student.pending_amount || "_",
          after_discount_fee: student.after_discount_fee || "_",
          actions: "",
        };
      });
      setStudentData(_students);
    }
    else{
      setStudentData({});
    }
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
            {studentsData?.length > 0 ? (
              studentsData?.map((row, index) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={index}>
                    {columns.map((column) => {
                      let value = row[column.id];
                      return (
                        <TableCell key={column.id}>
                          {column.id === "actions" ? (
                            <Box sx={{ display: "flex" }}>
                              <Tooltip title="Update Invoice">
                                <EditIcon
                                  className="cursor_pointer"
                                  onClick={() => editStudent(index)}
                                />
                              </Tooltip>
                              &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;
                              <Tooltip title="Delete Invoice">
                                <DeleteForeverIcon
                                  onClick={() => deleteStudent(index)}
                                  className="cursor_pointer"
                                />
                              </Tooltip>
                              &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;
                              <Tooltip title="View Invoice">
                                <VisibilityIcon
                                  className="cursor_pointer"
                                  onClick={() => viewInvoice(index)}
                                />
                              </Tooltip>
                              &nbsp; &nbsp; &nbsp;&nbsp;&nbsp;
                              <Tooltip title="Download Invoice">
                                <DownloadIcon
                                  className="cursor_pointer"
                                  onClick={() => downloadInvoicePdf(index)}
                                />
                              </Tooltip>
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
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} style={{ color: "#888" }}>
                  No Data is available
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
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
