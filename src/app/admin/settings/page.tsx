"use client";

import { useState } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function AdminSettingsPage() {
  const [storeName, setStoreName] = useState("CellCraze");
  const [storeEmail, setStoreEmail] = useState("info@cellcraze.lk");
  const [storePhone, setStorePhone] = useState("+94 11 234 5678");
  const [currency] = useState("LKR");
  const [taxRate, setTaxRate] = useState("0");
  const [shippingFee, setShippingFee] = useState("35000");
  const [freeShippingThreshold, setFreeShippingThreshold] = useState("500000");

  const labelClass =
    "block text-[11px] uppercase tracking-[0.08em] font-semibold text-ink/60 mb-1";

  return (
    <div>
      <h1 className="text-[32px] font-[800] mb-1">Settings</h1>
      <p className="text-[14px] text-muted mb-8">Store configuration</p>

      <div className="max-w-[720px] space-y-6">
        <div>
          <label className={labelClass}>Store Name</label>
          <Input
            value={storeName}
            onChange={(e) => setStoreName(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Store Email</label>
          <Input
            type="email"
            value={storeEmail}
            onChange={(e) => setStoreEmail(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Store Phone</label>
          <Input
            value={storePhone}
            onChange={(e) => setStorePhone(e.target.value)}
          />
        </div>

        <div>
          <label className={labelClass}>Currency</label>
          <Input value={currency} disabled />
        </div>

        <div className="border-t-2 border-divider pt-6">
          <h2 className="text-[20px] font-[800] mb-4">Pricing</h2>
          <div className="space-y-5">
            <div>
              <label className={labelClass}>Tax Rate (%)</label>
              <Input
                type="number"
                value={taxRate}
                onChange={(e) => setTaxRate(e.target.value)}
                placeholder="e.g. 8"
              />
            </div>

            <div>
              <label className={labelClass}>Default Shipping Fee (cents)</label>
              <Input
                type="number"
                value={shippingFee}
                onChange={(e) => setShippingFee(e.target.value)}
                placeholder="e.g. 35000"
              />
            </div>

            <div>
              <label className={labelClass}>Free Shipping Threshold (cents)</label>
              <Input
                type="number"
                value={freeShippingThreshold}
                onChange={(e) => setFreeShippingThreshold(e.target.value)}
                placeholder="e.g. 500000"
              />
            </div>
          </div>
        </div>

        <div className="border-t-2 border-divider pt-6">
          <Button size="lg" leadingIcon={<Save size={18} />}>
            Save Settings
          </Button>
        </div>
      </div>
    </div>
  );
}
