package kr.co.fomun.settleup.dto.guest

data class GuestPaymentItemFormRequest(
    val title: String = "",
    val cost: Long = 0,
    val memberList: List<GuestMemberRequest> = listOf(),
)