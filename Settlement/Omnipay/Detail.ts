import * as isoly from "isoly"

export interface Detail {
	transactionReferenceNumber: string
	transactionType: "credit" | "debit"
	description: string
	currencyCode: isoly.Currency
	monetaryAmount: number
	decimalPlaces: number
	merchantId: string
	merchantName: string
	dDays: string
	paymentReference: string
	receiverAccountName: string
	receiverAccountNumber: string
	internationalBankCode: string
	receiverLocalBankCode: string
	bankName: string
	bankCityName: string
	receiverCountryCode: isoly.CountryCode.Alpha3
	internationalBankAccountNumber: string
	customerPaymentText: string
	fundingDate: isoly.Date
	postingDate: isoly.Date
	acquirerTelephoneNumber: string
	debtorName: string
	debtorIban: string
	debtorBic: string
}
