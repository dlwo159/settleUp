package kr.co.fomun.settleup.dto.guest

data class GuestPaymentItemRequest(
    val payer: Long = 0L,
    val payerName: String = "",
    val account: String? = null,
    val paymentItemList: List<GuestPaymentItemFormRequest> = listOf(),
)