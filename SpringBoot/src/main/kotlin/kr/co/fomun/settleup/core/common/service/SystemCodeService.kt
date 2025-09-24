package kr.co.fomun.settleup.core.common.service

import kr.co.fomun.settleup.core.common.domain.SystemCode
import kr.co.fomun.settleup.core.common.repository.SystemCodeRepository
import org.springframework.cache.annotation.Cacheable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class SystemCodeService(
    private val systemCodeRepository: SystemCodeRepository,
) {
    @Transactional(readOnly = true)
    @Cacheable(value = ["systemCodes"], key = "#code")
    fun findByCode(code: String): SystemCode? {
        return systemCodeRepository.findById(code).orElse(null)
    }
}