package kr.co.fomun.settleup.core.authority.service

import kr.co.fomun.settleup.core.authority.domain.RefreshToken
import kr.co.fomun.settleup.core.authority.repository.RefreshTokenRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class RefreshTokenService(private val refreshTokenRepository: RefreshTokenRepository) {

    @Transactional
    fun save(refreshToken: RefreshToken): RefreshToken {
        return refreshTokenRepository.save(refreshToken)
    }

    @Transactional
    fun delete(customerId: String) {
        refreshTokenRepository.deleteByCustomerId(customerId)
    }

    @Transactional(readOnly = true)
    fun getByCustomerId(customerId: String): RefreshToken? {
        return refreshTokenRepository.findByCustomerId(customerId)
    }

}