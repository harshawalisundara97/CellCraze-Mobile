"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import TextField from "@mui/material/TextField";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stepper from "@mui/material/Stepper";
import Step from "@mui/material/Step";
import StepLabel from "@mui/material/StepLabel";
import FormControl from "@mui/material/FormControl";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Radio from "@mui/material/Radio";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/stores/cart.store";

export default function CheckoutPage() {
  const router = useRouter();
  const cartItems = useCartStore((s) => s.items);
  const clearCart = useCartStore((s) => s.clearCart);

  const [paymentMethod, setPaymentMethod] = useState<"STRIPE" | "COD" | "BANK_TRANSFER">("STRIPE");
  const [address, setAddress] = useState({
    recipientName: "",
    phone: "",
    line1: "",
    line2: "",
    city: "",
    province: "",
    postalCode: "",
  });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const subtotal = cartItems.reduce((s, i) => s + i.price * i.quantity, 0);
  const shipping = subtotal >= 1000000 ? 0 : 50000;
  const total = subtotal + shipping;

  const update = (field: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setAddress((prev) => ({ ...prev, [field]: e.target.value }));

  const requiredFilled =
    address.recipientName &&
    address.phone &&
    address.line1 &&
    address.city &&
    address.province &&
    address.postalCode;

  const handlePlaceOrder = async () => {
    setError(null);

    if (cartItems.length === 0) {
      setError("Your cart is empty.");
      return;
    }
    if (!requiredFilled) {
      setError("Please fill in all required delivery fields.");
      return;
    }

    setSubmitting(true);
    try {
      // 1. Save the delivery address
      const addrRes = await fetch("/api/addresses", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...address, isDefault: true }),
      });
      if (addrRes.status === 401) {
        router.push("/login?redirect=/checkout");
        return;
      }
      if (!addrRes.ok) {
        const body = await addrRes.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not save address.");
      }
      const savedAddress = await addrRes.json();

      // 2. Sync the client cart to the server cart
      for (const item of cartItems) {
        await fetch("/api/cart/items", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ productId: item.productId, quantity: item.quantity }),
        });
      }

      // 3. Create the order
      const orderRes = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ addressId: savedAddress.id, paymentMethod }),
      });
      if (!orderRes.ok) {
        const body = await orderRes.json().catch(() => ({}));
        throw new Error(body.error ?? "Could not place order.");
      }
      const order = await orderRes.json();

      clearCart();
      router.push(`/orders/${order.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Box className="px-[40px] max-md:px-4">
      <Box component="nav" className="py-3">
        <Typography variant="body2" component="span" sx={{ fontSize: "13px" }}>
          <Link href="/" style={{ textDecoration: "none", color: "inherit" }}>Home</Link>
          <span className="mx-2">/</span>
          <Link href="/cart" style={{ textDecoration: "none", color: "inherit" }}>Cart</Link>
          <span className="mx-2">/</span>
          <Typography component="span" sx={{ fontSize: "13px", fontWeight: 600, color: "text.primary" }}>Checkout</Typography>
        </Typography>
      </Box>

      <Typography variant="h1" sx={{ fontSize: { xs: "36px", md: "56px" }, mb: 2 }}>Checkout</Typography>

      <Stepper activeStep={0} alternativeLabel sx={{ mb: 4 }}>
        <Step><StepLabel>Delivery</StepLabel></Step>
        <Step><StepLabel>Payment</StepLabel></Step>
        <Step><StepLabel>Confirmation</StepLabel></Step>
      </Stepper>

      <Box className="grid grid-cols-[1fr_380px] gap-0 max-md:grid-cols-1" sx={{ borderBottom: 2, borderColor: "divider" }}>
        <Box sx={{ borderRight: { xs: 0, md: 2 }, borderColor: "divider" }} className="pr-10 pb-10 max-md:pr-0">
          <Typography variant="h5" sx={{ fontSize: "20px", mb: 3 }}>Delivery address</Typography>
          <Box className="grid grid-cols-2 gap-4 max-md:grid-cols-1">
            {[
              { label: "Recipient name", field: "recipientName", span: 2 },
              { label: "Phone", field: "phone", span: 1 },
              { label: "Postal code", field: "postalCode", span: 1 },
              { label: "Address line 1", field: "line1", span: 2 },
              { label: "Address line 2", field: "line2", span: 2 },
              { label: "City", field: "city", span: 1 },
              { label: "Province", field: "province", span: 1 },
            ].map(({ label, field, span }) => (
              <Box key={field} className={span === 2 ? "col-span-2 max-md:col-span-1" : ""}>
                <TextField
                  label={label}
                  value={(address as any)[field]}
                  onChange={update(field)}
                  fullWidth
                  size="small"
                />
              </Box>
            ))}
          </Box>

          <Typography variant="h5" sx={{ fontSize: "20px", mt: 5, mb: 2 }}>Payment method</Typography>
          <FormControl component="fieldset" fullWidth>
            <RadioGroup
              value={paymentMethod}
              onChange={(e) => setPaymentMethod(e.target.value as typeof paymentMethod)}
            >
              {[
                { value: "STRIPE" as const, label: "Credit / Debit Card", desc: "Secure payment via Stripe" },
                { value: "COD" as const, label: "Cash on Delivery", desc: "Pay when you receive" },
                { value: "BANK_TRANSFER" as const, label: "Bank Transfer", desc: "Manual bank transfer" },
              ].map((method) => (
                <Card
                  key={method.value}
                  variant="outlined"
                  sx={{
                    mb: 1,
                    borderWidth: 2,
                    borderColor: paymentMethod === method.value ? "primary.main" : "divider",
                    bgcolor: paymentMethod === method.value ? "primary.50" : "transparent",
                    cursor: "pointer",
                    transition: "all 0.15s",
                  }}
                  onClick={() => setPaymentMethod(method.value)}
                >
                  <CardContent className="flex items-center gap-3" sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
                    <Radio value={method.value} color="primary" />
                    <Box>
                      <Typography sx={{ fontWeight: 800, fontSize: "14px" }}>{method.label}</Typography>
                      <Typography variant="body2" sx={{ fontSize: "12px" }}>{method.desc}</Typography>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </RadioGroup>
          </FormControl>
        </Box>

        {/* Order summary */}
        <Box className="pl-10 pb-10 max-md:pl-0 max-md:pt-6">
          <Typography variant="h5" sx={{ fontSize: "20px", mb: 3 }}>Order summary</Typography>
          {cartItems.length === 0 && (
            <Typography variant="body2" color="text.secondary" sx={{ fontSize: "14px", mb: 1.5 }}>
              Your cart is empty.{" "}
              <Link href="/products" style={{ color: "inherit", fontWeight: 700 }}>Browse products</Link>
            </Typography>
          )}
          {cartItems.map((item) => (
            <Box key={item.productId} className="flex justify-between" sx={{ mb: 1.5 }}>
              <Typography sx={{ fontSize: "14px" }}>
                {item.name} <Typography component="span" color="text.secondary" sx={{ fontSize: "14px" }}>x{item.quantity}</Typography>
              </Typography>
              <Typography sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums", fontSize: "14px" }}>
                {formatCurrency(item.price * item.quantity)}
              </Typography>
            </Box>
          ))}
          <Divider sx={{ my: 1.5 }} />
          <Box className="flex justify-between" sx={{ mb: 1 }}>
            <Typography variant="body2" sx={{ fontSize: "14px" }}>Subtotal</Typography>
            <Typography sx={{ fontVariantNumeric: "tabular-nums", fontSize: "14px" }}>{formatCurrency(subtotal)}</Typography>
          </Box>
          <Box className="flex justify-between" sx={{ mb: 2 }}>
            <Typography variant="body2" sx={{ fontSize: "14px" }}>Shipping</Typography>
            <Typography sx={{ fontVariantNumeric: "tabular-nums", fontSize: "14px" }}>{shipping === 0 ? "Free" : formatCurrency(shipping)}</Typography>
          </Box>
          <Divider sx={{ borderWidth: 1 }} />
          <Box className="flex justify-between" sx={{ pt: 2 }}>
            <Typography sx={{ fontWeight: 800, fontSize: "18px" }}>Total</Typography>
            <Typography sx={{ fontWeight: 800, fontVariantNumeric: "tabular-nums", fontSize: "18px" }}>{formatCurrency(total)}</Typography>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mt: 3 }}>
              {error}
            </Alert>
          )}
          <Button
            variant="contained"
            size="large"
            fullWidth
            sx={{ mt: error ? 2 : 3 }}
            onClick={handlePlaceOrder}
            disabled={submitting || cartItems.length === 0}
          >
            {submitting ? "Placing order..." : "Place order"}
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
