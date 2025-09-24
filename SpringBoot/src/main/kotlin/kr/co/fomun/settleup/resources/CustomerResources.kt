package kr.co.fomun.settleup.resources

import kr.co.fomun.settleup.core.common.common.JsonResultSet
import kr.co.fomun.settleup.core.common.common.enum.ResultStatus
import kr.co.fomun.settleup.core.customer.service.CustomerService
import kr.co.fomun.settleup.core.customer.service.CustomerSettingService
import kr.co.fomun.settleup.dto.customer.CustomerRequest
import kr.co.fomun.settleup.dto.customer.CustomerSettingRequest
import kr.co.fomun.settleup.security.CustomUser
import org.slf4j.LoggerFactory
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController


@RestController
@RequestMapping("/api/customers")
class CustomerResources(
    private val customerService: CustomerService,
    private val customerSettingService: CustomerSettingService,
) {
    private val logger = LoggerFactory.getLogger(CustomerResources::class.java)

    @PutMapping
    fun save(@RequestBody req: CustomerRequest, @AuthenticationPrincipal customUser: CustomUser): JsonResultSet {
        return try {
            logger.info("/api/customers - {}", customUser.userId)
            val updated = customerService.update(
                customUser.userId,
                req
            )
            JsonResultSet(ResultStatus.SUCCESS, updated)
        } catch (e: IllegalArgumentException) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "잘못된 접근입니다")
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "고객센터로 문의해주세요\n오류코드 : 2001")
        }
    }

    @PutMapping("/settings")
    fun settings(
        @RequestBody req: CustomerSettingRequest,
        @AuthenticationPrincipal customUser: CustomUser
    ): JsonResultSet {
        return try {
            logger.info("/api/customers/settings - {}", customUser.userId)
            val updated = customerSettingService.update(
                customUser.userId,
                req
            )
            JsonResultSet(ResultStatus.SUCCESS, updated)
        } catch (e: IllegalArgumentException) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "잘못된 접근입니다")
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "고객센터로 문의해주세요\n오류코드 : 2002")
        }
    }
}