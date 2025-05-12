import android.content.Context
import androidx.compose.foundation.Image
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.tooling.preview.Preview
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import androidx.navigation.compose.rememberNavController
import se.terrax9.R
import se.terrax9.Routes
import se.terrax9.ui.screens.Settings.SelectRoverButton
import se.terrax9.ui.screens.controller.IconButton


@Composable
fun SettingsScreen(navController: NavController) {

    val viewModel: SettingsViewModel = viewModel()
    val context = LocalContext.current

    Box(modifier = Modifier.fillMaxSize()) {
        Image(
            painter = painterResource(R.drawable.backgroundpicture),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )

        Row(modifier = Modifier.fillMaxWidth()) {
            Column(
                modifier = Modifier
                    .padding(start = 70.dp)
                    .weight(1f),
                verticalArrangement = Arrangement.spacedBy(42.dp)
            ) {
                RoverInfo(username = "Moji", roverSerial = "Rover1")
                SelectRoverButton()
                SettingsButtons(viewModel, context)
            }

            RightSettingsColumn(navController = navController)
        }
        Box(
            modifier = Modifier
                .fillMaxSize()
                .padding(end = 70.dp, bottom = 21.dp),
            contentAlignment = Alignment.BottomEnd
        ) {
            BackButton(navController = navController)
        }
    }
}

@Composable
fun RightSettingsColumn(navController: NavController) {
    Column(
        modifier = Modifier
            .padding(end = 70.dp, top = 70.dp),
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
            // Handle click on settings
        }
    }
}

@Composable
fun SettingsButtons(viewModel: SettingsViewModel, context: Context) {
    Column(verticalArrangement = Arrangement.spacedBy(42.dp)) {
        Row(horizontalArrangement = Arrangement.spacedBy(42.dp)) {
            SettingsButton(text = "User profile", iconRes = R.drawable.user_profile){

            }
            SettingsButton(text = "Rover Sharing", iconRes = R.drawable.share){

            }
            SettingsButton(text = "User Manual", iconRes = R.drawable.manual){
                // Test to redirect to a google
                viewModel.openWebPage(context, SettingsLink.GOOGLE)
            }
        }
        Row(horizontalArrangement = Arrangement.spacedBy(42.dp)) {
            SettingsButton(text = "Support", iconRes = R.drawable.support){

            }
            SettingsButton(text = "GPSR", iconRes = R.drawable.gpsr){

            }
            SettingsButton(text = "Privary policy", iconRes = R.drawable.privacy){

            }
            SettingsButton(text = "App info", iconRes = R.drawable.info){

            }
        }
    }
}

@Preview(showBackground = true)
@Composable
fun SettingsScreenPreview() {
    val navController = rememberNavController()
    SettingsScreen(navController = navController)
}