function formatCurrency(
    amount: number,
    currencyCode: string = "USD"
): string {
    try {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: currencyCode.toUpperCase(),
        }).format(amount);
    } catch (error) {
        console.error("Invalid currency code:", currencyCode, error)
        return `${currencyCode.toUpperCase()} ${amount.toFixed(2)}`
    }
}

export default formatCurrency