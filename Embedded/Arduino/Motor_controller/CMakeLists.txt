cmake_minimum_required(VERSION 3.5)
project(DriveProject)

# C++11
set(CMAKE_CXX_STANDARD 11)
set(CMAKE_CXX_STANDARD_REQUIRED True)

# Your stubs folder
include_directories(test/FakeArduino)

# Build your Drive library
add_library(Drive STATIC
    src/Calculations/Drive.cpp
)

# Pull in GoogleTest (assumes you have external/googletest checked out)
add_subdirectory(external/googletest)

# Enable CTest so we can register and run tests
enable_testing()

# Build the test executable
add_executable(drive_test
    test/drive_test.cpp
)

include_directories(test/FakeMotorController)


# Link your library with GTest's main; GTest::gtest_main pulls in GTest::gtest and pthreads
target_link_libraries(drive_test
    PRIVATE
        Drive
        GTest::gtest_main
)

# Register the test with CTest under the name “DriveTests”
add_test(
    NAME DriveTests
    COMMAND drive_test
)