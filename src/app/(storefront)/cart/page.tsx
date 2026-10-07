"use client";

import Link from "next/link";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import TextField from "@mui/material/TextField";
import Divider from "@mui/material/Divider";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteOutlinedIcon from "@mui/icons-material/DeleteOutlined";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  const updateQty = (productId: string, quantity: number, delta: number) => {
    updateQuantity(productId, quantity + delta);
  };

  const remove = (productId: string) => {
    removeItem(productId);
  };

  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const shipping = subtotal >= 1000000 ? 0 : 50000;
  const total = subtotal + shipping;

  return (
    <Box className="px-[40px] max-md:px-4">
      <Box component="nav" className="py-3">
        <Typography variant="body2" component="span" sx={{ fontSize: "13px" }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
          <span className="mx-2">/</span>
          <Typography component="span" sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary" }}>Cart</Typography>
        </Typography>
      </Box>

      <Typography variant="h1" sx={{ fontSize: { xs: "36px", md: "56px" }, mb: 1 }}>Cart</Typography>
      <Typography variant="body2" sx={{ fontSize: "15px", mb: 4 }}>
        {items.length} item{items.length !== 1 ? "s" : ""}
      </Typography>

      {items.length === 0 ? (
        <Box className="flex flex-col items-center" sx={{ py: 10 }}>
          <Typography variant="body1" color="text.secondary" sx={{ fontSize: "17px", mb: 3 }}>
            Your cart is empty.
          </Typography>
          <Button variant="contained" size="large" endIcon={<ArrowForwardIcon />} component={Link} href="/products">
            Browse products
          </Button>
        </Box>
      ) : (
        <Box className="grid grid-cols-[1fr_380px] gap-0 max-md:grid-cols-1">
          {/* Line items */}
          <Box>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell align="center">Quantity</TableCell>
                  <TableCell align="right">Total</TableCell>
                  <TableCell align="right" sx={{ width: 48 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {items.map((item) => (
                  <TableRow key={item.productId}>
                    <TableCell>
                      <Box className="flex items-center gap-4">
                        <Box sx={{ width: 64, height: 64, bgcolor: "background.paper", filter: "grayscale(1)", flexShrink: 0 }} />
                        <Box>
                          <Typography sx={{ fontWeight: 800, fontSize: "15px" }}>{item.name}</Typography>
                          <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums", fontSize: "14px", mt: 0.5 }}>
                            {formatCurrency(item.price)}
                          </Typography>
                        </Box>
                      </Box>
                    </TableCell>
                    <TableCell align="center">
                      <Box className="flex items-center justify-center gap-1">
                        <IconButton size="small" onClick={() => updateQty(item.productId, item.quantity, -1)}>
                          <RemoveIcon fontSize="small" />
                        </IconButton>
                        <TextField
                          value={item.quantity}
                          size="small"
                          slotProps={{ htmlInput: { readOnly: true, style: { textAlign: "center", width: 32, fontWeight: 800, fontVariantNumeric: "tabular-nums" } } }}
                          sx={{ "& .MuiOutlinedInput-root": { px: 0 } }}
                        />
                        <IconButton size="small" onClick={() => updateQty(item.productId, item.quantity, 1)}>
                          <AddIcon fontSize="small" />
                        </IconButton>
                      </Box>
                    </TableCell>
                    <TableCell align="right">
                      <Typography sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums", fontSize: "15px" }}>
                        {formatCurrency(item.price * item.quantity)}
                      </Typography>
                    </TableCell>
                    <TableCell align="right">
                      <IconButton size="small" onClick={() => remove(item.productId)} sx={{ color: "text.disabled", "&:hover": { color: "primary.main" } }}>
                        <DeleteOutlinedIcon fontSize="small" />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Box>

          {/* Order summary */}
          <Box sx={{ borderLeft: { xs: 0, md: 2 }, borderTop: { xs: 2, md: 0 }, borderColor: "divider" }} className="pl-10 pt-6 pb-10 max-md:pl-0 max-md:pt-6">
            <Typography variant="h5" sx={{ fontSize: "20px", mb: 3 }}>Order summary</Typography>
            <Box className="flex justify-between" sx={{ mb: 1 }}>
              <Typography variant="body2" sx={{ fontSize: "14px" }}>Subtotal</Typography>
              <Typography sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums", fontSize: "14px" }}>{formatCurrency(subtotal)}</Typography>
            </Box>
            <Box className="flex justify-between" sx={{ mb: 2 }}>
              <Typography variant="body2" sx={{ fontSize: "14px" }}>Shipping</Typography>
              <Typography sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums", fontSize: "14px" }}>{shipping === 0 ? "Free" : formatCurrency(shipping)}</Typography>
            </Box>
            <Divider sx={{ borderWidth: 1 }} />
            <Box className="flex justify-between" sx={{ pt: 2 }}>
              <Typography sx={{ fontWeight: 800, fontSize: "18px" }}>Total</Typography>
              <Typography sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums", fontSize: "18px" }}>{formatCurrency(total)}</Typography>
            </Box>
            {shipping > 0 && (
              <Typography variant="body2" sx={{ mt: 1, fontSize: "12px" }}>
                Free shipping on orders over Rs 10,000
              </Typography>
            )}
            <Button
              variant="contained"
              size="large"
              fullWidth
              endIcon={<ArrowForwardIcon />}
              component={Link}
              href="/checkout"
              sx={{ mt: 3 }}
            >
              Proceed to checkout
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}
