package se.terrax9.viewmodels

import android.content.Context
import android.content.SharedPreferences

object TokenDatabase {
    private const val PREFS_NAME  = "user_prefs"
    private const val KEY_TOKEN   = "auth_token"

    private fun prefs(ctx: Context): SharedPreferences =
        ctx.getSharedPreferences(PREFS_NAME, Context.MODE_PRIVATE)

    /** Save the token persistently */
    fun saveToken(ctx: Context, token: String) {
        prefs(ctx)
            .edit()
            .putString(KEY_TOKEN, token)
            .apply()
    }

    /** Load the saved token, or null if none was stored */
    fun loadToken(ctx: Context): String? =
        prefs(ctx).getString(KEY_TOKEN, null)

    /** Remove any stored token */
    fun clearToken(ctx: Context) {
        prefs(ctx)
            .edit()
            .remove(KEY_TOKEN)
            .apply()
    }
}