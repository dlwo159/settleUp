package kr.co.fomun.settleup.config

import com.google.auth.oauth2.GoogleCredentials
import com.google.firebase.FirebaseApp
import com.google.firebase.FirebaseOptions
import org.springframework.core.io.ClassPathResource
import org.springframework.stereotype.Component
import java.io.FileInputStream
import javax.annotation.PostConstruct

@Component
class FirebaseInitializer {

    @PostConstruct
    fun initialize() {
        val serviceAccountStream = ClassPathResource("settle-up-f3f86-firebase-adminsdk-fbsvc-20153e609b.json").inputStream

        val options = FirebaseOptions.builder()
            .setCredentials(GoogleCredentials.fromStream(serviceAccountStream))
            .build()

        FirebaseApp.initializeApp(options)
    }
}