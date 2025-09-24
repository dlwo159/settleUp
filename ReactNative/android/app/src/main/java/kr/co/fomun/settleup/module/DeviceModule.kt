package kr.co.fomun.settleup.module

import android.app.Activity
import androidx.window.layout.*
import com.facebook.react.bridge.*
import com.facebook.react.modules.core.DeviceEventManagerModule
import kotlinx.coroutines.*
import kotlinx.coroutines.flow.collect
import kotlinx.coroutines.flow.distinctUntilChanged
import kotlinx.coroutines.flow.first
import kotlinx.coroutines.flow.map

class DeviceModule(private val reactContext: ReactApplicationContext) :
    ReactContextBaseJavaModule(reactContext) {

    private var foldListenerJob: Job? = null

    override fun getName(): String = "DeviceModule"

    @ReactMethod
    fun isFoldable(promise: Promise) {
        val activity = currentActivity
        if (activity == null) {
            promise.reject("NO_ACTIVITY", "No activity found")
            return
        }

        val windowInfoTracker = WindowInfoTracker.getOrCreate(activity)
        val windowLayoutInfoFlow = windowInfoTracker.windowLayoutInfo(activity)

        GlobalScope.launch(Dispatchers.Main) {
            try {
                val layoutInfo: WindowLayoutInfo = windowLayoutInfoFlow.first()
                val isFoldable = layoutInfo.displayFeatures.isNotEmpty()
                promise.resolve(isFoldable)
            } catch (e: Exception) {
                promise.reject("ERROR", "Error checking foldable: ${e.message}")
            }
        }
    }

    /**
     * 폴더블 상태 변화 감지 시작
     */
    @ReactMethod
    fun startFoldableListener() {
        val activity: Activity = currentActivity ?: return
        val tracker = WindowInfoTracker.getOrCreate(activity)

        // 기존 리스너가 있다면 제거
        foldListenerJob?.cancel()

        foldListenerJob = CoroutineScope(Dispatchers.Main).launch {
            tracker.windowLayoutInfo(activity)
                .map { info -> info.displayFeatures.filterIsInstance<FoldingFeature>().firstOrNull() }
                .distinctUntilChanged()
                .collect { foldingFeature ->
                    val isFolded = when (foldingFeature?.state) {
                        FoldingFeature.State.HALF_OPENED -> true
                        FoldingFeature.State.FLAT -> false
                        else -> false // or null
                    }

                    android.util.Log.d("DeviceModule", "FoldingFeature detected: $foldingFeature")
                    android.util.Log.d("DeviceModule", "Folding state: ${foldingFeature?.state}")

                    sendFoldableEvent(isFolded)
                }
        }
    }

    /**
     * 리스너 중지
     */
    @ReactMethod
    fun stopFoldableListener() {
        foldListenerJob?.cancel()
        foldListenerJob = null
    }

    /**
     * React Native로 이벤트 전송
     */
    private fun sendFoldableEvent(isFolded: Boolean) {
        val params = Arguments.createMap()
        params.putBoolean("isFolded", isFolded)
        reactContext
            .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter::class.java)
            .emit("onFoldableStateChanged", params)
    }
}