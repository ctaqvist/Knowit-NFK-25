package se.terrax9.ui.screens.login

import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.setValue
import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.flow.MutableSharedFlow
import kotlinx.coroutines.flow.asSharedFlow
import kotlinx.coroutines.launch
import kotlinx.coroutines.runBlocking
import okhttp3.Call
import okhttp3.Callback
import okhttp3.FormBody
import okhttp3.OkHttpClient
import okhttp3.Request
import okhttp3.Response
import org.json.JSONException
import org.json.JSONObject
import se.terrax9.services.UserData
import java.io.IOException

enum class LoginEvent {
    LOGIN_SUCCESS,
    BAD_CREDENTIALS,
    NO_NETWORK,
    UNKNOWN_ERROR
}

class LoginViewModel() : ViewModel() {

    var success by mutableStateOf(false)
    var failed by mutableStateOf(false)
    var status by mutableStateOf("")
    var password by mutableStateOf("1234")
    var email by mutableStateOf("admin")

    private val _events = MutableSharedFlow<LoginEvent>()
    val events = _events.asSharedFlow()

    fun isEmailValid(email: String): Boolean {
        return Regex("^[A-Za-z0-9+_.%-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,63}$").matches(email)
    }

    fun login() {
        println("Will nog log in with E: $email and P: $password")

        if (email == "wrong" || email == "right") {
            status = if (email == "wrong") "failed" else "success"
            failed = email == "wrong"
            viewModelScope.launch {
                _events.emit(if (email == "wrong") LoginEvent.BAD_CREDENTIALS else LoginEvent.LOGIN_SUCCESS)
            }
            return
        }

        val client = OkHttpClient()
        val formBody = FormBody.Builder()
            .add("username", email)
            .add("password", password)
            .build()
        val request =
            Request.Builder().url("http://13.60.235.253:8081/login").post(formBody).build()

        status = "Loading"

        client.newCall(request)
            .enqueue(object : Callback {
                override fun onFailure(call: Call, e: IOException) {
                    println("API - Login failed: ${e.message}")
                    status = "Failed"

                    viewModelScope.launch {
                        _events.emit(LoginEvent.BAD_CREDENTIALS)
                    }

                }

                override fun onResponse(call: Call, response: Response) {

                    // 1) Safely get the response body as a String
                    val bodyString = response.body?.string()
                    if (bodyString == null) {
                        println("Empty response!")
                        status = "Failed"
                        failed = true
                        viewModelScope.launch {
                            _events.emit(LoginEvent.UNKNOWN_ERROR)
                        }
                        return
                    }

                    println("Raw responses: $response")

                    // 2) Parse it as JSON and pull out the "token"
                    try {
                        val json = JSONObject(bodyString)
                        val token = json.getString("token")
                        println("Success! Token is $token")
                        status = "Success! See log for token"

                        // Call login to add email and token
                        UserData.login(email, token)

                        viewModelScope.launch {
                            _events.emit(LoginEvent.LOGIN_SUCCESS)
                        }
                        // store/use the token…
                    } catch (e: JSONException) {
                        println("Failed to parse JSON: ${e.message}")
                        failed = true
                        status = "Failed"
                        viewModelScope.launch {
                            _events.emit(LoginEvent.UNKNOWN_ERROR)
                        }
                    }
                }

            })
    }
}