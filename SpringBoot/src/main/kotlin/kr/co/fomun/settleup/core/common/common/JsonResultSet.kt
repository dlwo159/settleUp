package kr.co.fomun.settleup.core.common.common

import kr.co.fomun.settleup.core.common.common.enum.ResultStatus

class JsonResultSet(
    var status: ResultStatus = ResultStatus.SUCCESS,
    var message: String? = null,
    var data: Any? = null,
) {

    constructor(status: ResultStatus, message: String) : this(status, message, null)

    constructor(status: ResultStatus, data: Any) : this(status, null, data)

    fun setSuccess(data: Any? = null) {
        status = ResultStatus.SUCCESS
        this.data = data
    }

    fun setFail(message: String? = null) {
        status = ResultStatus.FAIL
        this.message = message
    }
}
