package kr.co.fomun.settleup.dto.authority

data class AuthRequest(
    val token: String = "",
    val type: String = "LOCAL",
    val os: String? = null,
    val model: String? = null,
    val systemVersion: String? = null,
    val pushToken: String? = null,
)