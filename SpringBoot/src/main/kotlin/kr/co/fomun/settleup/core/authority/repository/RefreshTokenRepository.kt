package kr.co.fomun.settleup.core.authority.repository

import kr.co.fomun.settleup.core.authority.domain.RefreshToken
import org.springframework.data.jpa.repository.JpaRepository

interface RefreshTokenRepository : JpaRepository<RefreshToken, String> {
    fun deleteByCustomerId(customerId: String): Long

    fun findByCustomerId(customerId: String): RefreshToken?
}
