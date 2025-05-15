package se.terrax9.ui.screens.controller

import android.widget.Toast
import androidx.compose.foundation.Image
import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.input.pointer.pointerInput
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.platform.LocalContext
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import kotlinx.coroutines.runBlocking
import se.terrax9.R
import se.terrax9.Routes
import se.terrax9.services.Commands
import se.terrax9.services.DataService
import se.terrax9.services.UserData
import se.terrax9.ui.shared.AppButton
import se.terrax9.ui.theme.LexendExa

@Composable
fun ControllerScreen(viewModel: ControllerViewModel, navController: NavController) {
//    val viewModel: ControllerViewModel = viewModel()

    val serverStatus = viewModel.serverStatus.collectAsState()
    val roverStatus = viewModel.roverStatus.collectAsState()

    Box(modifier = Modifier.fillMaxSize()) {
        Image(
            painter = painterResource(R.drawable.backgroundpicture),
            contentDescription = null,
            contentScale = ContentScale.Crop,
            modifier = Modifier.fillMaxSize()
        )

        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Center
        ) {
            UpperDashboard(viewModel, navController)
            BottomDashboard(viewModel)
        }
    }

//    Column {
//        Spacer(modifier = Modifier.padding(vertical = 60.dp))
//        Text("serverStatus: ${serverStatus.value}", color = Color.White, fontSize = 16.sp)
//        Text("roverStatus: ${roverStatus.value}", color = Color.White, fontSize = 16.sp)
//    }

    val errorFlow = viewModel.errorMessage
    val context = LocalContext.current
    LaunchedEffect(Unit) {
        errorFlow.collect { msg ->
            Toast.makeText(context, msg, Toast.LENGTH_SHORT).show()
        }
    }
}

@Composable
fun UpperDashboard(viewModel: ControllerViewModel, navController: NavController) {
    val isLighted by viewModel.isLighted.collectAsState()
    val serverStatus = viewModel.serverStatus.collectAsState()
    val roverStatus = viewModel.roverStatus.collectAsState()

    Row(
        modifier = Modifier
            .fillMaxHeight(0.6f)
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Left side
        Column(
            verticalArrangement = Arrangement.SpaceEvenly,
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.weight(1f)
        ) {
            // Spacer between buttons
            Spacer(modifier = Modifier.height(40.dp))

            // Connect/Disconnect button
            AppButton(
                text = if (serverStatus.value == ControllerViewModel.ServerStatus.CONNECTED) "DISCONNECT" else "CONNECT"
            ) {
                viewModel.toggleConnect()
            }

            // Spacer between buttons
            Spacer(modifier = Modifier.height(24.dp))

            // Lights section
            Box(contentAlignment = Alignment.Center, modifier = Modifier.weight(1f).fillMaxHeight()) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    Text(if (isLighted) "ON" else "OFF")
                    IconButton(
                        text = "Lights",
                        iconRes = R.drawable.lights,
                        onClick = viewModel::toggleLights
                    )
                }

                // // Overlay when disconnected
                // if (serverStatus.value == ControllerViewModel.ServerStatus.DISCONNECTED) {
                //     DisableBlocker()
                // }
            }
        }

        Box(
            modifier = Modifier
                .weight(3f)
                .fillMaxHeight(),
            contentAlignment = Alignment.TopCenter
        ) {
            VideoStream(
                modifier = Modifier
                    .aspectRatio(ratio = 16f / 9f)
                    .clip(RoundedCornerShape(24.dp))
            )
                if (!viewModel.BACKDOOR && serverStatus.value == ControllerViewModel.ServerStatus.DISCONNECTED) {
                    DisableBlocker()
                }
            }
        }


        // Right side
        Column(
            modifier = Modifier.weight(1f),
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally
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
}

@Composable
fun BottomDashboard(viewModel: ControllerViewModel) {

    val serverStatus = viewModel.serverStatus.collectAsState()
    Box(modifier = Modifier.fillMaxSize()) {
        // Your main dashboard content
        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Bottom
        ) {
            Row(
                modifier = Modifier.fillMaxSize(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceEvenly
            ) {
                JoyStick(
                    onMove = viewModel::sendCommand,
                    getCommand = Commands::steer
                )
                IconButton(
                    text = "Take photo",
                    iconRes = R.drawable.camera,
                    onClick = viewModel::takePhoto
                )

                SliderRow { x, y, z ->
                    viewModel.sendCommand(Commands.steerArm(x, y, z))
                }
            }
        }

        // Semi-transparent overlay when disconnected
        if (!viewModel.BACKDOOR && serverStatus.value == ControllerViewModel.ServerStatus.DISCONNECTED) {
            DisableBlocker()
        }
    }
}

@Composable
fun DisableBlocker() {
    Box(
        modifier = Modifier
            .fillMaxSize()
            .background(Color.Black.copy(alpha = 0.5f))
            .pointerInput(Unit) {} // Intercepts and blocks all touch input
    )
}