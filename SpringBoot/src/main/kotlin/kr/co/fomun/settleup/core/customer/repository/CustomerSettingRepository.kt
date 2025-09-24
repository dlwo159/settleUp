package kr.co.fomun.settleup.core.customer.repository

import kr.co.fomun.settleup.core.customer.domain.CustomerSetting
import org.springframework.data.jpa.repository.JpaRepository

interface CustomerSettingRepository : JpaRepository<CustomerSetting, String> {
    fun findByCustomerId(customerId: String): CustomerSetting?
}
