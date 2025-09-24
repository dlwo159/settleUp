package kr.co.fomun.settleup.module

import com.facebook.react.ReactPackage
import com.facebook.react.bridge.NativeModule
import com.facebook.react.bridge.ReactApplicationContext
import com.facebook.react.uimanager.ViewManager

class BridgePackage : ReactPackage {
    override fun createViewManagers(reactContext: ReactApplicationContext): List<ViewManager<*, *>> {
        return emptyList()
    }

    override fun createNativeModules(reactContext: ReactApplicationContext): List<NativeModule> {
        val modules: MutableList<NativeModule> = ArrayList()
        modules.add(DeviceModule(reactContext))
        modules.add(ExitModule(reactContext))
        return modules
    }
}