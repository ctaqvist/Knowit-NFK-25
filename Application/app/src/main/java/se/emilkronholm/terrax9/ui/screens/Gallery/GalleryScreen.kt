import android.util.Log
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.getValue
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.unit.dp
import coil.compose.AsyncImage
import coil.request.ImageRequest
import androidx.compose.runtime.collectAsState
import androidx.lifecycle.viewmodel.compose.viewModel
import se.emilkronholm.terrax9.ui.screens.Gallery.GalleryViewModel

@Composable
fun GalleryScreen(viewModel: GalleryViewModel = viewModel()) {
    val imageUrls by viewModel.imageUrls.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()

    when {
        isLoading -> {
            CircularProgressIndicator(modifier = Modifier.padding(16.dp))
        }
        error != null -> {
            Text("Error: $error", modifier = Modifier.padding(16.dp))
        }
        imageUrls.isEmpty() -> {
            Text("No images to display.", modifier = Modifier.padding(16.dp))
        }
        else -> {
            LazyVerticalGrid(
                columns = GridCells.Fixed(5),
                modifier = Modifier.fillMaxSize(),
                contentPadding = PaddingValues(10.dp),
                verticalArrangement = Arrangement.spacedBy(4.dp),
                horizontalArrangement = Arrangement.spacedBy(4.dp)
            ) {
                items(imageUrls) { imageUrl ->
                    HttpImage(
                        url = imageUrl,
                        modifier = Modifier
                            .aspectRatio(1f)
                            .fillMaxWidth()
                    )
                }
            }
        }
    }
}


@Composable
fun HttpImage(url: String, modifier: Modifier = Modifier) {
    AsyncImage(
        model = ImageRequest.Builder(LocalContext.current)
            .data(url)
            .crossfade(true)
            .build(),
        contentDescription = "Image from $url",
        modifier = modifier,
        contentScale = ContentScale.Crop,
        onError = {
            Log.e("HttpImage", "Error loading image from $url", it.result.throwable)
        }
    )
}
