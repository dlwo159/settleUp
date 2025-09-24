package kr.co.fomun.settleup.core.authority.repository

import kr.co.fomun.settleup.core.authority.domain.Auth
import org.springframework.data.jpa.repository.JpaRepository

interface AuthRepository : JpaRepository<Auth, String> {
    fun findByToken(token: String): Auth?
}