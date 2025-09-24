package kr.co.fomun.settleup.core.customer.external

import kr.co.fomun.settleup.core.customer.domain.CustomerSetting
import kr.co.fomun.settleup.core.customer.repository.CustomerSettingRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CustomerSettingExternalService(
    private val customerSettingRepository: CustomerSettingRepository,
) {
    @Transactional(readOnly = true)
    fun findByCustomerId(customerId: String): CustomerSetting? {
        return customerSettingRepository.findByCustomerId(customerId)
    }
}