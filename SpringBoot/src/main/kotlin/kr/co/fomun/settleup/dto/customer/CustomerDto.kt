package kr.co.fomun.settleup.dto.customer

import kr.co.fomun.settleup.core.customer.domain.Customer
import kr.co.fomun.settleup.core.customer.domain.CustomerSetting

data class CustomerDto(
    val customer: Customer? = null,
    val customerSetting: CustomerSetting? = null,
)