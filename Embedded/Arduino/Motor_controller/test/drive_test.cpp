#include "gtest/gtest.h"
#include "../src/Calculations/Drive.h"
#include <cmath>
// Inkludera mock istället för riktiga MotorController
#include "mocks/MotorControllerMock.h"

using namespace std;

string stateToString(DriveState state) {
    switch(state) {
        case FORWARD:   
            return "FORWARD";
        case BACKWARD:  
            return "BACKWARD";
        case TTL:
            return "TTL";       
        case TTR:
            return "TTR";
        default:   
            return "STOPPED";
    }
}

// New tests after review
// Here I assume that speed can be negative which I don't know if it is correct.

TEST(DriveTest, FullForward) {
    Drive drive(0.0f, 1.0f);

    float speed = drive.CalculateHypotenuse();

    cout << "Expected output: 1.0"
         << "\nActual output: " << speed << endl;

    EXPECT_NEAR(speed, 1.0f, 0.02f)
        << "Expected speed 1.0, but got " << speed;
}

TEST(DriveTest, CalculateHypotenuse) {
    Drive drive(1.0f, 1.0f);
    float expected = 1.4f;
    float actual = drive.CalculateHypotenuse();
    // Skriv ut värden oavsett testresultat:
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_NEAR(actual, expected, 0.02)
        << "Expected output: " << expected << ", Actual output: " << actual;
}

TEST(DriveTest, LeftSpeedFunc) {
    Drive drive(0.5f, 0.5f);
    float expected = 0.5f;
    float actual = drive.CalculateLeftSpeedFunc();
    // Skriv ut värden oavsett testresultat:
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_NEAR(actual, expected, 0.02)
        << "Expected output: " << expected << ", Actual output: " << actual;
}

TEST(DriveTest, RightSpeedFunc) {
    Drive drive(0.5f, 0.5f);
    float expected = 0.25f;
    float actual = drive.CalculateRightSpeedFunc();
    // Skriv ut värden oavsett testresultat:
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_NEAR(actual, expected, 0.02)
        << "Expected output: " << expected << ", Actual output: " << actual;
}

// Testfall för FORWARD: y == 1 och x == 0
TEST(DriveTest, GetStateForward) {
    Drive drive(0.0f, 1.0f);
    DriveState expected = FORWARD;
    DriveState actual = drive.GetState();
    // Skriv ut värden oavsett testresultat:
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_EQ(drive.GetState(), FORWARD) << "Expected FORWARD when (x=0, y=1)";
}

// Testfall för BACKWARD: y == -1 och x == 0
TEST(DriveTest, GetStateBackward) {
    Drive drive(0.0f, -1.0f);
    DriveState expected = BACKWARD;
    DriveState actual = drive.GetState();
    std::cout << "Expected output: " << expected << "\nActual output: " << actual << std::endl;
    EXPECT_EQ(drive.GetState(), BACKWARD) << "Expected BACKWARD when (x=0, y=-1)";
}
// Testfall för Algorithm()-funktionen med capture av stdout
TEST(DriveTest, AlgorithmPrintsForward) {
    Drive drive(0.0f, 1.0f);
    testing::internal::CaptureStdout();
    drive.ExecuteDriveLogic();
    std::string output = testing::internal::GetCapturedStdout();

    // Anpassat för heltals‐utskrift + mock‐rad
    std::string expected =
        "Left Speed: 1, Right Speed: 1\n"
        "State: GO FWD\n"
        "Mock DriveForward: 1, 1\n";

    EXPECT_EQ(output, expected)
        << "Expected:\n" << expected << "\nbut got:\n" << output;
}

// ska ge BACKWARD.
TEST(DriveTest, AlgorithmPrintsBackward) {
    Drive drive(0.0f, -1.0f);
    testing::internal::CaptureStdout();
    drive.ExecuteDriveLogic();
    std::string output = testing::internal::GetCapturedStdout();

    // Anpassat för heltals‐utskrift + mock‐rad
    std::string expected =
        "Left Speed: -1, Right Speed: -1\n"
        "State: GO BWD\n"
        "Mock DriveBackward: -1, -1\n";

    EXPECT_EQ(output, expected)
        << "Expected:\n" << expected << "\nbut got:\n" << output;
}

// ska ge STOPPED
TEST(DriveTest, AlgorithmPrintsSTOPPED) {
    Drive drive(0.0f, 0.0f);
    testing::internal::CaptureStdout();
    drive.ExecuteDriveLogic();
    std::string output = testing::internal::GetCapturedStdout();

    // Anpassat för heltals‐utskrift + mock‐rad
    std::string expected =
        "Left Speed: 0, Right Speed: 0\n"
        "State: STOPPED\n"
        "Mock StopMotors\n";

    EXPECT_EQ(output, expected)
        << "Expected:\n" << expected << "\nbut got:\n" << output;
}

int main(int argc, char **argv) {
    ::testing::InitGoogleTest(&argc, argv);
    return RUN_ALL_TESTS();
}


// TO RUN MY UNIT TESTS
/* 
cmake ..
make
./drive_test
*/