package kr.co.fomun.settleup.core.customer.service

import kr.co.fomun.settleup.core.customer.domain.Customer
import kr.co.fomun.settleup.core.customer.repository.CustomerRepository
import kr.co.fomun.settleup.dto.customer.CustomerRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CustomerService(
    private val customerRepository: CustomerRepository,
) {
    @Transactional
    fun update(customerId: String, customerRequest: CustomerRequest): Customer {
        val customer = customerRepository.findByCustomerId(customerId)
            ?: throw IllegalArgumentException()
        customer.name = customerRequest.name
        customer.account = customerRequest.account
        customer.writer.update(customerId)
        return customer
    }

    @Transactional(readOnly = true)
    fun findByCustomerId(customerId: String): Customer? {
        return customerRepository.findByCustomerId(customerId)
    }

}