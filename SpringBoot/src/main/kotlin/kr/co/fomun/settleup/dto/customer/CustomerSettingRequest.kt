package kr.co.fomun.settleup.dto.customer

data class CustomerSettingRequest(
    val viewType: String = "1",
    val helpYn: String = "N",
    val payerSendYn: String = "N",
    val decimalPoint: String = "2",
    val cutting: Int = 1,
    val cuttingYn: String = "N",
)