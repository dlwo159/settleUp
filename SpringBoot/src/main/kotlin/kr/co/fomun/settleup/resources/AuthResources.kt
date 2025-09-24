package kr.co.fomun.settleup.resources

import jakarta.servlet.http.HttpServletRequest
import jakarta.servlet.http.HttpServletResponse
import kr.co.fomun.settleup.core.authority.domain.RefreshToken
import kr.co.fomun.settleup.core.authority.service.AuthService
import kr.co.fomun.settleup.core.authority.service.RefreshTokenService
import kr.co.fomun.settleup.core.common.common.JsonResultSet
import kr.co.fomun.settleup.core.common.common.enum.ResultStatus
import kr.co.fomun.settleup.core.common.common.enum.TokenStatus
import kr.co.fomun.settleup.core.customer.domain.Device
import kr.co.fomun.settleup.core.customer.service.DeviceService
import kr.co.fomun.settleup.dto.authority.AuthRequest
import kr.co.fomun.settleup.security.CustomUser
import kr.co.fomun.settleup.security.JwtTokenProvider
import org.slf4j.LoggerFactory
import org.springframework.security.core.annotation.AuthenticationPrincipal
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/auth")
class AuthResources(
    private val jwtTokenProvider: JwtTokenProvider,
    private val authService: AuthService,
    private val refreshTokenService: RefreshTokenService,
    private val deviceService: DeviceService,
) {
    private val logger = LoggerFactory.getLogger(AuthResources::class.java)

    @PostMapping("/login")
    fun login(@RequestBody req: AuthRequest, res: HttpServletResponse): JsonResultSet {
        return try {
            val result = authService.loginOrRegister(req.token, req.type)

            val device = Device(
                result.customerDto.customer!!.customerId,
                req.model,
                req.os,
                req.systemVersion,
                req.pushToken,
            )
            deviceService.save(device)

            res.setHeader("Access-Token", result.accessToken)
            res.setHeader("Refresh-Token", result.refreshToken)

            JsonResultSet(ResultStatus.SUCCESS, result.customerDto)
        } catch (e: IllegalArgumentException) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "잘못된 접근입니다")
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            JsonResultSet(ResultStatus.FAIL, "고객센터로 문의해주세요\n오류코드 : 1001")
        }
    }

    @PostMapping("/logout")
    fun logout(@AuthenticationPrincipal customUser: CustomUser): JsonResultSet {
        logger.info("/api/auth/logout - {}", customUser.userId)
        try {
            refreshTokenService.delete(customUser.userId)

            return JsonResultSet(ResultStatus.SUCCESS)
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            return JsonResultSet(ResultStatus.FAIL, "고객센터로 문의해주세요\n오류코드 : 1002")
        }
    }

    @PostMapping("/refresh")
    fun refresh(req: HttpServletRequest, res: HttpServletResponse): JsonResultSet {
        try {
            val refreshToken = req.getHeader("Refresh-Token")
            val access = jwtTokenProvider.validateToken(refreshToken)
            if (access == TokenStatus.VALID) {
                val customerId = jwtTokenProvider.getUserIdByDecrypt(refreshToken)
                val dbRefreshToken = refreshTokenService.getByCustomerId(customerId)
                if (dbRefreshToken != null && refreshToken.toString() == dbRefreshToken.refreshToken) {
                    val tokenInfo = jwtTokenProvider.createToken(customerId)
                    val refreshToken = RefreshToken(
                        refreshToken = tokenInfo.refreshToken,
                        customerId = customerId,
                    )
                    refreshTokenService.save(refreshToken)

                    res.setHeader("Access-Token", tokenInfo.accessToken)
                    res.setHeader("Refresh-Token", tokenInfo.refreshToken)
                }
            }

            return JsonResultSet(ResultStatus.SUCCESS)
        } catch (e: Exception) {
            logger.error("{}, {}", e.message, e)
            return JsonResultSet(ResultStatus.FAIL, "고객센터로 문의해주세요\n오류코드 : 1003")
        }
    }
}