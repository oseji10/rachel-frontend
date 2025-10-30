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
import { Cancel, ChangeCircleOutlined, ChangeHistoryOutlined, CheckCircle, Delete, Edit, Outbound, Payment, Payments, Print, StartOutlined, Visibility } from '@mui/icons-material';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'next/navigation';
import Cookies from 'js-cookie';
import { getRole } from '../../../../lib/auth';
import api from '@/app/utils/api';

type Billing = {
  billingId: number;
  status: number;
  createdAt: string;
  updatedAt: string;
  deletedAt?: string | null;
  transactionId: string;
  patient: {
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    doctor?: { doctorName: string };
  };
  total_cost: number;
  paymentMethod: string;
  paymentStatus: string;
  relatedTransactions: Array<{
    product?: { productName: string };
    service?: { serviceName: string };
    categoryType?: string;
    billingType?: string;
    quantity: number;
    cost: number;
  }>;
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
  const router = useRouter();
  // const role = Cookies.get('role');
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
  const [modalOpen, setModalOpen] = useState(false);
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const role = getRole();

  const inventoryOptions = [
    { value: 'Products', label: 'Products' },
    { value: 'Services', label: 'Services' }
  ];

  const categoryOptions = {
    Products: ['Medicine', 'Lens', 'Frame', 'Accessory'],
    Services: ['Consultation/Registration', 'Procedures', 'Clinic Procedures', 'Lasers', 'Cataract Procedures', 'Ptosis Procedures', 'Investigation', 'Diagnosis', 'Surgery']
  };

  const handlePaymentsClick = (billing) => {
    setSelectedBilling(billing);
    setOpen(true);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

const handleSubmit = async (e) => {
  e.preventDefault();
  setIsUpdating(true);

  try {
    // ✅ Confirm payment request
    const response = await api.post(
      `${process.env.NEXT_PUBLIC_APP_URL}/confirm-payment`,
      {
        transactionId: selectedBilling?.transactionId,
        paymentMethod: formData.paymentMethod,
        paymentReference: formData.paymentReference,
      }
    );

    // ✅ Axios puts your backend's JSON inside response.data
    console.log("Confirm Payment Response:", response.data);

    if (response.status === 200) {
      setOpen(false);
      Swal.fire({
        icon: "success",
        title: response.data.message || "Payment confirmed successfully!",
        showConfirmButton: false,
        timer: 1500,
      });

      // ✅ Refetch updated billings
      const updatedBillings = await api.get(
        `${process.env.NEXT_PUBLIC_APP_URL}/billings`
      );

      setBillings(updatedBillings.data);
      setFilteredBillings(updatedBillings.data);
    } else {
      Swal.fire({
        icon: "error",
        title: "Failed to confirm payment!",
        text: response.data?.error || "There was an issue confirming the payment.",
      });
    }
  } catch (error) {
    console.error("Error submitting payment:", error.response?.data || error.message);
    Swal.fire({
      icon: "error",
      title: "Error!",
      text: error.response?.data?.error || "An error occurred while processing the payment.",
    });
  } finally {
    setIsUpdating(false);
  }
};



  useEffect(() => {
    const fetchBillings = async () => {
      try {
        const token = Cookies.get('authToken');
        const response = await api.get(`${process.env.NEXT_PUBLIC_APP_URL}/billings`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
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

  const [doctors, setDoctors] = useState<{ doctorId: string; doctorName: string }[]>([]);
  useEffect(() => {
    const fetchDoctors = async () => {
      try {
        const response = await api.get(`${process.env.NEXT_PUBLIC_APP_URL}/doctors`);
        setDoctors(response.data);
      } catch (error) {
        console.error('Error fetching doctors:', error);
      }
    };
    fetchDoctors();
  }, []);

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

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setSelectedBilling((prev) =>
      prev ? { ...prev, [name]: value } : null
    );
  };

  const handleUpdate = async () => {
    if (selectedBilling) {
      try {
        const response = await api.put(
          `${process.env.NEXT_PUBLIC_APP_URL}/billings/${selectedBilling.billingId}`,
          selectedBilling
        );
        Swal.fire('Updated!', 'The billing has been updated.', 'success');
        setOpenEditModal(false);
      } catch (error) {
        Swal.fire('Error!', 'Failed to update the billing.', 'error');
      }
    }
  };

  const handleDelete = async (billing) => {
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
          await api.delete(
            `${process.env.NEXT_PUBLIC_APP_URL}/billings/${billing.transactionId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          setBillings((prevBillings) => prevBillings.filter((p) => p.billingId !== billing.billingId));
          setFilteredBillings((prevFilteredBillings) => prevFilteredBillings.filter((p) => p.billingId !== billing.billingId));
          Swal.fire("Deleted!", "The transaction has been deleted.", "success");
        } catch (error) {
          console.error("Delete error:", error);
          Swal.fire("Error!", "Failed to delete the transaction.", "error");
        }
      }
    });
  };

 const calculateTotalCost = (relatedTransactions) => {
  // Log the transactions for debugging
  console.log('Related Transactions:', JSON.stringify(relatedTransactions, null, 2));

  return relatedTransactions.reduce((total, transaction) => {
    // Convert transaction.cost to a number, handling strings and invalid values
    const cost = Number(transaction.cost) || 0; // Use Number() for robust conversion

    // Log each transaction's cost and its type for debugging
    console.log(
      `Transaction: ${transaction.product?.productName || transaction.service?.serviceName || 'N/A'}, ` +
      `Cost: ${cost}, Type: ${typeof transaction.cost}`
    );

    // Validate cost to prevent extreme values
    if (cost > 1_000_000_000) { // Arbitrary threshold (e.g., 1 billion naira)
      console.warn(`Suspiciously high cost detected: ${cost} for transaction`, transaction);
      return total; // Skip this transaction to avoid skewing the total
    }

    return total + cost; // Ensure numerical addition
  }, 0);
};

const handlePrintReceipt = (billing: Billing) => {
  const calculatedTotal = calculateTotalCost(billing.relatedTransactions);
  const displayTotal = calculatedTotal;

  const receiptContent = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Receipt - ${billing.transactionId}</title>
 <style>
  @page {
    size: 80mm auto;
    margin: 0mm 0mm 0mm 0mm; /* Top, Right, Bottom, Left - all set to zero */
    padding: 0;
  }
  body {
    width: 80mm;
    margin: 0mm !important; /* Force zero margins */
    padding: 0mm !important; /* Force zero padding */
    font-family: 'Arial', sans-serif;
    font-size: 11px;
    color: #000;
    line-height: 1.2;
  }
  .receipt-container {
    padding: 1mm 2mm 1mm 2mm; /* Reduced padding: top, right, bottom, left */
    margin: 0;
  }
  .header {
    text-align: center;
    margin-bottom: 1mm; /* Reduced from 2mm */
    padding: 0;
  }
  .header img {
    width: 60px; /* Slightly smaller logo */
    height: auto;
    margin-bottom: 1mm; /* Reduced from 2mm */
  }
  .header h1 {
    font-size: 13px; /* Slightly smaller */
    margin: 1px 0; /* Reduced margins */
    font-weight: bold;
    line-height: 1.2;
  }
  .header p {
    font-size: 9px; /* Slightly smaller */
    margin: 1px 0; /* Reduced margins */
    line-height: 1.2;
  }
  
        .details {
          margin-bottom: 3mm;
          border-top: 1px dashed #000;
          border-bottom: 1px dashed #000;
          padding: 2mm 0;
        }
        .details p {
          margin: 0;
          line-height: 1.3;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          font-size: 10px;
        }
        th, td {
          text-align: left;
          padding: 2px 0;
        }
        th {
          border-bottom: 1px solid #000;
          font-weight: bold;
        }
        td:last-child, th:last-child {
          text-align: right;
        }
        .total {
          border-top: 1px dashed #000;
          margin-top: 3mm;
          padding-top: 2mm;
          font-size: 12px;
          font-weight: bold;
          text-align: right;
        }
        .footer {
          text-align: center;
          font-size: 9px;
          margin-top: 4mm;
        }
        @media print {
          body {
            margin: 0;
            padding: 0;
          }
        }
      </style>
    </head>
    <body>
      <div class="receipt-container">
        <div class="header">
          <img src="https://app.racheleyeemr.com.ng/images/rachel.png" alt="Logo" />
          <h1>Rachel Eye Center</h1>
          <p>No. 23 Onitsha Crescent, off Gimbiya street, Garki Area 11</p>
          <p>Phone: +234 814 801 9410</p>
        </div>
        <div class="details">
          <p><strong>Transaction ID:</strong> ${billing.transactionId}</p>
          <p><strong>Date:</strong> ${billing.created_at ? new Date(billing.created_at).toLocaleString() : 'N/A'}</p>
          <p><strong>Patient:</strong> ${billing.patient.firstName} ${billing.patient.lastName}</p>
          <p><strong>Payment Method:</strong> ${billing.paymentMethod || 'N/A'}</p>
          <p><strong>Status:</strong> ${billing.paymentStatus.toUpperCase()}</p>
        </div>
        <table>
          <thead>
            <tr>
              <th>Item</th>
              <th>Qty</th>
              <th>Price</th>
              <th>Total</th>
            </tr>
          </thead>
          <tbody>
            ${billing.relatedTransactions.map(t => `
              <tr>
                <td>${t.product?.productName || t.service?.serviceName || 'N/A'}</td>
                <td>${t.quantity}</td>
                <td>₦${Number(t.cost / t.quantity).toFixed(2)}</td>
                <td>₦${Number(t.cost).toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
        <div class="total">
          Total: ₦${new Intl.NumberFormat().format(displayTotal)}
        </div>
        <div class="footer">
          <p>Thank you for choosing Rachel Eye Center!</p>
          <p>www.racheleye.com.ng</p>
        </div>
      </div>
      <script>
        window.onload = () => {
          window.print();
          setTimeout(() => window.close(), 500);
        };
      </script>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  if (!printWindow) return;
  printWindow.document.write(receiptContent);
  printWindow.document.close();
};


  const handleEdit = (index) => {
    setModalOpen(true);
  };

  const handleDispense = (index) => {
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
      const updatedItems = [...billingItems];
      updatedItems[editItemIndex] = updatedItem;
      setBillingItems(updatedItems);
      setEditItemIndex(null);
    } else {
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
        {(role === "FRONT_DESK" || role === "NURSE" || role === "SUPER_ADMIN") && (
          <TableCell>Action</TableCell>
        )}
      </TableRow>
    </TableHead>
    <TableBody>
      {filteredBillings.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((billing) => {
        // Calculate the total cost for this billing
        const calculatedTotal = calculateTotalCost(billing.relatedTransactions);

        // Log for debugging
        console.log(`Billing ${billing.transactionId} - Calculated Total: ${calculatedTotal}, API Total: ${billing.total_cost}`);

        // Warn if there's a mismatch
        if (calculatedTotal !== billing.total_cost) {
          console.warn(
            `Total cost mismatch for billing ${billing.transactionId}: ` +
            `API total = ${billing.total_cost}, Calculated total = ${calculatedTotal}`
          );
        }

        return (
          <TableRow key={billing.billingId}>
            <TableCell>
              {billing.created_at &&
                new Date(billing.created_at).toLocaleString('en-US', {
                  weekday: 'long',
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
            </TableCell>
            <TableCell>{billing.transactionId}</TableCell>
            <TableCell>{billing.patient.firstName} {billing.patient.lastName}</TableCell>
            <TableCell>
              ₦{calculatedTotal ? new Intl.NumberFormat().format(calculatedTotal) : 'N/A'}
            </TableCell>
            <TableCell>{billing.paymentMethod}</TableCell>
            <TableCell>
              <span
                style={{
                  backgroundColor: billing.paymentStatus === 'pending' ? '#FFC107' : '#4CAF50',
                  color: 'white',
                  fontWeight: 'bold',
                  padding: '4px 8px',
                  borderRadius: '4px',
                }}
              >
                {billing.paymentStatus.toUpperCase()}
              </span>
            </TableCell>
            <TableCell>
              {(role === 'CLINIC_RECEPTIONIST' || role === 'FRONT_DESK' || role === 'SUPER_ADMIN') && (
                <>
                  <IconButton onClick={() => handleView(billing)} color="primary">
                    <Visibility />
                  </IconButton>
                  {billing.paymentStatus === 'paid' && (
                    <IconButton onClick={() => handlePrintReceipt(billing)} color="success">
                      <Print />
                    </IconButton>
                  )}
                  {billing.paymentStatus === 'pending' && (
                    <IconButton onClick={() => handlePaymentsClick(billing)} color="warning">
                      <Payments />
                    </IconButton>
                  )}
                  {billing.paymentStatus === 'pending' && (
                    <IconButton onClick={() => handleEdit(billing)} color="secondary">
                      <Edit />
                    </IconButton>
                  )}
                  {billing.paymentStatus === 'pending' && (
                    <IconButton onClick={() => handleDelete(billing)} color="error">
                      <Delete />
                    </IconButton>
                  )}
                </>
              )}
              {role === 'NURSE' && billing.paymentStatus === 'paid' && (
                <IconButton onClick={() => handleDispense(billing)} color="success">
                  <Outbound />
                </IconButton>
              )}
            </TableCell>
          </TableRow>
        );
      })}
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

      <Modal open={openViewModal} onClose={() => setOpenViewModal(false)}>
        <Box sx={modalStyle}>
          <Typography variant="h5" gutterBottom>
            Billing Details
          </Typography>
          {selectedBilling && (
            <>
              <Typography variant="body1">
                <strong>Full Name:</strong> {`${selectedBilling.patient.firstName} ${selectedBilling.patient.lastName}`}
              </Typography>
              <Typography variant="body1">
                <strong>Email:</strong> {selectedBilling.patient.email}
              </Typography>
              <Typography variant="body1">
                <strong>Phone Number:</strong> {selectedBilling.patient.phoneNumber}
              </Typography>
              <Typography variant="body1">
                <strong>Doctor:</strong> {selectedBilling.patient.doctor?.doctorName || 'N/A'}
              </Typography>
              <Typography variant="body1">
                <strong>Billing Date:</strong> {selectedBilling.created_at &&
                  new Date(selectedBilling.created_at).toLocaleString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    hour12: true
                  })}
              </Typography>
              <Typography variant="h6" gutterBottom>
                Items
              </Typography>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Item Name</TableCell>
                    <TableCell>Category</TableCell>
                    <TableCell>Quantity</TableCell>
                    <TableCell>Price</TableCell>
                    <TableCell>Total</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {selectedBilling.relatedTransactions.map((transaction, index) => (
                    <TableRow key={index}>
                      <TableCell>{transaction.product?.productName || transaction.service?.serviceName}</TableCell>
                      <TableCell>{transaction.categoryType || transaction.billingType}</TableCell>
                      <TableCell>{transaction.quantity}</TableCell>
                      <TableCell>₦{transaction.cost ? new Intl.NumberFormat().format(transaction.cost) : "N/A"}</TableCell>
                      <TableCell>₦{transaction.cost && transaction.quantity ? new Intl.NumberFormat().format(transaction.cost * transaction.quantity) : "N/A"}</TableCell>
                    </TableRow>
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
              <Grid item xs={12} sm={6}>
                <TextField
                  name="billingDate"
                  type="date"
                  fullWidth
                  label="Billing Date"
                  value={selectedBilling?.billingDate || ''}
                  onChange={handleFormChange}
                  InputLabelProps={{ shrink: true }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="billingTime"
                  type="time"
                  fullWidth
                  label="Billing Time"
                  value={selectedBilling?.billingTime || ''}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  name="comment"
                  fullWidth
                  label="Comment"
                  value={selectedBilling?.comment || ''}
                  onChange={handleFormChange}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Doctor</InputLabel>
                  <Select
                    name="doctor"
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
              <MenuItem value="hmo">HMO</MenuItem>
              <MenuItem value="retainership">Retainership</MenuItem>
            </Select>
            <TextField
              label="Payment Reference"
              fullWidth
              margin="normal"
              value={formData.paymentReference}
              onChange={handleChange}
              name="paymentReference"
            />
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