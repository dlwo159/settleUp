package kr.co.fomun.settleup.service
import kr.co.fomun.settleup.R

import android.app.NotificationChannel
import android.app.NotificationManager
import android.content.Context
import android.os.Build
import android.util.Log
import androidx.core.app.NotificationCompat
import com.google.firebase.messaging.FirebaseMessagingService
import com.google.firebase.messaging.RemoteMessage

class FirebaseMessagingService : FirebaseMessagingService() {
    private val TAG = "FirebaseMsgService"
    private val CHANNEL_ID = "default_channel"

    override fun onCreate() {
        super.onCreate()
        createNotificationChannel()
    }

//    override fun onMessageReceived(remoteMessage: RemoteMessage) {
//        super.onMessageReceived(remoteMessage)
//
//        remoteMessage.notification?.let {
//            val title = it.title ?: "칼같이정산 알림"
//            val body = it.body ?: "수신된 푸쉬알림이 있습니다"
//
//            showNotification(title, body)
//        }
//    }

    override fun onNewToken(token: String) {
        super.onNewToken(token)
        Log.d(TAG, "New token: $token")
    }

    private fun createNotificationChannel() {
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.O) {
            val name = "Default Channel"
            val descriptionText = "General notifications"
            val importance = NotificationManager.IMPORTANCE_LOW
            val channel = NotificationChannel(CHANNEL_ID, name, importance).apply {
                description = descriptionText
            }
            val manager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
            manager.createNotificationChannel(channel)
        }
    }

    private fun showNotification(title: String, body: String) {
        val notificationBuilder = NotificationCompat.Builder(this, CHANNEL_ID)
            .setSmallIcon(R.mipmap.ic_launcher) // 앱 아이콘으로 변경
            .setContentTitle(title)
            .setContentText(body)
            .setPriority(NotificationCompat.PRIORITY_HIGH)
            .setAutoCancel(true)

        val notificationManager = getSystemService(Context.NOTIFICATION_SERVICE) as NotificationManager
        notificationManager.notify(0, notificationBuilder.build())
    }
}