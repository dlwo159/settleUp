package kr.co.fomun.settleup.core.customer.repository

import kr.co.fomun.settleup.core.customer.domain.Device
import org.springframework.data.jpa.repository.JpaRepository

interface DeviceRepository : JpaRepository<Device, String>, DeviceRepositoryCustom

interface DeviceRepositoryCustom {
//    fun updateByCustomerId(customerId: String): String
}