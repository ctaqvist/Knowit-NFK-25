import android.util.Log
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxHeight
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.foundation.layout.wrapContentWidth
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.GridItemSpan
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.foundation.lazy.grid.rememberLazyGridState
import androidx.compose.material.ExperimentalMaterialApi
import androidx.compose.material.pullrefresh.PullRefreshIndicator
import androidx.compose.material.pullrefresh.pullRefresh
import androidx.compose.material.pullrefresh.rememberPullRefreshState
import androidx.compose.material3.CircularProgressIndicator
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.collectAsState
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.font.Font
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import coil.compose.AsyncImage
import coil.request.ImageRequest
import se.terrax9.R
import se.terrax9.ui.screens.Gallery.GalleryViewModel
import se.terrax9.ui.shared.RightSideButtons

@OptIn(ExperimentalMaterialApi::class)
@Composable
fun GalleryScreen(
    navController: NavController,
    viewModel: GalleryViewModel = viewModel()
) {
    val imageUrls by viewModel.imageUrls.collectAsState()
    val imageGroups by viewModel.imageGroups.collectAsState()
    val isLoading by viewModel.isLoading.collectAsState()
    val error by viewModel.error.collectAsState()
    val gridState = rememberLazyGridState()

    var refreshing by remember { mutableStateOf(false) }
    val pullRefreshState = rememberPullRefreshState(
        refreshing = refreshing,
        onRefresh = {
            refreshing = true
            viewModel.refreshImages()
        }
    )

    LaunchedEffect(isLoading) {
        if (!isLoading && refreshing) {
            refreshing = false
        }
    }

    Box(
        modifier = Modifier
            .fillMaxSize()
            .pullRefresh(pullRefreshState)
    ) {
        when {
            // Loading indicator
            isLoading && !refreshing -> {
                CircularProgressIndicator(modifier = Modifier.align(Alignment.Center))
            }

            // Error state
            error != null -> {
                Text(
                    "Error: $error",
                    modifier = Modifier
                        .padding(16.dp)
                        .align(Alignment.Center)
                )
            }

            // No images
            imageUrls.isEmpty() && !isLoading -> {
                Text(
                    "No images to display.",
                    modifier = Modifier
                        .padding(16.dp)
                        .align(Alignment.Center)
                )
            }

            else -> {
                // Ensure "Others" group comes last
                val (others, sortedGroups) = imageGroups.partition { it.title == "Others" }
                val sortedImageGroups = sortedGroups + others

                    Box(
                        modifier = Modifier
                            .fillMaxHeight()
                            .fillMaxWidth()
                    ) {
                        // Background image
                        Image(
                            painter = painterResource(R.drawable.backgroundpicture),
                            contentDescription = null,
                            contentScale = ContentScale.Crop,
                            modifier = Modifier.fillMaxSize()
                        )
                        Row {
                            LazyVerticalGrid(
                                columns = GridCells.Fixed(5),
                                state = gridState,
                                modifier = Modifier
                                    .fillMaxSize(0.8f)
                                    .padding(start = 71.dp, top = 50.dp, bottom = 50.dp, end = 16.dp),
                                verticalArrangement = Arrangement.spacedBy(19.dp),
                                horizontalArrangement = Arrangement.spacedBy(19.dp),
                                contentPadding = PaddingValues(0.dp)
                            ) {
                                sortedImageGroups.forEach { group ->
                                    // Section title
                                    item(span = { GridItemSpan(maxLineSpan) }) {
                                        Text(
                                            text = group.title,
                                            style = TextStyle(
                                                fontSize = 32.sp,
                                                fontFamily = FontFamily(Font(R.font.lexendera)),
                                                fontWeight = FontWeight.W500,
                                                color = Color.White
                                            ),
                                            modifier = Modifier
                                                .padding(bottom = 20.dp, top = 10.dp)
                                        )
                                    }
                                    // Images in that section
                                    items(group.images) { url ->
                                        HttpImage(
                                            url = url,
                                            modifier = Modifier
                                                .aspectRatio(1.6F)
                                                .height(150.dp)
                                                .width(250.dp)
                                        )
                                    }
                                }
                            }
                            RightSideButtons(navController = navController)
                        }

                    }
            }
        }

        // Pull-to-refresh indicator
        PullRefreshIndicator(
            refreshing = refreshing,
            state = pullRefreshState,
            modifier = Modifier.align(Alignment.TopCenter),
            backgroundColor = MaterialTheme.colorScheme.surface,
            contentColor = MaterialTheme.colorScheme.primary
        )
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