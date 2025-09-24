package kr.co.fomun.settleup.core.authority.external

import kr.co.fomun.settleup.core.authority.domain.Auth
import kr.co.fomun.settleup.core.authority.repository.AuthRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class AuthExternalService(private val authRepository: AuthRepository) {

    @Transactional
    fun save(auth: Auth): Auth = authRepository.save(auth)

}