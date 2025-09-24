package kr.co.fomun.settleup.core.customer.external

import kr.co.fomun.settleup.core.authority.domain.Auth
import kr.co.fomun.settleup.core.authority.external.AuthExternalService
import kr.co.fomun.settleup.core.common.common.Writer
import kr.co.fomun.settleup.core.customer.domain.Customer
import kr.co.fomun.settleup.core.customer.domain.CustomerSetting
import kr.co.fomun.settleup.core.customer.repository.CustomerRepository
import kr.co.fomun.settleup.core.customer.repository.CustomerSettingRepository
import kr.co.fomun.settleup.dto.customer.CustomerDto
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CustomerExternalService(
    private val customerRepository: CustomerRepository,
    private val customerSettingRepository: CustomerSettingRepository,
    private val authExternalService: AuthExternalService,
) {
    @Transactional
    fun create(auth: Auth): CustomerDto {
        val newCustomerId = customerRepository.makeByCustomerId()

        val customer = Customer(
            customerId = newCustomerId,
            writer = Writer(newCustomerId)
        )
        customerRepository.save(customer)

        val customerSetting = CustomerSetting(
            customerId = newCustomerId,
            writer = Writer(newCustomerId)
        )
        customerSettingRepository.save(customerSetting)

        auth.customerId = newCustomerId
        authExternalService.save(auth)

        return CustomerDto(customer, customerSetting)
    }

    @Transactional(readOnly = true)
    fun findByCustomerId(customerId: String): Customer? {
        return customerRepository.findByCustomerId(customerId)
    }

}