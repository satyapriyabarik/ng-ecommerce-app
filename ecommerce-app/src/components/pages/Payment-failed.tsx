const PaymentFailed = () => {
    return (
        <div className="container mx-auto p-4">
            <h4 className="text-2xl font-bold mb-4 animate__animated animate__flip animate__flipInY text-mted text-info">Payment Failed</h4>
            <p className="mb-4">Unfortunately, your payment could not be processed. Please try again.</p>
            <a href="/checkout" className="text-blue-500 hover:underline">Return to Checkout</a>
        </div>
    );
}
export default PaymentFailed;