package se.terrax9.ui.screens.Gallery

import androidx.lifecycle.ViewModel
import androidx.lifecycle.viewModelScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.launch
import kotlinx.serialization.json.Json
import android.util.Log
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import se.terrax9.services.APIService
import se.terrax9.services.UserData
import java.text.SimpleDateFormat
import java.util.*

data class ImageGroup(
    val title: String,
    val images: List<String>
)



class GalleryViewModel : ViewModel() {
    private val apiService = APIService()

    private val url = "http://terrax9.se:8081/images?token${UserData.token ?: ""}"

    private val _imageUrls = MutableStateFlow<List<String>>(emptyList())
    val imageUrls: StateFlow<List<String>> = _imageUrls

    private val _isLoading = MutableStateFlow(true)
    val isLoading: StateFlow<Boolean> = _isLoading

    private val _error = MutableStateFlow<String?>(null)
    val error: StateFlow<String?> = _error

    private val _imageGroups = MutableStateFlow<List<ImageGroup>>(emptyList())
    val imageGroups: StateFlow<List<ImageGroup>> = _imageGroups

    var showFullScreenImage = MutableStateFlow(value = false)
    var imageToShow = MutableStateFlow(value = "")

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
                _imageGroups.value = groupImagesByDate(urls)
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

    private fun groupImagesByDate(imageUrls: List<String>): List<ImageGroup> {
        val grouped = mutableMapOf<String, MutableList<String>>()

        val currentYear = Calendar.getInstance().get(Calendar.YEAR)

        for (url in imageUrls) {
            // Get just the filename
            val filename = url.substringAfterLast("/")
            val dateGroup = extractDateGroupFromFilename(filename, currentYear) ?: "Others"

            grouped.getOrPut(dateGroup) { mutableListOf() }.add(url)
        }

        return grouped.map { (title, images) ->
            ImageGroup(title, images)
        }.sortedByDescending { it.title }
    }

    // Helper to extract date group
    private fun extractDateGroupFromFilename(filename: String, currentYear: Int): String? {
        // Match something like 2025-04-24T14-08-13
        val regex = Regex("(\\d{4}-\\d{2}-\\d{2})T")
        val match = regex.find(filename) ?: return null
        // E.g., "2025-04-24"
        val dateStr = match.groupValues[1]

        return try {
            val sdf = SimpleDateFormat("yyyy-MM-dd", Locale.getDefault())
            val date = sdf.parse(dateStr)

            val cal = Calendar.getInstance().apply { time = date }
            val day = cal.get(Calendar.DAY_OF_MONTH)
            val month = cal.getDisplayName(Calendar.MONTH, Calendar.LONG, Locale.getDefault())
            val year = cal.get(Calendar.YEAR)

            if (year == currentYear) {
                "$day $month"
            } else {
                "$day $month $year"
            }
        } catch (e: Exception) {
            null
        }
    }


    fun closeFullScreenImage(){
        showFullScreenImage.value = false
    }

    fun showFullScreenImage(){
        showFullScreenImage.value = true
    }

    fun resetImageToShow(){
        imageToShow.value = ""
    }

    fun setImageToShow(image: String){
        imageToShow.value = image
    }

    fun getImageToShow(): String{
        return imageToShow.value
    }
}
