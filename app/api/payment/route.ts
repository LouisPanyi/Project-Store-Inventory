import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { customer, totalPrice } = await req.json();

    // Pastikan totalPrice adalah number
    const grossAmount = Number(totalPrice);
    if (!grossAmount || isNaN(grossAmount)) {
      return NextResponse.json(
        { error: "Invalid totalPrice" },
        { status: 400 }
      );
    }

    // Bikin order_id unik
    const orderId = `ORDER-${Date.now()}`;

    // Body request ke Midtrans
    const body = {
      transaction_details: {
        order_id: orderId,
        gross_amount: grossAmount,
      },
      customer_details: {
        first_name: customer,
      },
      enabled_payments: ["qris", "gopay"],
    };

    const response = await fetch(
      "https://app.production.midtrans.com/snap/v1/transactions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization:
            "Basic " +
            Buffer.from(process.env.MIDTRANS_SERVER_KEY + ":").toString("base64"),
        },
        body: JSON.stringify(body),
      }
    );

    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 500 }
    );
  }
}
