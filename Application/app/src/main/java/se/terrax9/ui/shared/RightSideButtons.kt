package se.terrax9.ui.shared

import BackButton
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.width
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import se.terrax9.R
import se.terrax9.Routes
import se.terrax9.ui.screens.controller.IconButton

@Composable
fun RightSideButtons(navController: NavController){
    Column (
        modifier = Modifier.fillMaxSize()
            .padding(end = 71.dp, top = 71.dp),
        horizontalAlignment = Alignment.End,
        verticalArrangement = Arrangement.Top
    ) {
        GallerySettingsColumn(navController = navController)
        Spacer(modifier =  Modifier.weight(1f))
        BackButton(navController = navController)
    }
}

@Composable
fun GallerySettingsColumn(navController: NavController) {
    Column(
        modifier = Modifier
        ,
        horizontalAlignment = Alignment.End,
        verticalArrangement = Arrangement.Top
    ) {
        IconButton(
            text = "Gallery",
            iconRes = R.drawable.images
        ) {
            navController.navigate(Routes.Gallery)
        }

        Spacer(modifier = Modifier.padding(16.dp))

        IconButton(
            text = "Settings",
            iconRes = R.drawable.settings
        ) {
            navController.navigate(Routes.Settings)
        }
    }
}

@Preview
@Composable
fun RightSideButtonsPreview() {
    val navController = rememberNavController()
    RightSideButtons(navController = navController)
}