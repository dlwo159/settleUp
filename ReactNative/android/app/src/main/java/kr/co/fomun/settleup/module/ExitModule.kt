package kr.co.fomun.settleup.module

import android.app.Activity;
import android.os.Handler;
import android.os.Looper;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

class ExitModule(private val reactContext: ReactApplicationContext) : ReactContextBaseJavaModule(reactContext) {

    override fun getName(): String {
        return "ExitModule"
    }

    @ReactMethod
    fun exit() {
        val activity: Activity? = currentActivity
        activity?.let {
            Handler(Looper.getMainLooper()).post {
                it.finishAffinity()   // 현재 액티비티 및 관련 액티비티 종료
                System.exit(0)        // 프로세스 완전 종료
            }
        }
    }
}
