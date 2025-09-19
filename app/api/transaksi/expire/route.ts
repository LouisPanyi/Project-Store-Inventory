import { NextResponse } from "next/server";
import postgres from "postgres";

const sql = postgres(process.env.DATABASE_URL!);

export async function POST(req: Request) {
  // Amankan API Route dengan secret key
  const authHeader = req.headers.get('authorization');
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response('Unauthorized', {
      status: 401,
    });
  }

  try {
    // Cari semua transaksi yang statusnya 'pending' dan dibuat lebih dari 15 menit yang lalu
    const expiredTransactions = await sql`
      UPDATE transaksi
      SET status = 'canceled'
      WHERE 
        status = 'pending' AND 
        payment_method = 'qris' AND
        createdat <= NOW() - INTERVAL '15 minutes'
      RETURNING transaksi_id, status
    `;

    if (expiredTransactions.count > 0) {
      console.log(`${expiredTransactions.count} transaksi kedaluwarsa telah diubah menjadi 'canceled'.`);
    } else {
      console.log('Tidak ada transaksi kedaluwarsa yang ditemukan.');
    }

    return NextResponse.json({ 
      ok: true, 
      updatedCount: expiredTransactions.count,
      updatedIds: expiredTransactions.map(t => t.transaksi_id)
    });

  } catch (err) {
    console.error("Cron job error:", err);
    return NextResponse.json({ error: "Gagal memproses transaksi kedaluwarsa" }, { status: 500 });
  }
}