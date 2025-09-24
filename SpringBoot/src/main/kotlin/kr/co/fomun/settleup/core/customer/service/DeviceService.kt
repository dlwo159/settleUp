package kr.co.fomun.settleup.core.customer.service

import kr.co.fomun.settleup.core.customer.domain.Customer
import kr.co.fomun.settleup.core.customer.domain.Device
import kr.co.fomun.settleup.core.customer.repository.CustomerRepository
import kr.co.fomun.settleup.core.customer.repository.DeviceRepository
import kr.co.fomun.settleup.dto.customer.CustomerRequest
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class DeviceService(
    private val deviceRepository: DeviceRepository,
) {
    @Transactional
    fun save(device: Device): Device {
        return deviceRepository.save(device)
    }
    @Transactional
    fun findByCustomerId(customerId: String): Device {
        return deviceRepository.findById(customerId).orElse(null)
    }
}