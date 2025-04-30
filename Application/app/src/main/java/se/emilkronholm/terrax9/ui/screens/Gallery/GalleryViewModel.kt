package se.emilkronholm.terrax9.ui.screens.Gallery

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import android.util.Log
import se.emilkronholm.terrax9.services.APIService

class GalleryViewModel : ViewModel() {
    private val apiService = APIService()

    private val url = "https://terrax9.se/images/"

    private val _imageUrls = MutableStateFlow<List<String>>(emptyList())
    val imageUrls: StateFlow<List<String>> = _imageUrls

    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    init {
        fetchImages()
    }

    private fun fetchImages() {
        _isLoading.value = true
        _error.value = null
        _imageUrls.value = emptyList()

        viewModelScope.launch(Dispatchers.IO) {
            try {
                val urls = fetchImageUrls(url)
                _imageUrls.value = urls
            } catch (e: Exception) {
                _error.value = "An unexpected error occurred."
                Log.e("GalleryViewModel", "Unexpected error", e)
            } finally {
                _isLoading.value = false
            }
        }
    }

    private fun fetchImageUrls(url: String): List<String> {
        val responseBody = apiService.sendHttpRequester(url)
        Log.d("HttpImageUrlsResponse", responseBody)

        return Json.decodeFromString(responseBody)
    }

    fun refreshImages() {
        fetchImages()
    }
}
