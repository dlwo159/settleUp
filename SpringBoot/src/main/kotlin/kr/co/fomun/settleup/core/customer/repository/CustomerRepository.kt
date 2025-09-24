package kr.co.fomun.settleup.core.customer.repository

import kr.co.fomun.settleup.core.customer.domain.Customer
import org.springframework.data.jpa.repository.JpaRepository

interface CustomerRepository : JpaRepository<Customer, String>, CustomerRepositoryCustom {
    fun findByCustomerId(customerId: String): Customer?
}

interface CustomerRepositoryCustom {
    fun makeByCustomerId(): String
}