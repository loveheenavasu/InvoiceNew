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
import {  DELETE_COURSE, GET_COURSES } from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
import {courseCreating, setLoading} from "../../Store/Slices/Courses"
import swal from "sweetalert";
import { useNavigate } from "react-router-dom";

const columns = [
  { id: "name", label: "Course Name", minWidth: 180 },
  { id: "duration", label: "Course Duration", minWidth: 180 },
  { id: "fee", label: "Course Fee", minWidth: 180 },
  { id: "actions", label: "ACTIONS", minWidth: 100 },
];

export const RenderCourseTable = () => {
  const {loading, courses, totalCourses  } = useSelector((state) => state.Courses) || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [coursesData, setCoursesData] = React.useState([]);

  React.useEffect(() => {
    dispatch(setLoading(true));
    dispatch({ type: GET_COURSES });
  }, [dispatch]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  React.useEffect(() => {
    dispatch(setLoading(true));
    dispatch({ type: GET_COURSES, payload: { page: page, row: rowsPerPage } });
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(++newPage);
  };

  const deleteCourse = async (index) => {
    const course_id = courses[index].id;
    const payload = {
      courseId: course_id,
      page: page,
      row: rowsPerPage,
    };

    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this course?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (!willDelete) return;
    dispatch(setLoading(true));
    dispatch({ type: DELETE_COURSE, payload: payload });
  };

  const editCourse = (index) => {
    localStorage.setItem("coursecreating", true);
    const course = courses[index];
    dispatch(courseCreating(true));
    navigate(`/update_course/${course.id}`);
  };

  React.useEffect(() => {
    const _courses = courses?.map((course) => {
      return {
        name: course.name || "-",
        duration: course.duration || "-",
        fee: course.fee || "-",
        actions: "",
      };
    });
    setCoursesData(_courses);
  }, [courses]);

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
            {coursesData?.length > 0
              ? coursesData?.map((row, index) => {
                  return (
                    <TableRow
                      hover
                      role="checkbox"
                      tabIndex={-1}
                      key={index}
                    >
                      {columns.map((column) => {
                        let value = row[column.id];
                        return (
                          <TableCell key={column.id} align={column.align}>
                            {column.id === "actions" ? (
                              <Box sx={{ display: "flex" }}>
                                <EditIcon
                                  className="cursor_pointer"
                                  onClick={() => editCourse(index)}
                                />
                                &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp;&nbsp;
                                &nbsp; &nbsp;
                                <DeleteForeverIcon
                                  onClick={() => deleteCourse(index)}
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
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalCourses}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
