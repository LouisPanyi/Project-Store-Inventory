import postgres from "postgres";
import { NextResponse } from "next/server";

const sql = postgres(process.env.DATABASE_URL!);

export async function GET(
  req: Request,
  context: { params: Promise<{ id: string }> }
) {
  const { id } = await context.params;

  const [trx] = await sql`
    SELECT transaksi_id, customer, status, totalprice, pay, back, createdat, qris_url
    FROM transaksi
    WHERE transaksi_id = ${id};
  `;

  const items = await sql`
    SELECT p.name, p.price, d.quantity, d.subtotal
    FROM detail_transaksi d
    JOIN produk p ON p.produk_id = d.produk_id
    WHERE d.transaksi_id = ${id};
  `;

  return NextResponse.json({
    transaksi_id: trx.transaksi_id,
    customer: trx.customer,
    status: trx.status,
    totalPrice: Number(trx.totalprice) || 0,
    pay: Number(trx.pay) || 0,
    back: Number(trx.back) || 0,
    date: trx.createdat,
    qris_url: trx.qris_url, 
    items: items.map((i) => ({
      name: i.name,
      price: i.price,
      quantity: Number(i.quantity),
      subtotal: Number(i.subtotal),
    })),
  });
}
