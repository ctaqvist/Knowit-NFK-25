import android.content.Context
import android.content.Intent
import android.net.Uri
import androidx.lifecycle.ViewModel

enum class SettingsLink(val url: String) {
    GOOGLE("https://www.google.com"),
    ANDROID_DEVELOPERS("https://developer.android.com"),
    KOTLIN("https://kotlinlang.org");
}

class SettingsViewModel : ViewModel() {

    fun openWebPage(context: Context, webLink: SettingsLink) {
        val builder = androidx.browser.customtabs.CustomTabsIntent.Builder()
        val customTabsIntent = builder.build()
        customTabsIntent.launchUrl(context, Uri.parse(webLink.url))
    }
}