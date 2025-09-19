import { NextRequest, NextResponse } from "next/server";
import { coreApi } from "@/app/lib/midtrans";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const statusResponse = await coreApi.transaction.notification(body);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;

    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      // update status jadi paid
      await sql`
        UPDATE transaksi SET status = 'paid'
        WHERE transaksi_id = ${orderId}
      `;

      // kurangi stok produk
      const details = await sql`
        SELECT produk_id, quantity FROM detail_transaksi WHERE transaksi_id = ${orderId}
      `;
      for (const d of details) {
        await sql`
          UPDATE produk SET stock = stock - ${d.quantity} WHERE produk_id = ${d.produk_id}
        `;
      }
    }
    if (transactionStatus === "expire") {
      await sql`
    UPDATE transaksi SET status = 'canceled'
    WHERE transaksi_id = ${orderId}
  `;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Midtrans notif error:", err);
    return NextResponse.json({ error: "notif error" }, { status: 500 });
  }
}
