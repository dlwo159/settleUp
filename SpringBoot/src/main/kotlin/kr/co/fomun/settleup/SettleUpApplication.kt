package kr.co.fomun.settleup

import org.springframework.boot.autoconfigure.SpringBootApplication
import org.springframework.boot.runApplication
import org.springframework.cache.annotation.EnableCaching

@SpringBootApplication
@EnableCaching
class SettleUpApplication

fun main(args: Array<String>) {
    runApplication<SettleUpApplication>(*args)
}
