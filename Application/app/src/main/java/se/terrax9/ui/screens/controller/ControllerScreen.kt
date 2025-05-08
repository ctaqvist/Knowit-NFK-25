package se.terrax9.ui.screens.controller

import androidx.compose.foundation.Image
import androidx.compose.foundation.border
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.Text
import androidx.compose.runtime.*
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.layout.ContentScale
import androidx.compose.ui.res.painterResource
import androidx.compose.ui.unit.dp
import androidx.lifecycle.viewmodel.compose.viewModel
import androidx.navigation.NavController
import se.terrax9.R
import se.terrax9.Routes
import se.terrax9.services.Commands

@Composable
fun ControllerScreen(navController: NavController) {
    val viewModel: ControllerViewModel = viewModel()

    Box(modifier = Modifier.fillMaxSize()) {
        Image(
            painter = painterResource(R.drawable.backgroundpicture),
            contentDescription = null,
            contentScale = ContentScale.Crop,
        )

        Column(
            modifier = Modifier.fillMaxSize(),
            verticalArrangement = Arrangement.Center
        ) {
            UpperDashboard(viewModel, navController)
            BottomDashboard(viewModel)
        }
    }
}

@Composable
fun UpperDashboard(viewModel: ControllerViewModel, navController: NavController) {
    val isLighted by viewModel.isLighted.collectAsState()

    Row(
        modifier = Modifier
            .fillMaxHeight(0.6f)
            .fillMaxWidth(),
        horizontalArrangement = Arrangement.SpaceEvenly,
        verticalAlignment = Alignment.CenterVertically
    ) {
        // Left side
        Column(
            verticalArrangement = Arrangement.Center,
            horizontalAlignment = Alignment.CenterHorizontally,
            modifier = Modifier.weight(1f)
        ) {
            Text(if (isLighted) "ON" else "OFF")
            IconButton(
                text = "Lights",
                iconRes = R.drawable.lights,
                onClick = viewModel::toggleLights
            )
        }

        // Center
        VideoStream(
            modifier = Modifier
                .weight(3f)
                .aspectRatio(ratio = 16f / 9f)
                .border(
                    3.dp, color = Color.White, shape = RoundedCornerShape(size = 12.dp)
                )
                .clip(RoundedCornerShape(24.dp))
        )

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
            JoyStick(
                onMove = viewModel::sendCommand,
                getCommand = Commands::arm,
                isFixed = true
            )
            JoyStick(
                onMove = viewModel::sendCommand,
                getCommand = Commands::claw,
                isFixed = true
            )
        }
    }
}