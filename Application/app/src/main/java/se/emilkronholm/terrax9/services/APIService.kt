package se.emilkronholm.terrax9.services

import android.util.Log
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import java.io.IOException

class APIService(){
    // Send a GET request to the given URL and return the response body as a string
    fun sendHttpRequester(url: String): String {
        val client = OkHttpClient()
        val request = Request.Builder().url(url).build()
        client.newCall(request).execute().use { response ->
            if (!response.isSuccessful) throw IOException("Unexpected code $response")
            val bodyString = response.body!!.string()
            Log.d("HttpResponse", bodyString)
            return bodyString
        }
    }
}