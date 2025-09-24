package kr.co.fomun.settleup.dto.paymentItem

import kr.co.fomun.settleup.core.paymentItem.domain.PaymentMember

data class PaymentItemRequest(
    val scheduleId: String = "",
    val paymentId: Long = 0L,
    val payer: String = "",
    val payerId: Long = 0L,
    val title: String = "",
    val cost: Long = 0L,
    val acceptYn: Boolean = false,
    val members: MutableList<PaymentMember> = mutableListOf(),
)