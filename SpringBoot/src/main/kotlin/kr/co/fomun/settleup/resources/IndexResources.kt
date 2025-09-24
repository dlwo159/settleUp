package kr.co.fomun.settleup.resources

import org.slf4j.LoggerFactory
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/index")
class IndexResources {
    private val logger = LoggerFactory.getLogger(IndexResources::class.java)

    @GetMapping
    fun index(): String {
        return "INDEX"
    }
}