declare module "midtrans-client" {
  export class Snap {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });
    createTransactionToken(params: any): Promise<string>;
    createTransaction(params: any): Promise<any>;
  }

  export class CoreApi {
    constructor(options: {
      isProduction: boolean;
      serverKey: string;
      clientKey: string;
    });
    charge(params: any): Promise<any>;
    capture(params: any): Promise<any>;
    transaction: {
      notification(body: any): Promise<any>;
      status(orderId: string): Promise<any>;
      cancel(orderId: string): Promise<any>;
      expire(orderId: string): Promise<any>;
    };
  }
}
