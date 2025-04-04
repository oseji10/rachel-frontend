'use client';

import React, { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  CircularProgress,
  Typography,
  TextField,
  IconButton,
  Modal,
  Box,
  Button,
  TablePagination,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { Cancel, ChangeCircleOutlined, ChangeHistoryOutlined, CheckCircle, Delete, Edit, Payment, Payments, Print, StartOutlined, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';

type Billing = {
  billingId: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;

};

const modalStyle = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: 600,
  bgcolor: 'background.paper',
  boxShadow: 24,
  p: 4,
  borderRadius: 2,
  maxHeight: '90vh',
  overflowY: 'auto',
};


const formatDate = (dateString: string) => {
  const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};


const BillingsTable = () => {
  const [billings, setBillings] = useState<Billing[]>([]);
  const [filteredBillings, setFilteredBillings] = useState<Billing[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openViewModal, setOpenViewModal] = useState(false);
  const [selectedBilling, setSelectedBilling] = useState<Billing | null>(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  // const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);
  const router = useRouter();
  const role = Cookies.get('role')

  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    paymentMethod: "",
    paymentReference: "",
  });


  const [inventoryType, setInventoryType] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [selectedItem, setSelectedItem] = useState(null);
  const [remainingStock, setRemainingStock] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [billingItems, setBillingItems] = useState([]);
  // const [loading, setLoading] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState(null);


  const inventoryOptions = [
    { value: 'Products', label: 'Products' },
    { value: 'Services', label: 'Services' }
  ]

  const categoryOptions = {
    Products: ['Medicine', 'Lens', 'Frame', 'Accessory'],
    Services: ['Consultation/Registration', 'Procedures', 'Clinic Procedures', 'Lasers', 'Cataract Procedures', 'Ptosis Procedures', 'Investigation', 'Diagnosis', 'Surgery']
  }

  // Open modal when Payments icon is clicked
  const handlePaymentsClick = (billing) => {
    setSelectedBilling(billing);  // Set the correct billing information
    setOpen(true);  // Open the modal
  };

  const handlePrintClick = (billing) => {
    setSelectedBilling(billing);  // Set the correct billing information
    // handlePrintReceipt()
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  // Handle form submission
  const [isUpdating, setIsUpdating] = useState(false); // State for spinner

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsUpdating(true); // Show spinner on button

    try {
      const token = Cookies.get('authToken');
      const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/confirm-payment`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          transactionId: selectedBilling.transactionId,
          paymentMethod: formData.paymentMethod,
          paymentReference: formData.paymentReference,
        }),
      });

      if (response.ok) {
        setOpen(false); // Close the modal
        Swal.fire({
          icon: 'success',
          title: 'Payment confirmed successfully!',
          showConfirmButton: false,
          timer: 1500
        }).then(() => {
          // setOpen(false); // Close the modal after the alert
        });

        // Refresh the table by fetching updated billings
        const updatedBillings = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/billings`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBillings(updatedBillings.data);
        setFilteredBillings(updatedBillings.data);
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Failed to confirm payment!',
          text: 'There was an issue confirming the payment.',
        });
      }
    } catch (error) {
      console.error("Error submitting payment:", error);
      Swal.fire({
        icon: 'error',
        title: 'Error!',
        text: 'An error occurred while processing the payment.',
      });
    } finally {
      setIsUpdating(false); // Hide spinner
    }
  };

  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await axios.get(`${process.env.NEXT_PUBLIC_APP_URL}/billings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }

        );
        setBillings(response.data);
        setFilteredBillings(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load billings data.');
        setLoading(false);
      }
    };

    fetchBillings();
  }, []);

  const [doctors, setDoctors] = useState<{ doctorId: string; doctorName: string }[]>([])
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/doctors`)
        const data = await response.json()
        setDoctors(data)
        // console.log(allDoctors)
      } catch (error) {
        console.error('Error fetching doctors:', error)
      }
    }
    fetchDoctors()
  }, [])

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value.toLowerCase();
    setSearchQuery(query);
    const filtered = billings.filter(
      (billing) =>
        `${billing.patient.firstName} ${billing.patient.lastName}`.toLowerCase().includes(query)
    );
    setFilteredBillings(filtered);
    setPage(0);
  };

  const handleView = (billing: Billing) => {
    setSelectedBilling(billing);
    setOpenViewModal(true);
  };

  const handleChangePage = (_: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const displayedBillings = filteredBillings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);



  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setSelectedBilling((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };


  const handleUpdate = async () => {
    if (selectedBilling) {
      try {
        const response = await axios.put(
          `${process.env.NEXT_PUBLIC_APP_URL}/billings/${selectedBilling.billingId}`,
          selectedBilling // Send updated billing data
        );
        Swal.fire('Updated!', 'The billing has been updated.', 'success');
        setOpenEditModal(false);
      } catch (error) {
        Swal.fire('Error!', 'Failed to update the billing.', 'error');
      }
    }
  };


  const handleDelete = async (billing) => {
    // setOpenViewModal(false);
    Swal.fire({
      title: "Are you sure?",
      text: "Do you want to delete this transaction?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          const token = Cookies.get("authToken");
          await axios.delete(
            `${process.env.NEXT_PUBLIC_APP_URL}/billings/${billing.transactionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );

          // Remove deleted billing from state
          setBillings((prevBillings) => prevBillings.filter((p) => p.billingId !== billing.billingId));
          setFilteredBillings((prevFilteredBillings) => prevFilteredBillings.filter((p) => p.billingId !== billing.serviceId));

          Swal.fire("Deleted!", "The transaction has been deleted.", "success");
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire("Error!", "Failed to delete the transaction.", "error");
        }
      }
    });
  };


  const handlePrintReceipt = async (billing) => {
    try {
      const url = `${process.env.NEXT_PUBLIC_APP_URL}/print-receipt/${billing.transactionId}`;

      // Open the PDF in a new tab
      window.open(url, "_blank");
    } catch (error) {
      console.error("Error opening receipt:", error);
    }
  };


  // const handlePrintReceipt = async (billing) => {
  //   try {
  //     const response = await fetch(`${process.env.NEXT_PUBLIC_APP_URL}/print-receipt/${billing.transactionId}`, {
  //       method: "GET",
  //     });

  //     if (!response.ok) {
  //       throw new Error("Failed to fetch receipt");
  //     }

  //     const blob = await response.blob();
  //     const url = window.URL.createObjectURL(blob);
  //     const a = document.createElement("a");
  //     a.href = url;
  //     a.download = `receipt-${billing.transactionId}.pdf`;
  //     document.body.appendChild(a);
  //     a.click();
  //     window.URL.revokeObjectURL(url);
  //     document.body.removeChild(a);
  //   } catch (error) {
  //     console.error("Error downloading receipt:", error);
  //   }
  // };


  // Open modal and populate fields
  const handleEdit = (index) => {
    // const itemToEdit = billingItems[index];
    // setInventoryType(itemToEdit.inventoryType);
    // setCategoryType(itemToEdit.categoryType);
    // setSelectedItem(itemToEdit.inventoryId);
    // setQuantity(itemToEdit.quantity);
    // setEditItemIndex(index);
    setModalOpen(true);
  };


  const handleEditSubmit = (e) => {
    e.preventDefault();
    setLoading(true);

    const updatedItem = {
      inventoryType,
      categoryType,
      inventoryId: selectedItem,
      quantity,
    };

    if (editItemIndex !== null) {
      // Update existing item
      const updatedItems = [...billingItems];
      updatedItems[editItemIndex] = updatedItem;
      setBillingItems(updatedItems);
      setEditItemIndex(null);
    } else {
      // Add new item
      setBillingItems([...billingItems, updatedItem]);
    }

    setModalOpen(false);
    setLoading(false);
  };


  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Typography color="error" align="center" variant="h6">
        {error}
      </Typography>
    );
  }

  return (
    <>
      <h3>Billings</h3>
      <TextField
        placeholder="Search by name"
        value={searchQuery}
        onChange={handleSearch}
        variant="outlined"
        fullWidth
        margin="normal"
      />
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Billing Date</TableCell>
              <TableCell>TRX ID</TableCell>
              <TableCell>Patient Name</TableCell>
              <TableCell>Amount</TableCell>
              <TableCell>Payment Method</TableCell>
              <TableCell>Payment Status</TableCell>
              {(role === "3" || role === "8") && (
                      <>
              <TableCell>Action</TableCell>
              </>
              )}
            </TableRow>
          </TableHead>
          <TableBody>
            {displayedBillings.map((billing) => (
              <TableRow key={billing.id}>

                <TableCell>
                  {billing?.created_at &&
                    new Date(`${billing?.created_at}`).toLocaleString('en-US', {
                      weekday: 'long',
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                      hour12: true
                    })}
                </TableCell>
                <TableCell>{billing?.transactionId}</TableCell>

                <TableCell>
                  {billing?.patient?.firstName} {billing?.patient?.lastName}
                </TableCell>
                <TableCell>₦{billing?.total_cost ? new Intl.NumberFormat().format(billing.total_cost) : "N/A"}</TableCell>
                <TableCell>{billing?.paymentMethod}</TableCell>
                <TableCell>
                  <span
                    style={{
                      backgroundColor: billing?.paymentStatus === "pending" ? "#FFC107" : "#4CAF50",
                      color: "white",
                      fontWeight: "bold",
                      padding: "4px 8px",
                      borderRadius: "4px",
                    }}
                  >
                    {billing?.paymentStatus === "pending" ? "PENDING" : "PAID"}
                  </span>
                  </TableCell>
                  <TableCell>
                    {(role === "3" || role === "8") && (
                      <>
                        {/* View Button (Always Visible) */}
                        <IconButton onClick={() => handleView(billing)} color="primary">
                          <Visibility />
                        </IconButton>

                        {/* Print Receipt (Only if Paid) */}
                        {billing?.paymentStatus === "paid" && (
                          <IconButton onClick={() => handlePrintReceipt(billing)} color="success">
                            <Print />
                          </IconButton>
                        )}

                        {/* Payment Button (Only if Pending) */}
                        {billing?.paymentStatus === "pending" && (
                          <IconButton onClick={() => handlePaymentsClick(billing)} color="warning">
                            <Payments />
                          </IconButton>
                        )}

                        {/* Edit Button (Only if Pending) */}
                        {billing?.paymentStatus === "pending" && (
                          <IconButton onClick={() => handleEdit(billing)} color="secondary">
                            <Edit />
                          </IconButton>
                        )}

                        {/* Delete Button (Only if Pending) */}
                        {billing?.paymentStatus === "pending" && (
                          <IconButton onClick={() => handleDelete(billing)} color="error">
                            <Delete />
                          </IconButton>
                        )}
                      </>
                    )}
                  </TableCell>

              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          rowsPerPageOptions={[10, 25, 50]}
          component="div"
          count={filteredBillings.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
        />
      </TableContainer>

      {/* View Modal */}

      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" gutterBottom>
            Billing Details
          </Typography>
          {selectedBilling && (
            <>
              <Typography variant="body1">
                <strong>Full Name:</strong> {`${selectedBilling?.patient?.firstName} ${selectedBilling?.patient?.lastName}`}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedBilling?.patient?.email}
              </Typography>
              <Typography variant="body1">
                <strong>Phone Number:</strong> {selectedBilling?.patient?.phoneNumber}
              </Typography>
              <Typography variant="body1">
                <strong>Doctor:</strong> {selectedBilling?.patient?.doctor?.doctorName || 'N/A'}
              </Typography>

              <Typography variant="body1">
                <strong>Billing Date:</strong> {selectedBilling?.created_at &&
                  new Date(`${selectedBilling?.created_at}`).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
              </Typography>

              {/* Item List Table */}
              <Typography variant="h6" gutterBottom>
                Items
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedBilling?.relatedTransactions?.map((transaction, index) => (
                    <React.Fragment key={index}>
                      <TableRow>
                        {/* Display item name, for example categoryType or billingType */}
                        <TableCell>{transaction.categoryType || transaction.billingType}</TableCell>
                        <TableCell>{transaction.quantity}</TableCell>
                        <TableCell>₦{transaction.cost ? new Intl.NumberFormat().format(transaction.cost) : "N/A"}</TableCell>
                        <TableCell>₦{transaction.cost && transaction.quantity ? new Intl.NumberFormat().format(transaction.cost * transaction.quantity) : "N/A"}</TableCell>
                      </TableRow>
                    </React.Fragment>
                  ))}
                </TableBody>
              </Table>

            </>
          )}
        </Box>
      </Modal>





      <Modal open={openEditModal} onClose={() => setOpenEditModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h6" gutterBottom>
            Edit Billing
          </Typography>
          <form onSubmit={handleUpdate}>
            <Grid container spacing={4}>
              {/* Form Fields */}
              <Grid item xs={12} sm={6}>
                <TextField
                  name="billingDate"
                  type="date"
                  fullWidth
                  label="Billing Date"
                  value={selectedBilling?.billingDate || ''}
                  // onChange={handleFormChange}
                  onChange={handleFormChange}
                  InputLabelProps={{
                    shrink: true
                  }}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="billingTime"
                  type="time"
                  fullWidth
                  label="Billing Time"
                  value={selectedBilling?.billingTime || ''}
                  // onChange={e => handleFormChange('billingTime', e.target.value)}
                  onChange={handleFormChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <TextField
                  name="comment"
                  fullWidth
                  label="Comment"
                  value={selectedBilling?.comment || ''}
                  // onChange={e => handleFormChange('comment', e.target.value)}
                  onChange={handleFormChange}
                />
              </Grid>

              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    name="doctor" // Add name attribute
                    value={selectedBilling?.doctor || ''}
                    onChange={handleFormChange}
                  >
                    {doctors.map(doctor => (
                      <MenuItem key={doctor.doctorId} value={doctor.doctorId}>
                        {doctor.doctorName}
                      </MenuItem>
                    ))}
                  </Select>

                </FormControl>

              </Grid>
            </Grid>

            {/* Submit Button */}
            <Grid item xs={12} className="mt-4">
              <Button variant="contained" color="primary" type="submit" disabled={loading}>
                {loading ? 'Saving...' : 'Save Changes'}
              </Button>
            </Grid>
          </form>
        </Box>
      </Modal>


      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h5" gutterBottom>
            Confirm Payment
          </Typography>
          <form onSubmit={handleSubmit}>
            {/* Payment Method Dropdown */}
            <InputLabel id="payment-method-label">Payment Method</InputLabel>
            <Select
              labelId="payment-method-label"
              label="Payment Method"
              fullWidth
              value={formData.paymentMethod}
              onChange={handleChange}
              name="paymentMethod"
              required
              margin="normal"
            >
              <MenuItem value="cash">Cash</MenuItem>
              <MenuItem value="POS">POS</MenuItem>
              <MenuItem value="transfer">Transfer</MenuItem>
            </Select>

            {/* Payment Reference */}
            <TextField
              label="Payment Reference"
              fullWidth
              margin="normal"
              value={formData.paymentReference}
              onChange={handleChange}
              name="paymentReference"

            />

            {/* Submit Button */}
            <Box sx={{ display: "flex", justifyContent: "flex-end", mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={handleSubmit}
                disabled={isUpdating}
                startIcon={isUpdating ? <CircularProgress size={20} /> : null}
              >
                {isUpdating ? "Updating..." : "Update Payment"}
              </Button>

            </Box>
          </form>
        </Box>
      </Modal>



      {/* Modal for Editing */}
      <Modal open={modalOpen} onClose={() => setModalOpen(false)}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            boxShadow: 24,
            p: 4,
          }}
        >
          <Typography variant="h6">Edit Item</Typography>
          <form onSubmit={handleEditSubmit}>
            <FormControl fullWidth>
              <InputLabel>Inventory Type</InputLabel>
              <Select value={inventoryType} onChange={(e) => setInventoryType(e.target.value)}>
                {inventoryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Category Type</InputLabel>
              <Select value={categoryType} onChange={(e) => setCategoryType(e.target.value)}>
                {inventoryType &&
                  categoryOptions[inventoryType]?.map((cat) => (
                    <MenuItem key={cat} value={cat}>
                      {cat}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            <TextField
              fullWidth
              type="number"
              label="Quantity"
              value={quantity}
              onChange={(e) => setQuantity(e.target.value)}
            />

            <Button variant="contained" color="primary" type="submit">
              Save Changes
            </Button>
          </form>
        </Box>
      </Modal>


    </>
  );
};

export default BillingsTable;
