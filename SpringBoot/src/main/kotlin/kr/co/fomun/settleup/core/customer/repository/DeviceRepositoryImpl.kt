package kr.co.fomun.settleup.core.customer.repository

import com.querydsl.jpa.impl.JPAQueryFactory
import kr.co.fomun.settleup.core.customer.domain.QCustomer
import kr.co.fomun.settleup.core.customer.domain.QDevice
import org.springframework.stereotype.Repository

@Repository
class DeviceRepositoryImpl(
    private val jpaQueryFactory: JPAQueryFactory
) : DeviceRepositoryCustom {

//    override fun updateByCustomerId(customerId: String): String {
//        val qDevice = QDevice.device
//
//        val maxCustomerId = jpaQueryFactory
//            .select(qCustomer.customerId.max())
//            .from(qCustomer)
//            .fetchFirst() ?: "C000000000"
//
//        return makeCustomerId(maxCustomerId)
//    }
//
//    fun makeCustomerId(maxCustomerId: String): String {
//        val newSeq = maxCustomerId.substring(1).toInt() + 1
//        return "C" + newSeq.toString().padStart(9, '0')
//    }
}