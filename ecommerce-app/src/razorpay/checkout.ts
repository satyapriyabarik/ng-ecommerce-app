
export function openRazorpay(orderId: string, amount: number, onSuccess: any) {
    if (!(window as any).Razorpay) {
        alert("Razorpay SDK not loaded. Please refresh and try again.");
        return;
    }
    const rzp = new (window as any).Razorpay({
        key: 'rzp_test_kDYa8CoNPN20El',
        amount: amount * 100,
        currency: 'INR',
        name: 'NGKART Store',
        order_id: orderId,
        handler: function (response: any) {
            if (onSuccess) {
                onSuccess({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature
                });
            }
        }
    });
    rzp.open();
}


