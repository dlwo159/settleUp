package kr.co.fomun.settleup.core.authority.service

import kr.co.fomun.settleup.core.authority.domain.Auth
import kr.co.fomun.settleup.core.authority.domain.RefreshToken
import kr.co.fomun.settleup.core.authority.repository.AuthRepository
import kr.co.fomun.settleup.core.authority.repository.RefreshTokenRepository
import kr.co.fomun.settleup.core.customer.external.CustomerExternalService
import kr.co.fomun.settleup.core.customer.external.CustomerSettingExternalService
import kr.co.fomun.settleup.dto.customer.CustomerDto
import kr.co.fomun.settleup.security.JwtTokenProvider
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.time.LocalDateTime

@Service
class AuthService(
    private val authRepository: AuthRepository,
    private val refreshTokenRepository: RefreshTokenRepository,
    private val customerExternalService: CustomerExternalService,
    private val customerExternalSettingService: CustomerSettingExternalService,
    private val jwtTokenProvider: JwtTokenProvider
) {
    @Transactional
    fun save(auth: Auth): Auth = authRepository.save(auth)

    data class LoginResult(
        val customerDto: CustomerDto,
        val accessToken: String,
        val refreshToken: String
    )

    @Transactional
    fun loginOrRegister(token: String, type: String): LoginResult {
        val existing = authRepository.findByToken(token)

        val customerId: String
        val customerDto: CustomerDto

        if (existing != null) {
            existing.lastLoginDate = LocalDateTime.now()

            val customer = customerExternalService.findByCustomerId(existing.customerId)
                ?: throw IllegalStateException("고객 정보가 없습니다: ${existing.customerId}")
            val setting = customerExternalSettingService.findByCustomerId(existing.customerId)
                ?: throw IllegalStateException("고객 설정이 없습니다: ${existing.customerId}")

            customerDto = CustomerDto(customer, setting)
            customerId = existing.customerId
        } else {
            // 신규 가입 플로우 (토큰, 타입으로 Auth 생성 → Customer/Setting 생성)
            val auth = Auth(token = token, type = type)
            customerDto = customerExternalService.create(auth)   // 내부 트랜잭션으로 고객/설정 생성
            customerId = customerDto.customer!!.customerId
        }

        // JWT 발급 + 리프레시 토큰 저장
        val tokenInfo = jwtTokenProvider.createToken(customerId)
        refreshTokenRepository.save(
            RefreshToken(
                refreshToken = tokenInfo.refreshToken,
                customerId = customerId
            )
        )

        return LoginResult(
            customerDto = customerDto,
            accessToken = tokenInfo.accessToken,
            refreshToken = tokenInfo.refreshToken
        )
    }
}