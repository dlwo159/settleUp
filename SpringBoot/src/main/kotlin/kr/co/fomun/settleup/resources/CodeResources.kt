package kr.co.fomun.settleup.resources

import kr.co.fomun.settleup.core.common.service.SystemCodeService
import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/code")
class CodeResources(
    private val systemCodeService: SystemCodeService,
) {
    private val logger = LoggerFactory.getLogger(CodeResources::class.java)

    @GetMapping("/version")
    fun version(): String {
        val systemCode = systemCodeService.findByCode("AOSVER")
        return systemCode?.value ?: "999999"
    }
}