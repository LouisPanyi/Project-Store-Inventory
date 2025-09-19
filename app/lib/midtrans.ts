// app/lib/midtrans.ts
import midtransClient from "midtrans-client";

export const snap = new midtransClient.Snap({
  isProduction: true, // ganti true kalau sudah live
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

export const coreApi = new midtransClient.CoreApi({
  isProduction: true,
  serverKey: process.env.MIDTRANS_SERVER_KEY!,
  clientKey: process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY!,
});

// fungsi ini dipakai route.ts kamu
export async function createMidtransTransaction(
  orderId: string,
  amount: number,
  customer: string
) {
  const parameter = {
    transaction_details: {
      order_id: orderId,
      gross_amount: amount,
    },
    customer_details: {
      first_name: customer,
    },
    enabled_payments: ["qris"], // sesuai kebutuhanmu
    qris: {
      acquirer: "gopay", // default qris, bisa juga "bca", "permata", dll
    },
  };

  return await snap.createTransaction(parameter);
}
