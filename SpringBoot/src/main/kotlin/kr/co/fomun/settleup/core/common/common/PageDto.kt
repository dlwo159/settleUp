package kr.co.fomun.settleup.core.common.common

import org.springframework.data.domain.Page

// 공통 페이지 DTO
data class PageDto<T>(
    val content: List<T>,
    val page: Int,
    val size: Int,
    val totalElements: Long,
    val totalPages: Int,
)

// Page -> PageDto 변환 확장 함수
fun <T, R> Page<T>.toDto(mapper: (T) -> R) = PageDto(
    content = content.map(mapper),
    page = number,
    size = size,
    totalElements = totalElements,
    totalPages = totalPages,
)

fun <T> Page<T>.toDto(): PageDto<T> = PageDto(
    content = content,
    page = number,
    size = size,
    totalElements = totalElements,
    totalPages = totalPages,
)

fun <T> emptyPageDto(): PageDto<T> = PageDto(
    content = emptyList(),
    page = 0,
    size = 0,
    totalElements = 0,
    totalPages = 0
)