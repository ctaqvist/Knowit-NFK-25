package se.terrax9.ui.screens.login

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import okhttp3.Call
import okhttp3.Callback
import okhttp3.FormBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import org.json.JSONException
import org.json.JSONObject
import java.io.IOException

class LoginViewModel() : ViewModel() {

    var failed by mutableStateOf(false)
    var status by mutableStateOf("")
    var password by mutableStateOf("")
    var email by mutableStateOf("")

    fun isEmailValid(email: String): Boolean {
        return Regex("^[A-Za-z0-9+_.%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,63}$").matches(email)
    }

    fun login() {
        println("Will nog log in with E: $email and P: $password")
        val client = OkHttpClient()
        val formBody = FormBody.Builder()
            .add("username", email)
            .add("password", password)
            .build()
        val request = Request.Builder().url("https://terrax9.se/login").post(formBody).build()

        status = "Loading"

        client.newCall(request)
            .enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    println("API - Login failed")
                    status = "Failed"
                }

                override fun onResponse(call: Call, response: Response) {

                    // 1) Safely get the response body as a String
                    val bodyString = response.body?.string()
                    if (bodyString == null) {
                        println("Empty response!")
                        status = "Failed"
                        failed = true
                        return
                    }

                    println("Raw responses: $response")

                    // 2) Parse it as JSON and pull out the "token"
                    try {
                        val json = JSONObject(bodyString)
                        val token = json.getString("token")
                        println("Success! Token is $token")
                        status = "Success! See log for token"
                        // store/use the token…
                    } catch (e: JSONException) {
                        println("Failed to parse JSON: ${e.message}")
                        failed = true
                        status = "Failed"
                    }
                }

            })
    }
}