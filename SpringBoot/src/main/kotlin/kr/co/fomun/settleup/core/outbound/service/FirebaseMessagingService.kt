package kr.co.fomun.settleup.core.outbound.service

import com.google.firebase.messaging.*
import org.springframework.stereotype.Service
import java.util.concurrent.ExecutionException

@Service
class FirebaseMessagingService {

    @Throws(InterruptedException::class, ExecutionException::class)
    fun sendNotification(
        token: String,
        title: String,
        body: String,
        data: Map<String, String> = emptyMap()
    ): String {

        val notification = Notification.builder()
            .setTitle(title)
            .setBody(body)
            .build()

        val message = Message.builder()
            .setToken(token) // ✅ 메시지를 받을 디바이스의 토큰
            .setNotification(notification)
            .putAllData(data) // ✅ 추가 데이터
            .build()

        // 메시지 전송 및 결과 반환
        return FirebaseMessaging.getInstance().sendAsync(message).get()
    }
}