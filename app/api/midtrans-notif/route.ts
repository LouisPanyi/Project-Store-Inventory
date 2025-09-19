import { NextRequest, NextResponse } from "next/server";
import { coreApi } from "@/app/lib/midtrans";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    // pakai coreApi untuk parse notifikasi
    const statusResponse = await coreApi.transaction.notification(body);

    const orderId = statusResponse.order_id;
    const transactionStatus = statusResponse.transaction_status;

    if (transactionStatus === "settlement" || transactionStatus === "capture") {
      await sql`
        UPDATE transaksi SET status = 'paid'
        WHERE transaksi_id = ${orderId}
      `;
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("Midtrans notif error:", err);
    return NextResponse.json({ error: "notif error" }, { status: 500 });
  }
}