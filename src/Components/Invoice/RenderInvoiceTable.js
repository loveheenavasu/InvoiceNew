import * as React from "react";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Tooltip from "@mui/material/Tooltip";
import EditIcon from "@mui/icons-material/Edit";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import { Box } from "@mui/system";
import { useDispatch, useSelector } from "react-redux";
import {
  DELETE_INVOICE,
  DOWNLOAD_PDF,
  GET_INVOICES,
} from "../../Store/Action_Constants";
import Spinner from "../Spinner/Spinner";
import { invoiceCreating, setLoading } from "../../Store/Slices/Invoice";

import swal from "sweetalert";
import { Link, useNavigate } from "react-router-dom";
import PaymentModal from "../Modal/PaymentModal";
import PaymentList from "../Modal/PaymentList";

const columns = [
  { id: "Invoice_Number", label: "Invoice Number ", minWidth: 100 },
  { id: "Student_Name", label: "Student Name ", minWidth: 100 },
  { id: "Duration", label: "Course Duration", minWidth: 100 },
  { id: "Course_data", label: "Course Name", minWidth: 100 },
  { id: "Fee_data", label: "Course Fee (Rs)", minWidth: 100 },
  { id: "Deposited_amount", label: "Deposit Amount (Rs)", minWidth: 100 },
  { id: "Pending_amount", label: "Pending Amount (Rs)", minWidth: 100 },
  // { id: "Payment_method", label: "Payment Method", minWidth: 100 },
  { id: "actions", label: "ACTIONS", minWidth: 100 },
];
export const RenderInvoiceTable = () => {
  const _data = useSelector((state) => state.invoices);
  const { loading, invoices, totalInvoices } = _data || {};
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const [invoicesData, setInvoicesData] = React.useState([]);

  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [isDepositedModalOpen, setDepositedModalOpen] = React.useState(false);
  const [invoiceId, setSelectedInvoiceId] = React.useState("");
  const [selectedInvoice, setSelectedInvoice] = React.useState("");

  const handleLinkClick = () => {
    setIsModalOpen(true);
  };

  const handleDepositedModalOpen = () => {
    setDepositedModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
  };
  const handleDepositedModalClose = () => {
    setDepositedModalOpen(false);
    setSelectedInvoiceId(null);
  };

  const handlePayment = () => {
    handleModalClose();
    setSelectedInvoiceId(null);

  };

  React.useEffect(() => {
    dispatch(setLoading(true));
    // dispatch({ type: GET_INVOICES });
    // dispatch({ type: GET_STUDENTS });
    // dispatch({ type: GET_COURSES });
  }, [dispatch]);

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(1);
  };

  React.useEffect(() => {
    dispatch(setLoading(true));
    dispatch({ type: GET_INVOICES, payload: { page: page, row: rowsPerPage } });
  }, [dispatch, page, rowsPerPage]);

  const handleChangePage = (event, newPage) => {
    setPage(++newPage);
  };

  const deleteInvoice = async (index) => {
    const invoice_id = invoices[index].id;
    const payload = {
      invoiceId: invoice_id,
      page: page,
      row: rowsPerPage,
    };

    const willDelete = await swal({
      title: "Are you sure?",
      text: "Are you sure that you want to delete this invoice?",
      icon: "warning",
      buttons: true,
      dangerMode: true,
    });
    if (!willDelete) return;
    dispatch(setLoading(true));
    dispatch({ type: DELETE_INVOICE, payload: payload });
  };

  const editInvoice = (index, row) => {
    localStorage.setItem("invoicecreating", true);
    const invoice_id = invoices[index].id;
    dispatch(invoiceCreating(true));
    navigate(`/updateInvoice/${invoice_id}`);
  };

  const downloadInvoicePdf = (index) => {
    const invoice_id = invoices[index].id;
    dispatch(setLoading(true));
    dispatch({ type: DOWNLOAD_PDF, payload: invoice_id });
  };

  const viewInvoice = (index) => {
    const invoice_id = invoices[index].id;
    navigate("/viewInvoice", { state: { invoice_id: invoice_id } });
  };

  React.useEffect(() => {
    const _invoices = invoices?.map((invoice, ind) => {
      return {
        Invoice_Number: invoice.id || "-",
        Student_Name: JSON.parse(invoice?.student_data)?.name || "-",
        Duration: JSON.parse(invoice?.course_data)?.duration || "-",
        Course_data: JSON.parse(invoice?.course_data)?.name || "-",
        Fee_data: JSON.parse(invoice.course_data)?.fee || "-",
        Deposited_amount: invoice?.amount || "-",
        Pending_amount: invoice?.pending_amount || "- ",
        Payment_method: invoice.payment_method || "_",
        actions: "",
      };
    });
    setInvoicesData(_invoices);
  }, [invoices]);

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
            {invoicesData?.length > 0 ? (
              invoicesData?.map((row, index) => {
                return (
                  <TableRow
                    hover
                    role="checkbox"
                    tabIndex={-1}
                    key={row.Invoice_Number}
                  >
                    {columns.map((column) => {
                      let value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === "actions" ? (
                            <Box sx={{ display: "flex" }}>
                              <Tooltip title="Update Invoice">
                                <EditIcon
                                  className="cursor_pointer"
                                  onClick={() => editInvoice(index, row)}
                                />
                              </Tooltip>
                              &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;
                              <Tooltip title="Delete Invoice">
                                <DeleteForeverIcon
                                  onClick={() => deleteInvoice(index)}
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
                          ) : column.id === "Fee_data" ? (
                            <Box
                              sx={{
                                display: "flex",
                              }}
                            >
                              <>
                                {value}
                              </>
                            </Box>
                          ) : column.id === "Deposited_amount" ? (
                            <Box
                              sx={{
                                display: "flex",
                              }}
                            >
                              <Tooltip title="Click to show paid amount">
                                <Link
                                  onClick={() => {
                                    setSelectedInvoiceId(row);
                                    handleDepositedModalOpen();
                                  }}
                                >
                                  {value}
                                </Link>
                              </Tooltip>
                            </Box>
                          ) : column.id === "Pending_amount" ? (
                            <Box
                              sx={{
                                display: "flex",
                              }}
                            >
                              {value &&
                              !isNaN(value) &&
                              String(value).trim() !== "0" ? (
                                <>
                                  <Tooltip title="Click to pay pending amount">
                                    <Link
                                      style={{ color: "red"  }}
                                      onClick={() => {
                                        handleLinkClick();
                                        setSelectedInvoice(row);
                                      }}
                                    >
                                      {value}
                                    </Link>
                                  </Tooltip>
                                </>
                              ) : (
                                "0"
                              )}
                            </Box>
                          ) : column.id === "Total_Amount" ? (
                            <>
                              {value}&nbsp; &nbsp;
                              {row.currencyType}
                            </>
                          ) : (
                            <>{value}</>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>No Data is available</TableRow>
            )}
            {isDepositedModalOpen && (
              <PaymentList
              setSelectedInvoiceId={setSelectedInvoiceId}
                isDepositedModalOpen={isDepositedModalOpen}
                onClose={handleDepositedModalClose}
                invoiceData={invoiceId}
              />
            )}
            <PaymentModal
              isOpen={isModalOpen}
              onClose={handleModalClose}
              onPayment={handlePayment}
              invoiceData={selectedInvoice}
            />
          </TableBody>
        </Table>
      </TableContainer>
      <TablePagination
        rowsPerPageOptions={[10, 25, 100]}
        component="div"
        count={totalInvoices || 0}
        rowsPerPage={rowsPerPage}
        page={page - 1}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    </Paper>
  );
};
