package kr.co.fomun.settleup.core.customer.service

import kr.co.fomun.settleup.core.customer.domain.CustomerSetting
import kr.co.fomun.settleup.core.customer.repository.CustomerSettingRepository
import kr.co.fomun.settleup.dto.customer.CustomerSettingRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CustomerSettingService(
    private val customerSettingRepository: CustomerSettingRepository,
) {
    @Transactional
    fun update(customerId: String, customerSettingRequest: CustomerSettingRequest): CustomerSetting {
        val customerSetting = customerSettingRepository.findByCustomerId(customerId)
            ?: throw IllegalArgumentException()
        customerSetting.viewType = customerSettingRequest.viewType
        customerSetting.helpYn = customerSettingRequest.helpYn
        customerSetting.payerSendYn = customerSettingRequest.payerSendYn
        customerSetting.decimalPoint = customerSettingRequest.decimalPoint
        customerSetting.cutting = customerSettingRequest.cutting
        customerSetting.cuttingYn = customerSettingRequest.cuttingYn
        customerSetting.writer.update(customerId)
        return customerSetting
    }
}