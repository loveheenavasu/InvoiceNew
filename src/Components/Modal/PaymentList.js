import React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import TableRow from "@mui/material/TableRow";
import Button from "@mui/material/Button";
import { TextField } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import CloseIcon from "@mui/icons-material/Close";
import { useDispatch, useSelector } from "react-redux";
import { PAYMENT_LIST, UPDATE_PAYMENT } from "../../Store/Action_Constants";
import { clearPaymentList, setLoading } from "../../Store/Slices/Payment";
import Spinner from "../Spinner/Spinner";
import { toast } from "react-toastify";

const PaymentList = ({ isDepositedModalOpen, onClose, invoiceData }) => {
  const dispatch = useDispatch();
  const [editableRow, setEditableRow] = React.useState(null);
  const [editedData, setEditedData] = React.useState({});
  const paymentListdata = useSelector((state) => state.Payment.paymentList);
  const loading = useSelector((state) => state.Payment.loading);

  const paymentListColumns = [
    { id: "id", label: "Payment Id", minWidth: 100 },
    { id: "created_at", label: "Payment Date", minWidth: 100 },
    { id: "amount", label: "Amount (Rs)", minWidth: 100 },
    { id: "payment_method", label: "Payment Method", minWidth: 100 },
  ];

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 750,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    overflowY: "auto",
    maxHeight: "60vh",
  };

  const toggleEditMode = (rowIndex) => {
    setEditableRow(editableRow === rowIndex ? null : rowIndex);
    if (editableRow !== rowIndex) {
      setEditedData({});
    }
  };

  // const handleEdit = (value, columnId, index) => {
  //   if (columnId === "amount" || columnId === "payment_method") {
  //     setEditedData({
  //       ...editedData,
  //       [index]: {
  //         ...editedData[index],
  //         [columnId]: value,
  //       },
  //     });
  //   }
  // };
  const handleEdit = (value, columnId, index) => {
    const invoiceAmount = invoiceData?.Fee_data || invoiceData?.Pending_amount;
  
    const isValidNumber = !isNaN(parseFloat(value)) && isFinite(value);
  
    if (isValidNumber && (columnId === "amount" || columnId === "payment_method")) {
      if (parseFloat(value) <= invoiceAmount) {
        setEditedData({
          ...editedData,
          [index]: {
            ...editedData[index],
            [columnId]: value,
          },
        });
      } else {
        toast.error("Entered amount exceeds pending amount");
      }
    } else {
      setEditedData({
        ...editedData,
        [index]: {
          ...editedData[index],
          [columnId]: value,
        },
      });
    }
  };
  
  

  const applyEdits = async () => {

    try {
      for (const index in editedData) {
        const editedItem = editedData[index];
        const paymentItem = paymentListdata[index];

        const updatedData = {
          id: paymentItem.id,
          amount: editedItem.amount || paymentItem.amount,
          payment_method:
            editedItem.payment_method || paymentItem.payment_method,
        };

        dispatch({ type: UPDATE_PAYMENT, payload: updatedData });
      }
      // await new Promise(resolve => setTimeout(resolve, 1000));

      setEditedData({});
      toggleEditMode(null);
    } catch (error) {
      console.error("Error updating payment data", error);
    }
  };

  React.useEffect(() => {
    if (invoiceData.Invoice_Number) {
      setLoading(true);
      dispatch({ type: PAYMENT_LIST, payload: { id: invoiceData.Invoice_Number } });
    }
  }, [invoiceData.Invoice_Number, dispatch]);

  return (
    <Modal
      open={isDepositedModalOpen}
      onClose={onClose}
      aria-labelledby="deposited-amounts-modal-title"
      aria-describedby="deposited-amounts-modal-description"
    >
      <Box sx={style}>
        <IconButton
          edge="end"
          color="inherit"
          onClick={() => {
            dispatch(clearPaymentList());
            onClose();
          }}
          aria-label="close"
          sx={{ position: "absolute", top: 0, right: 10 }}
        >
          <CloseIcon />
        </IconButton>
        <h2 id="deposited-amounts-modal-title">Payment History</h2>
        <Spinner loading={loading} />
        <Table>
          <TableHead>
            <TableRow>
              {paymentListColumns.map((column) => (
                <TableCell key={column.id} align="left">
                  <b>
                    {column.label}
                  </b>
                </TableCell>
              ))}
              <TableCell align="left">
                <b>
                  Actions
                </b>
              </TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {paymentListdata.map((paymentItem, index) => (
              <TableRow key={index}>
                {paymentListColumns.map((column) => (
                  <TableCell key={column.id} align="left">
                    {editableRow === index &&
                    (column.id === "amount" ||
                      column.id === "payment_method") ? (
                      <TextField
                      required
                        type="text"
                        value={
                          editedData[index]?.[column.id] !== undefined
                            ? editedData[index]?.[column.id]
                            : paymentItem[column.id]
                        }
                        onChange={(e) =>
                          handleEdit(e.target.value, column.id, index)
                        }
                        size="small"
                      />
                    ) : column.id === "created_at" ? (
                      <Box sx={{ display: "flex" }}>
                        {new Date(paymentItem[column.id]).toLocaleString()}{" "}
                      </Box>
                    ) : (
                      <>{paymentItem[column.id]}</>
                    )}
                  </TableCell>
                ))}
                <TableCell align="left">
                  {editableRow === index ? (
                    <Button onClick={() => applyEdits()}>Update</Button>
                  ) : (
                    <Button onClick={() => toggleEditMode(index)}>Edit</Button>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Box>
    </Modal>
  );
};

export default PaymentList;
